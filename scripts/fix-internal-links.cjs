/**
 * Fix internal HTML navigation links
 * 
 * Problem: Files in public/assets/laxapellets_se/ have links like "../vara-produkter.html"
 * which incorrectly go UP to public/assets/ instead of staying in laxapellets_se/
 * 
 * Solution: For files at depth 0 (directly in laxapellets_se/), remove the "../" prefix
 * from links that should point to sibling files in the same directory
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'public', 'assets', 'laxapellets_se');

// List of known sibling pages at the root of laxapellets_se
const rootLevelPages = [
  'vara-produkter',
  'varmepellets', 
  'stroprodukter',
  'aterforsaljare',
  'om-laxa-pellets',
  'laxa-pellets-kundtjanst',
  'offert-foretag-foreningar',
  'aktuellt-fran-laxa-pellets',
  'skapa-konto',
  'mitt-konto',
  'kassa',
  'varukorg',
  'faq',
  'leveransvillkor',
  'integritetspolicy',
  'kopvillkor',
  'kundtjanst'
];

function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixLinks(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Get relative path from rootDir to determine depth
  const relativePath = path.relative(rootDir, filePath);
  const depth = relativePath.split(path.sep).length - 1; // -1 because file itself doesn't count
  
  console.log(`Processing: ${relativePath} (depth: ${depth})`);
  
  if (depth === 0) {
    // Files directly in laxapellets_se/ should NOT use ../ for sibling pages
    // Fix: ../page.html -> page.html (for root-level pages)
    
    for (const page of rootLevelPages) {
      // href="../page.html" -> href="page.html"
      content = content.replace(
        new RegExp(`href="\\.\\.\\/` + page.replace(/-/g, '-') + `\\.html"`, 'g'),
        `href="${page}.html"`
      );
      content = content.replace(
        new RegExp(`href='\\.\\.\\/` + page.replace(/-/g, '-') + `\\.html'`, 'g'),
        `href='${page}.html'`
      );
    }
    
    // Also fix subfolders that shouldn't have ../ prefix
    // ../stroprodukter/page.html -> stroprodukter/page.html
    content = content.replace(/href="\.\.\/stroprodukter\//g, 'href="stroprodukter/');
    content = content.replace(/href='\.\.\/stroprodukter\//g, "href='stroprodukter/");
    content = content.replace(/href="\.\.\/produkt\//g, 'href="produkt/');
    content = content.replace(/href='\.\.\/produkt\//g, "href='produkt/");
    content = content.replace(/href="\.\.\/aktuellt\//g, 'href="aktuellt/');
    content = content.replace(/href='\.\.\/aktuellt\//g, "href='aktuellt/");
    content = content.replace(/href="\.\.\/varmepellets\//g, 'href="varmepellets/');
    content = content.replace(/href='\.\.\/varmepellets\//g, "href='varmepellets/");
    
  } else if (depth === 1) {
    // Files one level deep (e.g., produkt/page.html) should use ../ for root pages
    // This is likely correct already, but let's ensure no double ../
    
    for (const page of rootLevelPages) {
      // ../../page.html -> ../page.html (remove one level)
      content = content.replace(
        new RegExp(`href="\\.\\.\\/\\.\\.\\/` + page + `\\.html"`, 'g'),
        `href="../${page}.html"`
      );
    }
    
    // Fix subdirectories at same level
    // ../../stroprodukter/ -> ../stroprodukter/
    content = content.replace(/href="\.\.\/\.\.\/stroprodukter\//g, 'href="../stroprodukter/');
    content = content.replace(/href="\.\.\/\.\.\/produkt\//g, 'href="../produkt/');
    content = content.replace(/href="\.\.\/\.\.\/aktuellt\//g, 'href="../aktuellt/');
    content = content.replace(/href="\.\.\/\.\.\/varmepellets\//g, 'href="../varmepellets/');
    
  } else if (depth >= 2) {
    // Files two or more levels deep need proper pathing
    const correctPrefix = '../'.repeat(depth);
    const wrongPrefix = '../'.repeat(depth + 1);
    
    for (const page of rootLevelPages) {
      // Remove one level of ../
      content = content.replace(
        new RegExp(`href="${wrongPrefix.replace(/\//g, '\\/')}` + page + `\\.html"`, 'g'),
        `href="${correctPrefix}${page}.html"`
      );
    }
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  -> Fixed links');
    return true;
  }
  
  return false;
}

console.log('Scanning for HTML files in:', rootDir);
console.log('');

const htmlFiles = findHtmlFiles(rootDir);
let fixedCount = 0;

for (const file of htmlFiles) {
  if (fixLinks(file)) {
    fixedCount++;
  }
}

console.log('');
console.log(`Done! Fixed ${fixedCount} of ${htmlFiles.length} HTML files.`);

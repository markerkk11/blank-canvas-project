/**
 * Fix relative paths after flattening folder/.html to folder.html
 * Files moved up one directory level, so paths need one less "../"
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'public', 'assets', 'laxapellets_se');

function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html') && item !== 'index.html') {
      // Only process non-index.html files (these are the renamed ones)
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Get relative path from rootDir to determine depth
  const relativePath = path.relative(rootDir, filePath);
  const depth = relativePath.split(path.sep).length - 1; // -1 because file itself doesn't count
  
  console.log(`Processing: ${relativePath} (depth: ${depth})`);
  
  // Files that were folder/.html are now folder.html
  // They moved UP one level, so need one LESS "../"
  
  // Fix patterns: remove one level of "../" from relative paths
  // ../../ becomes ../
  // ../../../ becomes ../../
  // etc.
  
  // Pattern for href, src, srcset with relative paths starting with ../
  // We need to be careful to only fix paths that have the extra "../"
  
  // Replace ../../wp-content with ../wp-content (for files in subfolders like produkt/)
  content = content.replace(/href="\.\.\/\.\.\/wp-content\//g, 'href="../wp-content/');
  content = content.replace(/href='\.\.\/\.\.\/wp-content\//g, "href='../wp-content/");
  content = content.replace(/src="\.\.\/\.\.\/wp-content\//g, 'src="../wp-content/');
  content = content.replace(/src='\.\.\/\.\.\/wp-content\//g, "src='../wp-content/");
  
  // Also fix wp-includes
  content = content.replace(/href="\.\.\/\.\.\/wp-includes\//g, 'href="../wp-includes/');
  content = content.replace(/href='\.\.\/\.\.\/wp-includes\//g, "href='../wp-includes/");
  content = content.replace(/src="\.\.\/\.\.\/wp-includes\//g, 'src="../wp-includes/');
  content = content.replace(/src='\.\.\/\.\.\/wp-includes\//g, "src='../wp-includes/");
  
  // Fix wp-json paths
  content = content.replace(/href="\.\.\/\.\.\/wp-json\//g, 'href="../wp-json/');
  content = content.replace(/src="\.\.\/\.\.\/wp-json\//g, 'src="../wp-json/');
  
  // Fix srcset patterns (common in images)
  content = content.replace(/srcset="([^"]*?)\.\.\/\.\.\/wp-content\//g, 'srcset="$1../wp-content/');
  
  // Fix url() in CSS
  content = content.replace(/url\(\.\.\/\.\.\/wp-content\//g, 'url(../wp-content/');
  content = content.replace(/url\('\.\.\/\.\.\/wp-content\//g, "url('../wp-content/");
  content = content.replace(/url\("\.\.\/\.\.\/wp-content\//g, 'url("../wp-content/');
  
  // For deeper nested files (like aktuellt/page/2.html -> was aktuellt/page/2/.html)
  // ../../../ becomes ../../
  content = content.replace(/href="\.\.\/\.\.\/\.\.\/wp-content\//g, 'href="../../wp-content/');
  content = content.replace(/src="\.\.\/\.\.\/\.\.\/wp-content\//g, 'src="../../wp-content/');
  content = content.replace(/href="\.\.\/\.\.\/\.\.\/wp-includes\//g, 'href="../../wp-includes/');
  content = content.replace(/src="\.\.\/\.\.\/\.\.\/wp-includes\//g, 'src="../../wp-includes/');
  
  // Fix any remaining srcset with multiple image sources
  // Match pattern: 600w, ../.. and replace the ../ 
  content = content.replace(/, \.\.\/\.\.\/wp-content\//g, ', ../wp-content/');
  content = content.replace(/, \.\.\/\.\.\/\.\.\/wp-content\//g, ', ../../wp-content/');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✓ Fixed paths');
    return true;
  }
  
  console.log('  - No changes needed');
  return false;
}

console.log('Scanning for HTML files to fix relative paths...\n');

const htmlFiles = findHtmlFiles(rootDir);
let fixedCount = 0;

for (const file of htmlFiles) {
  if (fixPaths(file)) {
    fixedCount++;
  }
}

console.log(`\nDone! Fixed ${fixedCount} of ${htmlFiles.length} HTML files.`);

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'public');

const replacements = [
  {
    find: 'dist/css/structure.css',
    replace: 'assets/styles/structure.css'
  },
  {
    find: 'https://laxapellets.se/wp-content/themes/laxapellets/assets/../dist/js/main-dist.js',
    replace: '../../wp-content/themes/laxapellets/assets/main-dist.js'
  }
];

// Regex replacement for .webp.html -> .webp (fixes broken image references)
const regexReplacements = [
  {
    pattern: /\.webp\.html/g,
    replace: '.webp'
  },
  {
    pattern: /\.jpg\.html/g,
    replace: '.jpg'
  },
  {
    pattern: /\.png\.html/g,
    replace: '.png'
  },
  {
    // Remove entire header_cart div element (shopping basket)
    pattern: /<div id="header_cart">[\s\S]*?<\/a>\s*<\/div>/g,
    replace: ''
  },
  {
    // Remove shipping-check element
    pattern: /<div class="prod_util prod_util--boxed shipping-check">[\s\S]*?<div id="closest_resellers"><\/div>\s*<\/div>\s*<\/div>/g,
    replace: ''
  }
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

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // String replacements
  for (const { find, replace } of replacements) {
    if (content.includes(find)) {
      content = content.split(find).join(replace);
      modified = true;
    }
  }
  
  // Regex replacements for broken image extensions and cart removal
  for (const { pattern, replace } of regexReplacements) {
    const newContent = content.replace(pattern, replace);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', path.relative(rootDir, filePath));
    return true;
  }
  
  return false;
}

console.log('Scanning for HTML files...\n');

const htmlFiles = findHtmlFiles(rootDir);
let fixedCount = 0;

for (const file of htmlFiles) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\nDone! Fixed ${fixedCount} of ${htmlFiles.length} HTML files.`);

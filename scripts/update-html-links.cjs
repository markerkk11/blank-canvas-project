/**
 * Update all HTML links from folder/.html to folder.html format
 * Run this script after renaming files
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'public');

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

function updateLinks(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Pattern 1: href="...folder/.html" → href="...folder.html"
  content = content.replace(/href="([^"]*?)\/\.html"/g, 'href="$1.html"');
  
  // Pattern 2: href='...folder/.html' → href='...folder.html'
  content = content.replace(/href='([^']*?)\/\.html'/g, "href='$1.html'");
  
  // Pattern 3: src="...folder/.html" → src="...folder.html"
  content = content.replace(/src="([^"]*?)\/\.html"/g, 'src="$1.html"');
  
  // Pattern 4: action="...folder/.html" → action="...folder.html"
  content = content.replace(/action="([^"]*?)\/\.html"/g, 'action="$1.html"');
  
  // Pattern 5: url(...folder/.html) in CSS/style
  content = content.replace(/url\(([^)]*?)\/\.html\)/g, 'url($1.html)');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', path.relative(rootDir, filePath));
    return true;
  }
  
  return false;
}

console.log('Scanning for HTML files...\n');

const htmlFiles = findHtmlFiles(rootDir);
let updatedCount = 0;

for (const file of htmlFiles) {
  if (updateLinks(file)) {
    updatedCount++;
  }
}

console.log(`\nDone! Updated ${updatedCount} of ${htmlFiles.length} HTML files.`);

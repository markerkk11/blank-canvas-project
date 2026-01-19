const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'public');

// Regex to match the breadcrumbs div and its contents
const breadcrumbsPattern = /<div id="breadcrumbs">[\s\S]*?<\/div>\s*<\/div>/g;

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

function removeBreadcrumbs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const newContent = content.replace(breadcrumbsPattern, '');
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Removed breadcrumbs:', path.relative(rootDir, filePath));
    return true;
  }
  
  return false;
}

console.log('Scanning for HTML files to remove breadcrumbs...\n');

const htmlFiles = findHtmlFiles(rootDir);
let fixedCount = 0;

for (const file of htmlFiles) {
  if (removeBreadcrumbs(file)) {
    fixedCount++;
  }
}

console.log(`\nDone! Removed breadcrumbs from ${fixedCount} of ${htmlFiles.length} HTML files.`);

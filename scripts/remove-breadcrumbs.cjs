const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function findHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
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
  
  // Remove breadcrumbs div
  const pattern = /<div id="breadcrumbs">[\s\S]*?<\/div>\s*<\/div>/g;
  const newContent = content.replace(pattern, '');
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Removed breadcrumbs:', path.relative(publicDir, filePath));
    return true;
  }
  
  return false;
}

console.log('Scanning for HTML files in public/...\n');

const htmlFiles = findHtmlFiles(publicDir);
let fixedCount = 0;

for (const file of htmlFiles) {
  if (removeBreadcrumbs(file)) {
    fixedCount++;
  }
}

console.log(`\n✓ Removed breadcrumbs from ${fixedCount} of ${htmlFiles.length} HTML files.`);

/**
 * Fix all HTML paths - removes assets/laxapellets_se/ from all paths
 * Run with: node scripts/fix-paths.cjs
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Global replacement of assets/laxapellets_se/
  content = content.replace(/assets\/laxapellets_se\//g, '');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function findHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  const skip = ['wp-content', 'wp-includes', 'wp-json', 'wp-admin', 'node_modules'];
  
  for (const item of items) {
    if (skip.includes(item)) continue;
    
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

console.log('Finding HTML files...');
const files = findHtmlFiles(publicDir);
console.log(`Found ${files.length} HTML files`);

let fixed = 0;
for (const file of files) {
  if (processFile(file)) {
    console.log(`Fixed: ${path.relative(publicDir, file)}`);
    fixed++;
  }
}

console.log(`\nDone! Fixed ${fixed} files.`);

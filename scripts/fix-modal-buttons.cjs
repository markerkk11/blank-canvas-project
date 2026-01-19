/**
 * Fix modal button issues:
 * 1. Wrong script path (../../js/lead-modal.js -> ../js/lead-modal.js for produkt/ files)
 * 2. Missing onclick handler on buy-request-container buttons
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
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  const relativePath = path.relative(rootDir, filePath);
  const depth = relativePath.split(path.sep).length - 1;
  
  console.log(`Processing: ${relativePath} (depth: ${depth})`);
  
  // Fix 1: Correct the lead-modal.js path based on file depth
  // Files at depth 0 (in laxapellets_se/) should use js/lead-modal.js
  // Files at depth 1 (in laxapellets_se/produkt/) should use ../js/lead-modal.js
  // Files at depth 2+ should use ../../js/lead-modal.js etc.
  
  const correctJsPath = depth === 0 ? 'js/lead-modal.js' : '../'.repeat(depth) + 'js/lead-modal.js';
  const correctCssPath = depth === 0 ? 'css/lead-modal.css' : '../'.repeat(depth) + 'css/lead-modal.css';
  
  // Fix wrong JS paths - match any number of ../
  content = content.replace(
    /<script src="(?:\.\.\/)*js\/lead-modal\.js"><\/script>/g,
    `<script src="${correctJsPath}"></script>`
  );
  
  // Fix wrong CSS paths
  content = content.replace(
    /<link rel="stylesheet" href="(?:\.\.\/)*css\/lead-modal\.css" \/>/g,
    `<link rel="stylesheet" href="${correctCssPath}" />`
  );
  
  // Fix 2: Add onclick handler to buttons missing it
  // Match buttons in buy-request-container that don't have onclick
  content = content.replace(
    /<div class="buy-request-container"([^>]*)>\s*<button type="button" class="button button-primary"(?![^>]*onclick)([^>]*)>/g,
    '<div class="buy-request-container"$1>\n\t\t\t\t\t\t<button type="button" class="button button-primary" onclick="if(window.openLeadModal) window.openLeadModal();"$2>'
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  -> Fixed');
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

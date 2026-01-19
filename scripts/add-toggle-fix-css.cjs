/**
 * Script to add toggle-fix.css link to all HTML files in laxapellets_se folder
 * Run with: node scripts/add-toggle-fix-css.cjs
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../public/assets/laxapellets_se');

function processHtmlFile(filePath, relativePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has toggle-fix.css
  if (content.includes('toggle-fix.css')) {
    console.log(`Skipping ${relativePath} - already has toggle-fix.css`);
    return false;
  }
  
  // Determine the path depth and corresponding CSS path
  const depth = relativePath.split('/').length - 1;
  let cssPath;
  
  if (depth === 0) {
    // Root level files
    cssPath = 'css/toggle-fix.css';
  } else if (depth === 1) {
    // One level deep (e.g., produkt/, aktuellt/, stroprodukter/)
    cssPath = '../css/toggle-fix.css';
  } else {
    // Two or more levels deep
    cssPath = '../'.repeat(depth) + 'css/toggle-fix.css';
  }
  
  // Try to find and replace the pattern with lead-modal.css first
  const leadModalPatterns = [
    /<link rel="stylesheet" href="css\/lead-modal\.css" \/>\s*<\/head>/,
    /<link rel="stylesheet" href="\.\.\/css\/lead-modal\.css" \/>\s*<\/head>/,
    /<link rel="stylesheet" href="\/css\/lead-modal\.css" \/>\s*<\/head>/,
    /<link rel="stylesheet" href="\.\.\/\.\.\/css\/lead-modal\.css" \/>\s*<\/head>/,
  ];
  
  let replaced = false;
  for (const pattern of leadModalPatterns) {
    if (pattern.test(content)) {
      const match = content.match(pattern);
      if (match) {
        const replacement = match[0].replace('</head>', `\n<link rel="stylesheet" href="${cssPath}" />\n</head>`);
        content = content.replace(pattern, replacement);
        replaced = true;
        break;
      }
    }
  }
  
  // If no lead-modal pattern found, try to insert before </head>
  if (!replaced && content.includes('</head>')) {
    content = content.replace('</head>', `<link rel="stylesheet" href="${cssPath}" />\n</head>`);
    replaced = true;
  }
  
  if (replaced) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added toggle-fix.css to ${relativePath} (path: ${cssPath})`);
    return true;
  }
  
  console.log(`Warning: Could not add toggle-fix.css to ${relativePath}`);
  return false;
}

function walkDir(dir, relativePath = '') {
  const files = fs.readdirSync(dir);
  let count = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = relativePath ? `${relativePath}/${file}` : file;
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (!['css', 'js', 'wp-admin', 'wp-includes', 'wp-json', 'assets', 'wp-content'].includes(file)) {
        count += walkDir(fullPath, relPath);
      }
    } else if (file.endsWith('.html')) {
      if (processHtmlFile(fullPath, relPath)) {
        count++;
      }
    }
  }
  
  return count;
}

console.log('Adding toggle-fix.css to HTML files in laxapellets_se folder...\n');
const total = walkDir(baseDir);
console.log(`\nDone! Added toggle-fix.css to ${total} files.`);

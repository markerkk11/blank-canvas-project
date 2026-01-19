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

  // Normalize WordPress-style asset paths so they always point to the correct
  // folder inside /assets/laxapellets_se, regardless of how deep the HTML file is.
  //
  // Example:
  // - /assets/laxapellets_se/vara-produkter.html        -> wp-content/...
  // - /assets/laxapellets_se/produkt/foo.html          -> ../wp-content/...
  // - /assets/laxapellets_se/aktuellt/page/2.html      -> ../../wp-content/...
  const prefix = depth === 0 ? '' : '../'.repeat(depth);

  const normalizeFolderRefs = (folder) => {
    // href/src attributes
    content = content.replace(
      new RegExp(`(href|src)=(["'])(?:\\.\\.\\/)+${folder}\\/`, 'g'),
      `$1=$2${prefix}${folder}/`
    );

    // srcset may contain multiple URLs
    content = content.replace(
      new RegExp(`(?:\\.\\.\\/)+${folder}\\/`, 'g'),
      `${prefix}${folder}/`
    );

    // url() in inline styles or style blocks
    content = content.replace(
      new RegExp(`url\\((["']?)(?:\\.\\.\\/)+${folder}\\/`, 'g'),
      `url($1${prefix}${folder}/`
    );
  };

  normalizeFolderRefs('wp-content');
  normalizeFolderRefs('wp-includes');
  normalizeFolderRefs('wp-json');

  // Note: we intentionally do NOT touch external-tracker folders like
  // connect_facebook_net/ since their location may differ from wp-* folders.
  
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

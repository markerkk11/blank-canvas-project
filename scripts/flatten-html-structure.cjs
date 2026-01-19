/**
 * Flatten HTML Structure
 * 
 * Converts: folder/.html → folder.html
 * Updates all internal links accordingly
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '../public/assets/laxapellets_se');

// Track all renames for link updates
const renames = [];

/**
 * Recursively find all .html dotfiles
 */
function findDotHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Check if this directory contains a .html file
      const dotHtmlPath = path.join(fullPath, '.html');
      if (fs.existsSync(dotHtmlPath)) {
        files.push({
          oldPath: dotHtmlPath,
          newPath: fullPath + '.html',
          folderToRemove: fullPath,
          folderName: item
        });
      }
      // Continue searching subdirectories
      findDotHtmlFiles(fullPath, files);
    }
  }
  
  return files;
}

/**
 * Update links in an HTML file
 */
function updateLinksInFile(filePath, renames) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const rename of renames) {
    // Get relative paths for replacement
    const folderName = rename.folderName;
    
    // Pattern: href="...folder/.html" → href="...folder.html"
    const pattern1 = new RegExp(`(href=["'])([^"']*/${folderName})/\\.html(["'])`, 'g');
    const replacement1 = `$1$2.html$3`;
    
    // Pattern: href="...folder/" → href="...folder.html"
    const pattern2 = new RegExp(`(href=["'])([^"']*/${folderName})/(["'])`, 'g');
    const replacement2 = `$1$2.html$3`;
    
    // Pattern: href="folder/.html" (relative)
    const pattern3 = new RegExp(`(href=["'])(${folderName})/\\.html(["'])`, 'g');
    const replacement3 = `$1$2.html$3`;
    
    // Pattern: href="folder/" (relative)
    const pattern4 = new RegExp(`(href=["'])(${folderName})/(["'])`, 'g');
    const replacement4 = `$1$2.html$3`;
    
    // Pattern for src attributes too
    const pattern5 = new RegExp(`(src=["'])([^"']*/${folderName})/\\.html(["'])`, 'g');
    const replacement5 = `$1$2.html$3`;

    const before = content;
    content = content
      .replace(pattern1, replacement1)
      .replace(pattern2, replacement2)
      .replace(pattern3, replacement3)
      .replace(pattern4, replacement4)
      .replace(pattern5, replacement5);
    
    if (content !== before) {
      modified = true;
    }
  }
  
  // Also fix generic patterns:
  // "../folder/.html" → "../folder.html"
  const genericPattern = /([^"']*\/[a-z0-9-]+)\/\.html/gi;
  const beforeGeneric = content;
  content = content.replace(genericPattern, '$1.html');
  if (content !== beforeGeneric) {
    modified = true;
  }
  
  // "folder/" at end of href → "folder.html" (for directories that were converted)
  // Be careful not to replace asset folders
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

/**
 * Find all HTML files for link updating
 */
function findAllHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (!['wp-content', 'wp-includes', 'wp-admin', 'wp-json', 'css', 'js', 'assets'].includes(item)) {
        findAllHtmlFiles(fullPath, files);
      }
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
console.log('🔍 Finding .html dotfiles...\n');

const dotHtmlFiles = findDotHtmlFiles(BASE_DIR);
console.log(`Found ${dotHtmlFiles.length} .html dotfiles to convert:\n`);

// Sort by depth (deepest first) to avoid issues when removing folders
dotHtmlFiles.sort((a, b) => b.oldPath.split('/').length - a.oldPath.split('/').length);

// Preview changes
console.log('📋 Planned renames:');
for (const file of dotHtmlFiles.slice(0, 20)) {
  const relOld = path.relative(BASE_DIR, file.oldPath);
  const relNew = path.relative(BASE_DIR, file.newPath);
  console.log(`  ${relOld} → ${relNew}`);
}
if (dotHtmlFiles.length > 20) {
  console.log(`  ... and ${dotHtmlFiles.length - 20} more`);
}

console.log('\n📁 Renaming files...');

let renamed = 0;
let errors = 0;

for (const file of dotHtmlFiles) {
  try {
    // Read the content
    const content = fs.readFileSync(file.oldPath, 'utf8');
    
    // Write to new location
    fs.writeFileSync(file.newPath, content, 'utf8');
    
    // Remove old file
    fs.unlinkSync(file.oldPath);
    
    // Try to remove the now-empty folder
    try {
      const remaining = fs.readdirSync(file.folderToRemove);
      if (remaining.length === 0) {
        fs.rmdirSync(file.folderToRemove);
      }
    } catch (e) {
      // Folder not empty or other issue, skip
    }
    
    renames.push(file);
    renamed++;
  } catch (err) {
    console.error(`  ❌ Error processing ${file.oldPath}: ${err.message}`);
    errors++;
  }
}

console.log(`\n✅ Renamed ${renamed} files (${errors} errors)`);

// Now update links in all HTML files
console.log('\n🔗 Updating links in HTML files...');

const allHtmlFiles = findAllHtmlFiles(BASE_DIR);
// Also include the main public directory
const publicHtmlFiles = fs.readdirSync(path.join(__dirname, '../public'))
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(__dirname, '../public', f));

const allFiles = [...allHtmlFiles, ...publicHtmlFiles];
console.log(`Found ${allFiles.length} HTML files to update`);

let updated = 0;
for (const htmlFile of allFiles) {
  try {
    if (updateLinksInFile(htmlFile, renames)) {
      updated++;
      const rel = path.relative(path.join(__dirname, '..'), htmlFile);
      console.log(`  ✏️  Updated: ${rel}`);
    }
  } catch (err) {
    console.error(`  ❌ Error updating ${htmlFile}: ${err.message}`);
  }
}

console.log(`\n✅ Updated links in ${updated} files`);
console.log('\n🎉 Done! Your HTML structure is now flattened.');
console.log('   Old: folder/.html');
console.log('   New: folder.html');

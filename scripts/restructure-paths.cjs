const fs = require('fs');
const path = require('path');

const sourceRoot = path.join(__dirname, '..', 'public', 'assets', 'laxapellets_se');
const targetRoot = path.join(__dirname, '..', 'public'); // HTML files go directly to public/

// Directories that should remain as assets (not converted to pages)
const assetDirs = ['css', 'js', 'wp-content', 'wp-includes', 'wp-admin', 'assets', 'wp-json'];

// Track all HTML files to process
const htmlFiles = [];

function findHtmlFiles(dir, relativePath = '') {
  if (!fs.existsSync(dir)) return;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const itemRelativePath = relativePath ? path.join(relativePath, item) : item;
    
    // Skip asset directories
    if (stat.isDirectory() && assetDirs.includes(item)) {
      continue;
    }
    
    if (stat.isDirectory()) {
      findHtmlFiles(fullPath, itemRelativePath);
    } else if (item === '.html') {
      // This is a page file like /produkt/laxa-kutterspan/.html
      htmlFiles.push({
        source: fullPath,
        relativePath: relativePath, // The directory path becomes the filename
        type: 'directory-page'
      });
    } else if (item === 'index.html') {
      htmlFiles.push({
        source: fullPath,
        relativePath: relativePath,
        type: 'index'
      });
    } else if (item.endsWith('.html')) {
      // Skip .html files inside wp-content (image wrappers)
      if (relativePath.includes('wp-content')) {
        continue;
      }
      htmlFiles.push({
        source: fullPath,
        relativePath: itemRelativePath,
        type: 'named'
      });
    }
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function updateAssetPaths(content, targetPath) {
  let updated = content;
  
  // Calculate depth from target HTML to public/
  const relativeToTarget = path.relative(targetRoot, targetPath);
  const pathParts = relativeToTarget.split(path.sep);
  const depth = pathParts.length - 1; // -1 because the file itself is one level
  
  // Path from HTML file to public/ folder, then to assets/laxapellets_se/
  // e.g., if file is at produkt/laxa-kutterspan.html (depth 1)
  // we need ../assets/laxapellets_se/ to reach assets
  const upLevels = depth + 1; // +1 to go up to public root
  const toAssets = '../'.repeat(upLevels) + 'assets/laxapellets_se/';
  
  // For absolute paths, use /assets/laxapellets_se/
  const absAssets = '/assets/laxapellets_se/';
  
  // Replace various relative path patterns to assets
  // Handle: ../../wp-content, ../wp-content, ./wp-content, wp-content (at start)
  const assetFolders = ['wp-content', 'wp-includes', 'wp-admin', 'css', 'js', 'assets'];
  
  for (const folder of assetFolders) {
    // Match patterns like href="../../wp-content/ or src='../wp-content/
    const relativePattern = new RegExp(`(href|src|content)=(["'])((?:\\.\\.\\/)+)${folder}\\/`, 'g');
    updated = updated.replace(relativePattern, `$1=$2${absAssets}${folder}/`);
    
    // Match patterns starting with just the folder name (no ../)
    const directPattern = new RegExp(`(href|src)=(["'])${folder}\\/`, 'g');
    updated = updated.replace(directPattern, `$1=$2${absAssets}${folder}/`);
    
    // Match url() in styles
    const urlPattern = new RegExp(`url\\((["']?)((?:\\.\\.\\/)+)${folder}\\/`, 'g');
    updated = updated.replace(urlPattern, `url($1${absAssets}${folder}/`);
  }
  
  // Fix internal page links - now without /laxapellets_se/ prefix
  // Pattern: href="/produkt/laxa-kutterspan/" -> href="/produkt/laxa-kutterspan.html"
  // But keep external links and asset links
  updated = updated.replace(/href=(["'])\/(?!assets\/|http|#)([^"']*?)\/(["'])/g, (match, q1, pagePath, q2) => {
    const cleanPath = pagePath.replace(/\/$/, '');
    if (!cleanPath) return `href=${q1}/index.html${q2}`;
    return `href=${q1}/${cleanPath}.html${q2}`;
  });
  
  // Pattern: href="/produkt/laxa-kutterspan" (no trailing slash)
  updated = updated.replace(/href=(["'])\/(?!assets\/|http|#)([a-zA-Z0-9\-_\/]+)(["'])/g, (match, q1, pagePath, q2) => {
    // Skip if already has extension
    if (/\.(html|css|js|jpg|jpeg|png|webp|svg|gif|pdf|xml|json)$/i.test(pagePath)) {
      return match;
    }
    const cleanPath = pagePath.replace(/\/$/, '');
    return `href=${q1}/${cleanPath}.html${q2}`;
  });
  
  // Fix root link "/" to go to /index.html
  updated = updated.replace(/href=(["'])\/(["'])/g, `href=$1/index.html$2`);
  
  // Fix breadcrumb and other links with single quotes too
  updated = updated.replace(/href='\/(?!assets\/|http|#)([^']*?)\/'/g, (match, pagePath) => {
    const cleanPath = pagePath.replace(/\/$/, '');
    if (!cleanPath) return `href='/index.html'`;
    return `href='/${cleanPath}.html'`;
  });
  
  updated = updated.replace(/href='\/(?!assets\/|http|#)([a-zA-Z0-9\-_\/]+)'/g, (match, pagePath) => {
    if (/\.(html|css|js|jpg|jpeg|png|webp|svg|gif|pdf|xml|json)$/i.test(pagePath)) {
      return match;
    }
    const cleanPath = pagePath.replace(/\/$/, '');
    return `href='/${cleanPath}.html'`;
  });
  
  // Remove any /laxapellets_se/ prefix from links (cleanup)
  updated = updated.replace(/href=(["'])\/laxapellets_se\//g, `href=$1/`);
  
  return updated;
}

function processFiles() {
  console.log('Scanning for HTML files in public/assets/laxapellets_se/...\n');
  findHtmlFiles(sourceRoot);
  
  console.log(`Found ${htmlFiles.length} HTML files to process.\n`);
  
  // Create target directory
  ensureDir(targetRoot);
  
  let processedCount = 0;
  
  for (const file of htmlFiles) {
    let targetPath;
    
    if (file.type === 'index') {
      // index.html in root stays as index.html
      if (file.relativePath === '') {
        targetPath = path.join(targetRoot, 'index.html');
      } else {
        // index.html in subdirectory - might want to keep or convert
        targetPath = path.join(targetRoot, file.relativePath, 'index.html');
      }
    } else if (file.type === 'directory-page') {
      // .html files in directories become directory-name.html
      // e.g., produkt/laxa-kutterspan/.html -> produkt/laxa-kutterspan.html
      if (file.relativePath === '') {
        targetPath = path.join(targetRoot, 'index.html');
      } else {
        const parts = file.relativePath.split(path.sep);
        const fileName = parts.pop() + '.html';
        if (parts.length > 0) {
          targetPath = path.join(targetRoot, ...parts, fileName);
        } else {
          targetPath = path.join(targetRoot, fileName);
        }
      }
    } else {
      // Named .html files
      targetPath = path.join(targetRoot, file.relativePath);
    }
    
    // Read content
    let content = fs.readFileSync(file.source, 'utf8');
    
    // Update asset paths
    content = updateAssetPaths(content, targetPath);
    
    // Ensure target directory exists
    ensureDir(path.dirname(targetPath));
    
    // Write file
    fs.writeFileSync(targetPath, content, 'utf8');
    
    const sourceRel = path.relative(sourceRoot, file.source);
    const targetRel = path.relative(targetRoot, targetPath);
    console.log(`${sourceRel} -> ${targetRel}`);
    processedCount++;
  }
  
  console.log(`\n✓ Processed ${processedCount} HTML files.`);
  console.log(`\nNew structure:`);
  console.log(`  Pages: public/ (e.g., /produkt/laxa-kutterspan.html)`);
  console.log(`  Assets: public/assets/laxapellets_se/`);
  console.log(`\nExample URLs:`);
  console.log(`  /index.html (home)`);
  console.log(`  /produkt/laxa-kutterspan.html`);
  console.log(`  /vara-produkter.html`);
}

processFiles();

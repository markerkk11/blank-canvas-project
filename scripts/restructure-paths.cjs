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

  // For absolute paths, use /assets/laxapellets_se/
  const absAssets = '/assets/laxapellets_se/';

  // Asset folders to fix
  const assetFolders = ['wp-content', 'wp-includes', 'wp-admin', 'css', 'js', 'assets', 'wp-json'];
  const externalDirs = ['connect_facebook_net', 'www_google-analytics_com', 'www_googletagmanager_com'];
  const allAssetDirs = [...assetFolders, ...externalDirs];

  for (const folder of allAssetDirs) {
    // href/src/content="../../folder/..." => /assets/laxapellets_se/folder/...
    const relativePattern = new RegExp(`(href|src|content)=(["'])((?:\\.\\.\\/)+)${folder}\\/`, 'g');
    updated = updated.replace(relativePattern, `$1=$2${absAssets}${folder}/`);

    // href/src="folder/..." => /assets/laxapellets_se/folder/...
    const directPattern = new RegExp(`(href|src)=(["'])${folder}\\/`, 'g');
    updated = updated.replace(directPattern, `$1=$2${absAssets}${folder}/`);

    // url(../../folder/...) => url(/assets/laxapellets_se/folder/...)
    const urlRelativePattern = new RegExp(`url\\((["']?)((?:\\.\\.\\/)+)${folder}\\/`, 'g');
    updated = updated.replace(urlRelativePattern, `url($1${absAssets}${folder}/`);

    // url("folder/...) => url("/assets/laxapellets_se/folder/...)
    const urlDirectPattern = new RegExp(`url\\((["']?)${folder}\\/`, 'g');
    updated = updated.replace(urlDirectPattern, `url($1${absAssets}${folder}/`);
  }

  // Fix extracted_styles.css
  updated = updated.replace(/(href|src)=(["'])(?:\.\.\/)*extracted_styles\.css/g,
    `$1=$2${absAssets}extracted_styles.css`);

  // Fix lead modal assets injected as /css/... or /js/...
  updated = updated.replace(/(href|src)=(["'])\/(css|js)\/(lead-modal\.(?:css|js))/g,
    `$1=$2${absAssets}$3/$4`);

  // Fix srcset values like: srcset="wp-content/... 600w, wp-content/... 768w"
  updated = updated.replace(/srcset=(["'])([^"']*)\1/g, (match, quote, value) => {
    const parts = value
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((entry) => {
        const [rawUrl, ...rest] = entry.split(/\s+/);
        if (!rawUrl) return entry;

        // Ignore absolute/external/data URLs
        if (
          /^(https?:)?\/\//i.test(rawUrl) ||
          rawUrl.startsWith('data:') ||
          rawUrl.startsWith('blob:') ||
          rawUrl.startsWith('/')
        ) {
          return entry;
        }

        let url = rawUrl.replace(/^\.\//, '').replace(/^(\.\.\/)+/, '');

        const isAsset = allAssetDirs.some((f) => url.startsWith(`${f}/`));

        if (isAsset) url = `${absAssets}${url}`;

        return [url, ...rest].join(' ');
      });

    return `srcset=${quote}${parts.join(', ')}${quote}`;
  });

  // Fix url(...) in inline styles that have relative paths
  updated = updated.replace(/url\((["']?)(?:\.\.\/)*([a-zA-Z0-9_\-\/]+\.(jpg|jpeg|png|webp|svg|gif))\1\)/g,
    (match, quote, path) => {
      // Check if this path starts with an asset folder
      const isAsset = allAssetDirs.some((f) => path.startsWith(`${f}/`));
      if (isAsset) {
        return `url(${quote}${absAssets}${path}${quote})`;
      }
      return match;
    });

  // Fix all remaining ../something patterns that should point to assets
  updated = updated.replace(/(href|src)=(["'])(?:\.\.\/)+([a-zA-Z0-9_\-]+\.(css|js|json|xml|ico|png|jpg|jpeg|webp|svg|gif))/g,
    `$1=$2${absAssets}$3`);

  // Fix internal page links
  // Pattern: href="/produkt/laxa-kutterspan/" -> href="/produkt/laxa-kutterspan.html"
  updated = updated.replace(/href=(["'])\/(?!assets\/|http|#)([^"']*?)\/(["'])/g, (match, q1, pagePath, q2) => {
    const cleanPath = pagePath.replace(/\/$/, '');
    if (!cleanPath) return `href=${q1}/index.html${q2}`;
    return `href=${q1}/${cleanPath}.html${q2}`;
  });

  // Pattern: href="/produkt/laxa-kutterspan" (no trailing slash)
  updated = updated.replace(/href=(["'])\/(?!assets\/|http|#)([a-zA-Z0-9\-_\/]+)(["'])/g, (match, q1, pagePath, q2) => {
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

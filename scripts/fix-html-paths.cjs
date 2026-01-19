const fs = require('fs');
const path = require('path');

// This script applies fixes to HTML files in public/assets/laxapellets_se/
// It fixes asset paths and internal links

const rootDir = path.join(__dirname, '..', 'public', 'assets', 'laxapellets_se');
const assetsBaseUrl = '/assets/laxapellets_se';

// Replacements to apply to all HTML files
const regexReplacements = [
  {
    // Redirect logo link to main index page
    pattern: /<a href="https:\/\/laxapellets\.se">/g,
    replace: '<a href="/assets/laxapellets_se/index.html">'
  },
  {
    // Remove mobile "Skapa konto" navigation
    pattern: /<nav id="mob_user_nav"[^>]*>[\s\S]*?<\/nav>/g,
    replace: ''
  },
  {
    // Replace login_to_buy div with lead modal button
    pattern: /<div id="login_to_buy">[\s\S]*?<\/div>\s*<\/div>/g,
    replace: `<div class="buy-request-container" style="margin-top: 20px;">
						<button type="button" class="button button-primary" onclick="if(window.openLeadModal) window.openLeadModal();" style="width: 100%; padding: 15px 30px; font-size: 18px; font-weight: bold; background-color: #1d525c; color: white; border: none; border-radius: 5px; cursor: pointer;">
							Skicka köpförfrågan
						</button>
					</div>`
  }
];

function findHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip wp-content HTML wrapper files
      if (!fullPath.includes('wp-content')) {
        findHtmlFiles(fullPath, files);
      }
    } else if (item.endsWith('.html') || item === '.html') {
      files.push(fullPath);
    }
  }
  
  return files;
}

function getRelativeDepth(filePath) {
  const relativePath = path.relative(rootDir, filePath);
  const parts = relativePath.split(path.sep);
  // Count directory depth (subtract 1 for the file itself)
  return Math.max(0, parts.length - 1);
}

function fixAssetPaths(content, filePath) {
  let updated = content;
  
  // Fix relative paths like ../extracted_styles.css, ../wp-content/, etc.
  // Replace with absolute paths to /assets/laxapellets_se/
  
  const assetFolders = ['wp-content', 'wp-includes', 'wp-admin', 'css', 'js', 'assets'];
  
  // Fix: href="../something" or src="../something" -> absolute paths
  for (const folder of assetFolders) {
    // Match ../ patterns (any depth) to asset folders
    const pattern = new RegExp(`(href|src|content)=(["'])((?:\\.\\.\\/)+)${folder}\\/`, 'g');
    updated = updated.replace(pattern, `$1=$2${assetsBaseUrl}/${folder}/`);
    
    // Match direct folder references
    const directPattern = new RegExp(`(href|src)=(["'])${folder}\\/`, 'g');
    updated = updated.replace(directPattern, `$1=$2${assetsBaseUrl}/${folder}/`);
  }
  
  // Fix extracted_styles.css path
  updated = updated.replace(/(href|src)=(["'])(?:\.\.\/)*extracted_styles\.css/g, 
    `$1=$2${assetsBaseUrl}/extracted_styles.css`);
  
  // Fix other relative paths like ../connect_facebook_net/, ../www_google-analytics_com/, etc.
  const externalDirs = ['connect_facebook_net', 'www_google-analytics_com', 'www_googletagmanager_com'];
  for (const dir of externalDirs) {
    const pattern = new RegExp(`(href|src)=(["'])(?:\\.\\.\\/)+${dir}\\/`, 'g');
    updated = updated.replace(pattern, `$1=$2${assetsBaseUrl}/${dir}/`);
  }
  
  // Fix internal page links - convert to correct paths within /assets/laxapellets_se/
  // href="produkt/name/.html" -> href="/assets/laxapellets_se/produkt/name/.html"
  // href="../produkt/name/" -> href="/assets/laxapellets_se/produkt/name/.html"
  
  // Fix links that go up directories and then to pages
  updated = updated.replace(/href=(["'])(?:\.\.\/)+([a-zA-Z0-9\-_\/]+)\/?(?:\.html)?(["'])/g, (match, q1, pagePath, q2) => {
    const cleanPath = pagePath.replace(/\/$/, '');
    if (cleanPath.includes('.')) return match; // Skip file extensions
    return `href=${q1}${assetsBaseUrl}/${cleanPath}/.html${q2}`;
  });
  
  // Fix absolute links to laxapellets.se
  updated = updated.replace(/href=(["'])https?:\/\/laxapellets\.se\/([^"']*)(["'])/g, (match, q1, pagePath, q2) => {
    const cleanPath = pagePath.replace(/\/$/, '');
    if (!cleanPath) return `href=${q1}${assetsBaseUrl}/index.html${q2}`;
    if (cleanPath.includes('.')) return match; // Has extension
    return `href=${q1}${assetsBaseUrl}/${cleanPath}/.html${q2}`;
  });
  
  return updated;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix asset paths first
  const pathFixed = fixAssetPaths(content, filePath);
  if (pathFixed !== content) {
    content = pathFixed;
    modified = true;
  }
  
  // Apply regex replacements
  for (const { pattern, replace } of regexReplacements) {
    const newContent = content.replace(pattern, replace);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }
  
  // Inject lead-modal.css before </head> if not already present
  if (!content.includes('lead-modal.css') && content.includes('</head>')) {
    const cssLink = `<link rel="stylesheet" href="${assetsBaseUrl}/css/lead-modal.css" />\n</head>`;
    content = content.replace('</head>', cssLink);
    modified = true;
  }
  
  // Inject lead-modal.js before </body> if not already present
  if (!content.includes('lead-modal.js') && content.includes('</body>')) {
    const jsScript = `<script src="${assetsBaseUrl}/js/lead-modal.js"></script>\n</body>`;
    content = content.replace('</body>', jsScript);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', path.relative(rootDir, filePath));
    return true;
  }
  
  return false;
}

// Check if the structure exists
if (!fs.existsSync(rootDir)) {
  console.log('Error: public/assets/laxapellets_se/ does not exist.');
  process.exit(1);
}

console.log('Scanning for HTML files in public/assets/laxapellets_se/...\n');

const htmlFiles = findHtmlFiles(rootDir);
let fixedCount = 0;

for (const file of htmlFiles) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✓ Fixed ${fixedCount} of ${htmlFiles.length} HTML files.`);

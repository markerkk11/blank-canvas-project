const fs = require('fs');
const path = require('path');

// This script runs AFTER restructure-paths.cjs
// It applies additional fixes to HTML files in public/laxapellets_se/

const rootDir = path.join(__dirname, '..', 'public', 'laxapellets_se');
const assetsDir = path.join(__dirname, '..', 'public', 'assets', 'laxapellets_se');

// Replacements to apply to all HTML files
const regexReplacements = [
  {
    // Redirect logo link to main index page
    pattern: /<a href="https:\/\/laxapellets\.se">/g,
    replace: '<a href="/laxapellets_se/index.html">'
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
      findHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function getRelativePathToAssets(filePath) {
  const fileDir = path.dirname(filePath);
  const relativePath = path.relative(fileDir, assetsDir);
  return relativePath.replace(/\\/g, '/');
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
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
    const basePath = getRelativePathToAssets(filePath);
    const cssLink = `<link rel="stylesheet" href="${basePath}/css/lead-modal.css" />\n</head>`;
    content = content.replace('</head>', cssLink);
    modified = true;
  }
  
  // Inject lead-modal.js before </body> if not already present
  if (!content.includes('lead-modal.js') && content.includes('</body>')) {
    const basePath = getRelativePathToAssets(filePath);
    const jsScript = `<script src="${basePath}/js/lead-modal.js"></script>\n</body>`;
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

// Check if the new structure exists
if (!fs.existsSync(rootDir)) {
  console.log('Error: public/laxapellets_se/ does not exist.');
  console.log('Please run "node scripts/restructure-paths.cjs" first.');
  process.exit(1);
}

console.log('Scanning for HTML files in public/laxapellets_se/...\n');

const htmlFiles = findHtmlFiles(rootDir);
let fixedCount = 0;

for (const file of htmlFiles) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✓ Fixed ${fixedCount} of ${htmlFiles.length} HTML files.`);

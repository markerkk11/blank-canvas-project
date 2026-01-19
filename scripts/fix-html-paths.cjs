const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'public');

const replacements = [
  {
    find: 'dist/css/structure.css',
    replace: 'assets/styles/structure.css'
  },
  {
    find: 'https://laxapellets.se/wp-content/themes/laxapellets/assets/../dist/js/main-dist.js',
    replace: '../../wp-content/themes/laxapellets/assets/main-dist.js'
  }
];

// Regex replacement for .webp.html -> .webp (fixes broken image references)
const regexReplacements = [
  {
    pattern: /\.webp\.html/g,
    replace: '.webp'
  },
  {
    pattern: /\.jpg\.html/g,
    replace: '.jpg'
  },
  {
    pattern: /\.png\.html/g,
    replace: '.png'
  },
  {
    // Remove entire header_cart div element (shopping basket)
    pattern: /<div id="header_cart">[\s\S]*?<\/a>\s*<\/div>/g,
    replace: ''
  },
  {
    // Remove shipping-check element
    pattern: /<div class="prod_util prod_util--boxed shipping-check">[\s\S]*?<div id="closest_resellers"><\/div>\s*<\/div>\s*<\/div>/g,
    replace: ''
  },
  {
    // Remove login link
    pattern: /<a[^>]*class="login_item"[^>]*>[\s\S]*?<\/a>/g,
    replace: ''
  },
  {
    // Remove mobile "Skapa konto" navigation
    pattern: /<nav id="mob_user_nav"[^>]*>[\s\S]*?<\/nav>/g,
    replace: ''
  },
  {
    // Replace login_to_buy div with buy request button
    pattern: /<div id="login_to_buy">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    replace: `<div class="buy-request-container" style="margin-top: 20px;">
						<button type="button" class="button button-primary buy-request-btn" style="width: 100%; padding: 15px 30px; font-size: 18px; font-weight: bold; background-color: #1d525c; color: white; border: none; border-radius: 5px; cursor: pointer;">
							Skicka köpförfrågan
						</button>
					</div>`
  }
];

// CSS and JS includes for lead modal
const leadModalCSS = '<link rel="stylesheet" href="../../css/lead-modal.css" />';
const leadModalJS = '<script src="../../js/lead-modal.js"></script>';

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

function isProductPage(filePath) {
  return filePath.includes('/produkt/');
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // String replacements
  for (const { find, replace } of replacements) {
    if (content.includes(find)) {
      content = content.split(find).join(replace);
      modified = true;
    }
  }
  
  // Regex replacements for broken image extensions and cart removal
  for (const { pattern, replace } of regexReplacements) {
    const newContent = content.replace(pattern, replace);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }
  
  // Add lead modal CSS and JS to product pages
  if (isProductPage(filePath)) {
    // Add CSS before </head> if not already present
    if (!content.includes('lead-modal.css')) {
      content = content.replace('</head>', `${leadModalCSS}\n</head>`);
      modified = true;
    }
    
    // Add JS before </body> if not already present
    if (!content.includes('lead-modal.js')) {
      content = content.replace('</body>', `${leadModalJS}\n</body>`);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', path.relative(rootDir, filePath));
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

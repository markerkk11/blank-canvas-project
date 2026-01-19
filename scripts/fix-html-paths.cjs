const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'public');

// Replacements to apply to all HTML files
const regexReplacements = [
  {
    // Remove mobile "Skapa konto" navigation
    pattern: /<nav id="mob_user_nav"[^>]*>[\s\S]*?<\/nav>/g,
    replace: ''
  },
  {
    // Replace login_to_buy div with lead modal button (same style as buy-request-container)
    pattern: /<div id="login_to_buy">[\s\S]*?<\/div>\s*<\/div>/g,
    replace: `<div class="buy-request-container" style="margin-top: 20px;">
						<button type="button" class="button button-primary" onclick="if(window.openLeadModal) window.openLeadModal();" style="width: 100%; padding: 15px 30px; font-size: 18px; font-weight: bold; background-color: #1d525c; color: white; border: none; border-radius: 5px; cursor: pointer;">
							Skicka köpförfrågan
						</button>
					</div>`
  }
];

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
  let modified = false;
  
  // Regex replacements
  for (const { pattern, replace } of regexReplacements) {
    const newContent = content.replace(pattern, replace);
    if (newContent !== content) {
      content = newContent;
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

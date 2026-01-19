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
    // Replace login_to_buy div with lead modal button
    pattern: /<div id="login_to_buy">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    replace: `<div id="lead_buy_button" class="lead-buy-section">
      <h2>Skicka köpförfrågan</h2>
      <p>Intresserad av denna produkt? Skicka en köpförfrågan så kontaktar vi dig med prisuppgift och leveransinformation.</p>
      <button type="button" class="lead-modal-trigger single-button" onclick="if(window.openLeadModal) window.openLeadModal();">
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

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'public');

// Folders that should NOT be processed (they're WordPress assets)
const skipDirs = ['wp-content', 'wp-includes', 'wp-json', 'wp-admin', 'assets'];

// Replacements to apply to all HTML files
const regexReplacements = [
  {
    // Redirect logo link to main index page
    pattern: /<a href="https:\/\/laxapellets\.se">/g,
    replace: '<a href="/">'
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
  },
  {
    // Fix paths: folder/.html → folder.html
    pattern: /href="([^"]*?)\/\.html"/g,
    replace: 'href="$1.html"'
  },
  {
    // Fix relative paths: ../folder/.html → ../folder.html
    pattern: /href="(\.\.\/[^"]*?)\/\.html"/g,
    replace: 'href="$1.html"'
  },
  {
    // Fix FAQ link (absolute)
    pattern: /<a href="\/kundtjanst"/g,
    replace: '<a href="/laxa-pellets-kundtjanst.html"'
  },
  {
    // Fix Leveransvillkor link (absolute)
    pattern: /<a href="\/kopvillkor"/g,
    replace: '<a href="/kopvillkor.html"'
  },
  {
    // Remove breadcrumbs
    pattern: /<div id="breadcrumbs">[\s\S]*?<\/div>\s*<\/div>\s*/g,
    replace: ''
  },
  {
    // Remove old /assets/laxapellets_se/ prefix from absolute paths
    pattern: /href="\/assets\/laxapellets_se\//g,
    replace: 'href="/'
  },
  {
    pattern: /src="\/assets\/laxapellets_se\//g,
    replace: 'src="/'
  }
];

function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip WordPress asset directories
      if (skipDirs.includes(item)) continue;
      findHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function getRelativePrefix(filePath) {
  // Calculate how many levels deep the file is from public root
  const relativePath = path.relative(rootDir, filePath);
  const depth = relativePath.split(path.sep).length - 1; // -1 because file itself doesn't count
  return depth === 0 ? '' : '../'.repeat(depth);
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const prefix = getRelativePrefix(filePath);
  const relativePath = path.relative(rootDir, filePath);
  
  console.log(`Processing: ${relativePath} (prefix: "${prefix || '(none)'}")`);
  
  // Regex replacements
  for (const { pattern, replace } of regexReplacements) {
    const newContent = content.replace(pattern, replace);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }
  
  // Fix extracted_styles.css path - point to css/extracted_styles.css
  const extractedCssPatterns = [
    /href="(?:\.\.\/)*extracted_styles\.css"/g,
    /href="\.\.\/extracted_styles\.css"/g,
  ];
  for (const pattern of extractedCssPatterns) {
    const newContent = content.replace(pattern, `href="${prefix}css/extracted_styles.css"`);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }
  
  // Fix toggle-fix.css path
  if (!content.includes('toggle-fix.css')) {
    // Add if missing
  }
  const toggleFixPattern = /href="(?:\.\.\/)*css\/toggle-fix\.css"/g;
  const newToggle = content.replace(toggleFixPattern, `href="${prefix}css/toggle-fix.css"`);
  if (newToggle !== content) {
    content = newToggle;
    modified = true;
  }
  
  // Inject lead-modal.css before </head> if not already present
  if (!content.includes('lead-modal.css') && content.includes('</head>')) {
    const cssLink = `<link rel="stylesheet" href="${prefix}css/lead-modal.css" />\n</head>`;
    content = content.replace('</head>', cssLink);
    modified = true;
  } else if (content.includes('lead-modal.css')) {
    // Fix existing lead-modal.css path
    const leadCssPattern = /href="(?:\.\.\/)*css\/lead-modal\.css"/g;
    const newLeadCss = content.replace(leadCssPattern, `href="${prefix}css/lead-modal.css"`);
    if (newLeadCss !== content) {
      content = newLeadCss;
      modified = true;
    }
  }
  
  // Inject lead-modal.js before </body> if not already present
  if (!content.includes('lead-modal.js') && content.includes('</body>')) {
    const jsScript = `<script src="${prefix}js/lead-modal.js"></script>\n</body>`;
    content = content.replace('</body>', jsScript);
    modified = true;
  } else if (content.includes('lead-modal.js')) {
    // Fix existing lead-modal.js path
    const leadJsPattern = /src="(?:\.\.\/)*js\/lead-modal\.js"/g;
    const newLeadJs = content.replace(leadJsPattern, `src="${prefix}js/lead-modal.js"`);
    if (newLeadJs !== content) {
      content = newLeadJs;
      modified = true;
    }
  }
  
  // Normalize wp-content, wp-includes, wp-json, wp-admin paths for this file's depth
  const wpFolders = ['wp-content', 'wp-includes', 'wp-json', 'wp-admin'];
  for (const folder of wpFolders) {
    // Fix relative paths - too many or too few ../
    const tooManyPattern = new RegExp(`(href|src)=(["'])(?:\\.\\.\\/){2,}${folder}\\/`, 'g');
    let newContent = content.replace(tooManyPattern, `$1=$2${prefix}${folder}/`);
    
    // Fix srcset paths
    const srcsetPattern = new RegExp(`(?:\\.\\.\\/){2,}${folder}\\/`, 'g');
    newContent = newContent.replace(srcsetPattern, `${prefix}${folder}/`);
    
    // Fix url() in styles
    const urlPattern = new RegExp(`url\\((["']?)(?:\\.\\.\\/){2,}${folder}\\/`, 'g');
    newContent = newContent.replace(urlPattern, `url($1${prefix}${folder}/`);
    
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✓ Fixed');
    return true;
  }
  
  console.log('  - No changes');
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

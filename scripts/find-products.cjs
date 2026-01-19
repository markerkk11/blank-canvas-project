const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'public');

// Product categorization
const productCategories = {
  varmepellets: [
    'varmepellets-6mm',
    'varmepellets-8mm',
    'varmepellets-8mm-bulk',
    'storsack-varmepellets-8mm'
  ],
  stroprodukter: [
    'laxa-finspan',
    'laxa-kutterspan',
    'stropellets',
    'storsack-stropellets-8mm'
  ]
};

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

function categorizeProduct(filePath) {
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  
  // Check if it's a product page
  if (!relativePath.includes('/produkt/')) {
    return null;
  }
  
  // Extract product name from path
  const match = relativePath.match(/\/produkt\/([^/]+)\//);
  if (!match) return null;
  
  const productName = match[1];
  
  // Categorize
  if (productCategories.varmepellets.includes(productName)) {
    return { name: productName, category: 'Värmepellets', path: relativePath };
  } else if (productCategories.stroprodukter.includes(productName)) {
    return { name: productName, category: 'Ströprodukter', path: relativePath };
  } else {
    return { name: productName, category: 'Okategoriserad', path: relativePath };
  }
}

console.log('Scanning for product pages...\n');

const htmlFiles = findHtmlFiles(rootDir);
const products = {
  'Värmepellets': [],
  'Ströprodukter': [],
  'Okategoriserad': []
};

for (const file of htmlFiles) {
  const product = categorizeProduct(file);
  if (product) {
    products[product.category].push(product);
  }
}

console.log('=== VÄRMEPELLETS ===');
for (const p of products['Värmepellets']) {
  console.log(`  - ${p.name}: ${p.path}`);
}

console.log('\n=== STRÖPRODUKTER ===');
for (const p of products['Ströprodukter']) {
  console.log(`  - ${p.name}: ${p.path}`);
}

if (products['Okategoriserad'].length > 0) {
  console.log('\n=== OKATEGORISERADE ===');
  for (const p of products['Okategoriserad']) {
    console.log(`  - ${p.name}: ${p.path}`);
  }
}

console.log(`\nTotal: ${products['Värmepellets'].length} värmepellets, ${products['Ströprodukter'].length} ströprodukter`);

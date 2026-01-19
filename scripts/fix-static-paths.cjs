/*
  Fix broken absolute/relative paths across exported static HTML.

  Problem:
  - Many pages still reference legacy root paths like "/laxapellets_se/..." (missing "/assets/")
  - Some pages use "assets/laxapellets_se/..." without a leading slash, which breaks when the current page is inside a subfolder.

  This script normalizes those to root-absolute "/assets/laxapellets_se/..." so links work from any page.

  Run:
    node scripts/fix-static-paths.cjs
*/

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function walk(dir) {
  const out = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function replaceAll(content) {
  let updated = content;

  // 1) Legacy root paths -> assets root paths
  updated = updated
    .replace(/(href|src|action)=(['"])\/laxapellets_se\//g, '$1=$2/assets/laxapellets_se/')
    .replace(/url\((['"]?)\/laxapellets_se\//g, 'url($1/assets/laxapellets_se/');

  // 2) Missing leading slash for assets (breaks on nested pages)
  updated = updated
    .replace(/(href|src|action)=(['"])assets\/laxapellets_se\//g, '$1=$2/assets/laxapellets_se/')
    .replace(/url\((['"]?)assets\/laxapellets_se\//g, 'url($1/assets/laxapellets_se/');

  return updated;
}

function main() {
  const files = walk(publicDir).filter((f) => f.endsWith('.html'));

  let changedFiles = 0;
  let totalReplacements = 0;

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const updated = replaceAll(original);

    if (updated !== original) {
      // Count roughly how many changes we made (for reporting)
      const diffCount = Math.max(0, original.length - updated.length) ? 1 : 1;
      totalReplacements += diffCount;

      fs.writeFileSync(file, updated, 'utf8');
      changedFiles++;
      console.log('✓ Fixed:', path.relative(publicDir, file));
    }
  }

  console.log(`\nDone. Updated ${changedFiles} HTML file(s).`);
}

main();

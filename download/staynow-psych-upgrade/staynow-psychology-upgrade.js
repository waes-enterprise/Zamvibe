#!/usr/bin/env node
/**
 * StayNow Psychology-Focused UI Upgrade — Installer
 * ==================================================
 * 
 * Run in your StayNow project root:
 *   node staynow-psychology-upgrade.js
 * 
 * What it does:
 * - Copies 10 realistic Zambian lodge seed data
 * - Upgrades UI with psychology-driven design
 * - Adds urgency, trust signals, micro-interactions
 * - "No online payment — pay on arrival" messaging
 */

const fs = require('fs');
const path = require('path');

// Get the directory where this script lives
const scriptDir = __dirname;
const projectRoot = process.cwd();

// Files to copy: [source relative to scriptDir, destination relative to projectRoot]
const fileMap = [
  ['prisma/seed.ts', 'prisma/seed.ts'],
  ['src/app/globals.css', 'src/app/globals.css'],
  ['src/app/layout.tsx', 'src/app/layout.tsx'],
  ['src/app/page.tsx', 'src/app/page.tsx'],
  ['src/components/lodge-card.tsx', 'src/components/lodge-card.tsx'],
  ['src/app/lodges/page.tsx', 'src/app/lodges/page.tsx'],
  ['src/app/lodges/[id]/page.tsx', 'src/app/lodges/[id]/page.tsx'],
  ['src/app/reservations/[id]/page.tsx', 'src/app/reservations/[id]/page.tsx'],
];

let written = 0;
let errors = 0;

console.log('');
console.log('╔══════════════════════════════════════════════╗');
console.log('║  StayNow Psychology UI Upgrade — Installer   ║');
console.log('╚══════════════════════════════════════════════╝');
console.log('');

for (const [src, dest] of fileMap) {
  const srcPath = path.join(scriptDir, src);
  const destPath = path.join(projectRoot, dest);
  
  if (!fs.existsSync(srcPath)) {
    console.log('  SKIP (not found): ' + src);
    errors++;
    continue;
  }
  
  // Ensure destination directory exists
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Copy file
  fs.copyFileSync(srcPath, destPath);
  console.log('  Written: ' + dest);
  written++;
}

console.log('');
console.log('────────────────────────────────────────────');
if (errors > 0) {
  console.log('  Completed with ' + errors + ' errors, ' + written + ' files written.');
} else {
  console.log('  All ' + written + ' files written successfully!');
}
console.log('');
console.log('Next steps:');
console.log('  1. Seed database:  npx prisma db seed');
console.log('  2. Test locally:   npm run dev');
console.log('  3. Commit & push:  git add . && git commit -m "feat: psychology UI upgrade" && git push');
console.log('');

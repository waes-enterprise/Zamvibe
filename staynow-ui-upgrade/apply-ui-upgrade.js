/**
 * StayNow UI Upgrade — Apply Script (Node.js)
 * =============================================
 * Run from your StayNow project root:
 *   node apply-ui-upgrade.js
 *
 * This upgrades:
 * - Home page (premium dark hero, floating shapes, featured lodges)
 * - Lodge cards (badges, ratings, hover animations)
 * - Lodges page (filter pills, sort, skeleton loading, friendly empty state)
 * - Lodge detail (hero image, trust signals, urgency, fixed bottom CTA)
 * - Reservation status (countdown timer, status timeline, animations)
 * - Global CSS (custom animations, scrollbar, card hover)
 * - 12 AI-generated lodge images
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RED = '\x1b[0;31m';
const GREEN = '\x1b[0;32m';
const YELLOW = '\x1b[1;33m';
const CYAN = '\x1b[0;36m';
const BOLD = '\x1b[1m';
const NC = '\x1b[0m';

let created = 0;
let skipped = 0;
let errors = 0;

function log(msg, color = '') {
  console.log(`${color}${msg}${NC}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest, description) {
  ensureDir(path.dirname(dest));
  if (!fs.existsSync(src)) {
    log(`  ❌ Source not found: ${src}`, RED);
    errors++;
    return;
  }
  fs.copyFileSync(src, dest);
  log(`  ✓ ${description}: ${path.relative(process.cwd(), dest)}`, GREEN);
  created++;
}

function writeFile(dest, content, description) {
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, content, 'utf-8');
  log(`  ✓ ${description}`, GREEN);
  created++;
}

// ============================================================
// MAIN
// ============================================================

log('\n' + '='.repeat(55), CYAN);
log('  StayNow UI Upgrade', BOLD);
log('  Premium design · Micro-interactions · Trust signals', CYAN);
log('='.repeat(55) + '\n', CYAN);

// Verify project root
if (!fs.existsSync('package.json')) {
  log('❌ Error: No package.json found. Run this from your project root.', RED);
  process.exit(1);
}
log('✓ Found package.json\n', GREEN);

// ---- Step 1: Install framer-motion ----
log('📦 Step 1: Checking dependencies...', CYAN);
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  if (!deps['framer-motion']) {
    log('  Installing framer-motion...', YELLOW);
    execSync('npm install framer-motion', { stdio: 'inherit', timeout: 60000 });
    log('  ✓ framer-motion installed', GREEN);
  } else {
    log('  ✓ framer-motion already installed', GREEN);
  }

  if (!deps['sonner']) {
    log('  Installing sonner...', YELLOW);
    execSync('npm install sonner', { stdio: 'inherit', timeout: 60000 });
    log('  ✓ sonner installed', GREEN);
  } else {
    log('  ✓ sonner already installed', GREEN);
  }

  if (!deps['lucide-react']) {
    log('  Installing lucide-react...', YELLOW);
    execSync('npm install lucide-react', { stdio: 'inherit', timeout: 60000 });
    log('  ✓ lucide-react installed', GREEN);
  } else {
    log('  ✓ lucide-react already installed', GREEN);
  }
} catch (e) {
  log(`  ⚠ Dependency check error: ${e.message}`, YELLOW);
}

// ---- Step 2: Copy files ----
log('\n📁 Step 2: Applying UI upgrade files...', CYAN);

// Determine the script location — files should be in the same directory as this script
const scriptDir = path.dirname(process.argv[1]);
const upgradeDir = scriptDir;

// Home page
copyFile(
  path.join(upgradeDir, 'src', 'app', 'page.tsx'),
  'src/app/page.tsx',
  'Home page (hero + featured lodges + trust bar)'
);

// Layout
copyFile(
  path.join(upgradeDir, 'src', 'app', 'layout.tsx'),
  'src/app/layout.tsx',
  'Root layout (updated theme + meta tags)'
);

// Global CSS
copyFile(
  path.join(upgradeDir, 'src', 'app', 'globals.css'),
  'src/app/globals.css',
  'Global styles (animations, scrollbar, card hover)'
);

// Lodges page
copyFile(
  path.join(upgradeDir, 'src', 'app', 'lodges', 'page.tsx'),
  'src/app/lodges/page.tsx',
  'Lodges page (filters, sort, empty state)'
);

// Lodge detail page
copyFile(
  path.join(upgradeDir, 'src', 'app', 'lodges', '[id]', 'page.tsx'),
  path.join('src', 'app', 'lodges', '[id]', 'page.tsx'),
  'Lodge detail (trust signals, urgency, CTA)'
);

// Reservation status page
copyFile(
  path.join(upgradeDir, 'src', 'app', 'reservations', '[id]', 'page.tsx'),
  path.join('src', 'app', 'reservations', '[id]', 'page.tsx'),
  'Reservation status (countdown, timeline)'
);

// Lodge card component
copyFile(
  path.join(upgradeDir, 'src', 'components', 'lodge-card.tsx'),
  'src/components/lodge-card.tsx',
  'Lodge card component (badges, ratings, hover)'
);

// Lodge images
log('\n🖼️  Step 3: Copying lodge images...', CYAN);
ensureDir('public/lodges');
const imagesDir = path.join(upgradeDir, 'public', 'lodges');
if (fs.existsSync(imagesDir)) {
  const images = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg'));
  images.forEach(img => {
    copyFile(
      path.join(imagesDir, img),
      path.join('public', 'lodges', img),
      `Image: ${img}`
    );
  });
  if (images.length === 0) {
    log('  ⚠ No images found in upgrade package', YELLOW);
  }
} else {
  log('  ⚠ No images directory found in upgrade package', YELLOW);
}

// ---- Step 4: Check for sonner component ----
log('\n🔧 Step 4: Verifying toast setup...', CYAN);
const sonnerPath = 'src/components/ui/sonner.tsx';
if (!fs.existsSync(sonnerPath)) {
  log('  Creating sonner component...', YELLOW);
  writeFile(sonnerPath, `"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
`, 'Sonner toast component');
}

// ---- Step 5: Check for Dialog component (used in lodge detail) ----
log('\n🔧 Step 5: Verifying Dialog component...', CYAN);
const dialogPath = 'src/components/ui/dialog.tsx';
if (!fs.existsSync(dialogPath)) {
  log('  ⚠ Dialog component not found. You may need: npx shadcn@latest add dialog', YELLOW);
  log('  Or the lodge detail reservation modal won\'t work.', YELLOW);
} else {
  log('  ✓ Dialog component found', GREEN);
}

// ---- Summary ----
log('\n' + '='.repeat(55), CYAN);
log('  SUMMARY', BOLD);
log('='.repeat(55), CYAN);
log(`  Files created: ${created}`, GREEN);
log(`  Errors: ${errors}`, errors > 0 ? RED : GREEN);
log('');

if (errors > 0) {
  log('❌ Some errors occurred. Review above.', RED);
} else {
  log('🎉 UI upgrade applied successfully!', GREEN);
  log('\nNext steps:', CYAN);
  log('  1. Review the changes: npm run dev', CYAN);
  log('  2. Test the build: npm run build', CYAN);
  log('  3. Commit and push:', CYAN);
  log('     git add .', CYAN);
  log('     git commit -m "feat: premium UI upgrade with animations, trust signals, and micro-interactions"', CYAN);
  log('     git push origin main', CYAN);
}

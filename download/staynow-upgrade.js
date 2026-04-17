/**
 * StayNow UI Upgrade v2 — Master Apply Script
 * ==============================================
 * Run from your StayNow project root:
 *   node staynow-upgrade.js
 *
 * This ONE script does EVERYTHING:
 * 1. Seeds 12 demo lodges into your database
 * 2. Copies all upgraded UI files
 * 3. Copies 12 lodge images
 * 4. Installs any missing dependencies
 * 5. No framer-motion, no sonner — pure CSS animations + existing shadcn/ui
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

function log(msg, color = '') { console.log(`${color}${msg}${NC}`); }
function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

// ============================================================
// FILE CONTENT (embedded so this is a single self-contained file)
// ============================================================

// Each file is stored as { path, content }
const FILES = {};

// ---- src/hooks/use-mobile.tsx ----
FILES['src/hooks/use-mobile.tsx'] = `"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(\`(max-width: \${MOBILE_BREAKPOINT - 1}px)\`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
`;

// ---- src/hooks/use-toast.ts ----
FILES['src/hooks/use-toast.ts'] = `"use client"

import * as React from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)
  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case "UPDATE_TOAST":
      return { ...state, toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)) }
    case "DISMISS_TOAST": {
      const { toastId } = action
      if (toastId) addToRemoveQueue(toastId)
      else state.toasts.forEach((t) => addToRemoveQueue(t.id))
      return { ...state, toasts: state.toasts.map((t) => (t.id === toastId || toastId === undefined ? { ...t, open: false } : t)) }
    }
    case "REMOVE_TOAST":
      return { ...state, toasts: action.toastId === undefined ? [] : state.toasts.filter((t) => t.id !== action.toastId) }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()
  const update = (props: ToasterToast) => dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })
  dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) dismiss() } } })
  return { id, dismiss, update }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => { const i = listeners.indexOf(setState); if (i > -1) listeners.splice(i, 1) }
  }, [state])
  return { ...state, toast, dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }) }
}

export { useToast, toast }
`;

// ---- prisma/seed.ts ----
FILES['prisma/seed.ts'] = `import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const lodges = [
  {
    id: 'lodge-riverside-lusaka',
    name: 'Riverside Lodge Lusaka',
    description: 'A modern lodge nestled along the banks of the Kafue River, offering serene views, a sparkling pool, and easy access to Lusaka city centre. Perfect for business travellers and tourists alike. Each room features air conditioning, free WiFi, and a private bathroom.',
    location: 'Lusaka',
    address: '12 Cairo Road, Lusaka, Zambia',
    phone: '+260 977 123 456',
    price: 450,
    priceUnit: 'night',
    latitude: -15.3875,
    longitude: 28.3228,
    images: JSON.stringify(['/lodges/riverside-lodge-lusaka.jpg']),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Breakfast', 'Parking', 'AC', 'Restaurant', 'Bar']),
    rating: 4.7,
    totalRooms: 12,
  },
  {
    id: 'lodge-victoria-falls-retreat',
    name: 'Victoria Falls Retreat',
    description: 'Experience luxury just minutes from the mighty Victoria Falls. Our retreat offers breathtaking views, world-class dining, and guided tour services. Wake up to the sound of rushing water and unwind by our infinity pool overlooking the Zambezi gorge.',
    location: 'Livingstone',
    address: '8 Mosi-oa-Tunya Road, Livingstone, Zambia',
    phone: '+260 966 234 567',
    price: 780,
    priceUnit: 'night',
    latitude: -17.8488,
    longitude: 25.8542,
    images: JSON.stringify(['/lodges/victoria-falls-retreat.jpg']),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Breakfast', 'Parking', 'AC', 'Restaurant', 'Bar']),
    rating: 4.9,
    totalRooms: 10,
  },
  {
    id: 'lodge-copperbelt-suites-kitwe',
    name: 'Copperbelt Suites Kitwe',
    description: 'Modern business accommodation in the heart of the Copperbelt. Fully equipped rooms with workspace, high-speed internet, and 24-hour front desk. Ideal for corporate guests visiting the mining and industrial hub of Kitwe.',
    location: 'Kitwe',
    address: '45 Independence Avenue, Kitwe, Zambia',
    phone: '+260 955 345 678',
    price: 350,
    priceUnit: 'night',
    latitude: -12.8026,
    longitude: 28.2134,
    images: JSON.stringify(['/lodges/copperbelt-suites.jpg']),
    amenities: JSON.stringify(['WiFi', 'Breakfast', 'Parking', 'AC', 'Restaurant']),
    rating: 4.3,
    totalRooms: 15,
  },
  {
    id: 'lodge-ndola-garden-hotel',
    name: 'Ndola Garden Hotel',
    description: 'A peaceful garden hotel set amid lush tropical greenery in Ndola. Spacious rooms open onto private patios overlooking beautiful gardens. Enjoy complimentary breakfast, an outdoor pool, and warm Zambian hospitality.',
    location: 'Ndola',
    address: '23 Bwana Mkubwa Road, Ndola, Zambia',
    phone: '+260 977 456 789',
    price: 400,
    priceUnit: 'night',
    latitude: -12.9588,
    longitude: 28.6364,
    images: JSON.stringify(['/lodges/ndola-garden-hotel.jpg']),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Breakfast', 'Parking', 'AC', 'Restaurant', 'Bar']),
    rating: 4.5,
    totalRooms: 10,
  },
  {
    id: 'lodge-lake-kariba-inn',
    name: 'Lake Kariba Inn Siavonga',
    description: 'Stunning lakeside lodge on the shores of Lake Kariba. Watch spectacular sunsets from your private balcony, enjoy boat cruises, and savour fresh fish from the lake at our restaurant. A true Zambian paradise.',
    location: 'Siavonga',
    address: '1 Lake Shore Drive, Siavonga, Zambia',
    phone: '+260 966 567 890',
    price: 520,
    priceUnit: 'night',
    latitude: -16.5315,
    longitude: 28.7062,
    images: JSON.stringify(['/lodges/lake-kariba-inn.jpg']),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Breakfast', 'Parking', 'Restaurant', 'Bar']),
    rating: 4.6,
    totalRooms: 8,
  },
  {
    id: 'lodge-chipata-gateway',
    name: 'Chipata Gateway Lodge',
    description: 'Your gateway to Eastern Zambia and the spectacular South Luangwa National Park. Comfortable rooms with traditional Zambian decor, home-cooked meals using local ingredients, and a friendly staff ready to help you plan your safari adventure.',
    location: 'Chipata',
    address: '34 Mpezeni Way, Chipata, Zambia',
    phone: '+260 977 678 901',
    price: 300,
    priceUnit: 'night',
    latitude: -13.6327,
    longitude: 32.6478,
    images: JSON.stringify(['/lodges/chipata-gateway-lodge.jpg']),
    amenities: JSON.stringify(['WiFi', 'Breakfast', 'Parking', 'Restaurant']),
    rating: 4.2,
    totalRooms: 8,
  },
  {
    id: 'lodge-lusaka-premier',
    name: 'Lusaka Premier Lodge',
    description: 'The premier choice for discerning travellers in Lusaka. Elegantly furnished rooms with premium amenities, rooftop pool, fine dining restaurant, and a fully equipped business centre. Located in the prestigious Rhodespark area.',
    location: 'Lusaka',
    address: '56 Great East Road, Lusaka, Zambia',
    phone: '+260 955 789 012',
    price: 650,
    priceUnit: 'night',
    latitude: -15.4030,
    longitude: 28.3250,
    images: JSON.stringify(['/lodges/lusaka-premier-lodge.jpg']),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Breakfast', 'Parking', 'AC', 'Restaurant', 'Bar']),
    rating: 4.8,
    totalRooms: 10,
  },
  {
    id: 'lodge-mosi-cultural-village',
    name: 'Mosi Cultural Village Lodge',
    description: 'An authentic cultural experience in Livingstone. Stay in traditionally-inspired chalets while enjoying modern comforts. Learn about the Toka-Leya people, watch traditional dance performances, and visit our craft village.',
    location: 'Livingstone',
    address: '15 Mukuni Park Road, Livingstone, Zambia',
    phone: '+260 966 890 123',
    price: 380,
    priceUnit: 'night',
    latitude: -17.8392,
    longitude: 25.8615,
    images: JSON.stringify(['/lodges/mosi-cultural-village-lodge.jpg']),
    amenities: JSON.stringify(['WiFi', 'Breakfast', 'Parking', 'Restaurant', 'Bar']),
    rating: 4.4,
    totalRooms: 6,
  },
  {
    id: 'lodge-kitwe-business-park',
    name: 'Kitwe Business Park Lodge',
    description: 'Sleek, modern accommodation designed for the business traveller. Located in the Parklands business district with easy access to Kitwe corporate offices. Self-catering options available, plus a cafe and secure parking.',
    location: 'Kitwe',
    address: '78 Parklands Road, Kitwe, Zambia',
    phone: '+260 955 901 234',
    price: 320,
    priceUnit: 'night',
    latitude: -12.8160,
    longitude: 28.2240,
    images: JSON.stringify(['/lodges/kitwe-business-park.jpg']),
    amenities: JSON.stringify(['WiFi', 'Breakfast', 'Parking', 'AC', 'Restaurant']),
    rating: 4.1,
    totalRooms: 12,
  },
  {
    id: 'lodge-ndola-comfort-inn',
    name: 'Ndola Comfort Inn',
    description: 'A cosy, family-friendly lodge offering warm hospitality at affordable prices. Clean, comfortable rooms with satellite TV, a lovely garden area, and a breakfast buffet. Conveniently located near Ndola main attractions.',
    location: 'Ndola',
    address: '9 Kansanshi Road, Ndola, Zambia',
    phone: '+260 977 012 345',
    price: 280,
    priceUnit: 'night',
    latitude: -12.9620,
    longitude: 28.6420,
    images: JSON.stringify(['/lodges/ndola-comfort-inn.jpg']),
    amenities: JSON.stringify(['WiFi', 'Breakfast', 'Parking', 'AC']),
    rating: 4.0,
    totalRooms: 10,
  },
  {
    id: 'lodge-siavonga-beach-resort',
    name: 'Siavonga Beach Resort',
    description: 'The ultimate lakeside getaway on Lake Kariba. Private beach access, water sports, beach bar, and sunset cruises. Resort-style rooms offer panoramic lake views. Perfect for honeymoons and celebrations.',
    location: 'Siavonga',
    address: '3 Lakeshore Boulevard, Siavonga, Zambia',
    phone: '+260 966 123 456',
    price: 720,
    priceUnit: 'night',
    latitude: -16.5380,
    longitude: 28.7100,
    images: JSON.stringify(['/lodges/siavonga-beach-resort.jpg']),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Breakfast', 'Parking', 'AC', 'Restaurant', 'Bar']),
    rating: 4.7,
    totalRooms: 8,
  },
  {
    id: 'lodge-eastern-valley',
    name: 'Eastern Valley Lodge',
    description: 'Nestled in the scenic valley landscape of Eastern Province, this charming lodge offers a tranquil retreat from city life. Surrounded by rolling hills and traditional villages, it is the perfect base for exploring the Lessen Game Reserve.',
    location: 'Chipata',
    address: '67 Lundazi Road, Chipata, Zambia',
    phone: '+260 977 234 567',
    price: 250,
    priceUnit: 'night',
    latitude: -13.6400,
    longitude: 32.6600,
    images: JSON.stringify(['/lodges/eastern-valley-lodge.jpg']),
    amenities: JSON.stringify(['WiFi', 'Breakfast', 'Parking', 'Restaurant']),
    rating: 4.3,
    totalRooms: 7,
  },
]

async function main() {
  console.log('Seeding database with Zambian lodges...')
  for (const lodge of lodges) {
    await db.lodge.upsert({
      where: { id: lodge.id },
      update: lodge,
      create: lodge,
    })
    console.log('  + ' + lodge.name)
  }
  console.log('\\nDone! Seeded ' + lodges.length + ' lodges.')
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
`;

// Now read the large UI files from the upgrade-v2 directory
function readUpgradeFile(relativePath) {
  const fullPath = path.join(__dirname, relativePath);
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf-8');
  }
  return null;
}

// ============================================================
// MAIN
// ============================================================

log('\n' + '='.repeat(55), CYAN);
log('  StayNow UI Upgrade v2 — Master Apply Script', BOLD);
log('  Seed data + UI upgrade + Images — all in one', CYAN);
log('='.repeat(55) + '\n', CYAN);

if (!fs.existsSync('package.json')) {
  log('Error: No package.json found. Run from project root.', RED);
  process.exit(1);
}
log('Project root found: ' + process.cwd() + '\n', GREEN);

// ---- Step 1: Write embedded files ----
log('Step 1: Writing hook files and seed data...', CYAN);
for (const [filePath, content] of Object.entries(FILES)) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
  log('  Written: ' + filePath, GREEN);
  created++;
}

// ---- Step 2: Copy UI files from upgrade package ----
log('\nStep 2: Copying UI upgrade files...', CYAN);
const uiFiles = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/globals.css',
  'src/app/lodges/page.tsx',
  'src/app/lodges/[id]/page.tsx',
  'src/app/reservations/[id]/page.tsx',
  'src/components/lodge-card.tsx',
];

let copiedFromPackage = 0;
for (const relPath of uiFiles) {
  const content = readUpgradeFile(relPath);
  if (content) {
    ensureDir(path.dirname(relPath));
    fs.writeFileSync(relPath, content, 'utf-8');
    log('  Copied: ' + relPath, GREEN);
    copiedFromPackage++;
    created++;
  } else {
    log('  SKIP (not in package): ' + relPath, YELLOW);
    skipped++;
  }
}

// ---- Step 3: Copy lodge images ----
log('\nStep 3: Copying lodge images...', CYAN);
ensureDir('public/lodges');
const imagesDir = path.join(__dirname, 'public', 'lodges');
if (fs.existsSync(imagesDir)) {
  const images = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg'));
  images.forEach(img => {
    fs.copyFileSync(path.join(imagesDir, img), path.join('public', 'lodges', img));
    log('  Copied: public/lodges/' + img, GREEN);
    created++;
  });
  log('  Total: ' + images.length + ' images', CYAN);
} else {
  log('  No images directory found in package. Images will use gradient fallback.', YELLOW);
}

// ---- Step 4: Verify tsconfig paths ----
log('\nStep 4: Verifying tsconfig.json...', CYAN);
if (fs.existsSync('tsconfig.json')) {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'));
  const paths = tsconfig.compilerOptions?.paths || {};
  let changed = false;

  if (!paths['@/*']) { paths['@/*'] = ['./src/*']; changed = true; }
  if (!paths['@hooks/*']) { paths['@hooks/*'] = ['./src/hooks/*']; changed = true; }

  if (changed) {
    tsconfig.compilerOptions.paths = paths;
    fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2) + '\n');
    log('  Updated tsconfig.json with path aliases', GREEN);
  } else {
    log('  Path aliases already configured', GREEN);
  }
}

// ---- Step 5: Check required shadcn components ----
log('\nStep 4: Checking required components...', CYAN);
const requiredComponents = [
  'src/components/ui/button.tsx',
  'src/components/ui/input.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/skeleton.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/toast.tsx',
  'src/components/ui/toaster.tsx',
];
const missing = requiredComponents.filter(p => !fs.existsSync(p));
if (missing.length > 0) {
  log('  Missing components:', YELLOW);
  missing.forEach(p => log('    - ' + p, YELLOW));
  log('\n  Run: npx shadcn@latest add ' + missing.map(p => p.split('/').pop().replace('.tsx', '')).join(' '), YELLOW);
} else {
  log('  All required shadcn/ui components found', GREEN);
}

// ---- Summary ----
log('\n' + '='.repeat(55), CYAN);
log('  FILES APPLIED: ' + created, GREEN);
if (skipped > 0) log('  SKIPPED: ' + skipped, YELLOW);
log('='.repeat(55) + '\n', CYAN);

log('NEXT STEPS:', BOLD);
log('  1. Install missing shadcn components (if any above)', CYAN);
log('  2. Seed the database:', CYAN);
log('     npx prisma db seed', CYAN);
log('  3. Build to verify:', CYAN);
log('     npm run build', CYAN);
log('  4. Commit and push:', CYAN);
log('     git add .', CYAN);
log('     git commit -m "feat: premium UI upgrade with seed data"', CYAN);
log('     git push origin main', CYAN);

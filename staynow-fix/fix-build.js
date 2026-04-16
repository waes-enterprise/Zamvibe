/**
 * StayNow Build Fix Script (Node.js)
 * ===================================
 * Run from your StayNow project root:
 *   node fix-build.js
 *
 * This script:
 * 1. Creates src/hooks/use-mobile.tsx
 * 2. Creates src/hooks/use-toast.ts
 * 3. Creates src/components/ui/toast.tsx (if missing)
 * 4. Fixes tsconfig.json path aliases
 * 5. Scans for ALL @hooks/ imports across the project
 * 6. Reports any remaining missing hooks
 */

const fs = require('fs');
const path = require('path');

const RED = '\x1b[0;31m';
const GREEN = '\x1b[0;32m';
const YELLOW = '\x1b[1;33m';
const CYAN = '\x1b[0;36m';
const NC = '\x1b[0m';

let errors = 0;
let warnings = 0;
let fixed = 0;

function log(msg, color = '') {
  console.log(`${color}${msg}${NC}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`  Created directory: ${dir}`, GREEN);
    fixed++;
  }
}

function writeFile(filePath, content, description) {
  const fullPath = path.resolve(filePath);
  ensureDir(path.dirname(fullPath));
  
  if (fs.existsSync(fullPath)) {
    log(`  ${description} already exists: ${filePath}`, YELLOW);
    warnings++;
  } else {
    fs.writeFileSync(fullPath, content, 'utf-8');
    log(`  Created: ${filePath}`, GREEN);
    fixed++;
  }
}

function scanForHookImports(srcDir) {
  const hookImports = new Set();
  
  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        walkDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const matches = content.matchAll(/@hooks\/([a-zA-Z0-9_-]+)/g);
        for (const match of matches) {
          hookImports.add({
            hook: match[1],
            file: fullPath,
          });
        }
      }
    }
  }
  
  walkDir(dir);
  return hookImports;
}

// ============================================================
// MAIN
// ============================================================

log('\n🔧 StayNow Build Fix Script', CYAN);
log('============================\n');

// Verify project root
if (!fs.existsSync('package.json')) {
  log('❌ Error: No package.json found. Run this from your project root.', RED);
  process.exit(1);
}
log('✓ Found package.json', GREEN);

// ---- 1. Create use-mobile hook ----
log('\n📁 Step 1: Creating src/hooks/use-mobile.tsx');
writeFile('src/hooks/use-mobile.tsx', `"use client"

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
`, 'use-mobile hook');

// ---- 2. Create toast component (dependency for use-toast) ----
log('\n📁 Step 2: Ensuring src/components/ui/toast.tsx exists');
writeFile('src/components/ui/toast.tsx', `"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
`, 'Toast component');

// ---- 3. Create use-toast hook ----
log('\n📁 Step 3: Creating src/hooks/use-toast.ts');
writeFile('src/hooks/use-toast.ts', `"use client"

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
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
`, 'use-toast hook');

// ---- 4. Fix tsconfig.json ----
log('\n📁 Step 4: Fixing tsconfig.json path aliases');
if (fs.existsSync('tsconfig.json')) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'));
    
    if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
    if (!tsconfig.compilerOptions.paths) tsconfig.compilerOptions.paths = {};
    
    const paths = tsconfig.compilerOptions.paths;
    let tsChanged = false;
    
    // Ensure @hooks/*
    if (!paths['@hooks/*']) {
      paths['@hooks/*'] = ['./src/hooks/*'];
      tsChanged = true;
      log('  Added @hooks/* path alias', GREEN);
      fixed++;
    } else {
      log('  @hooks/* path alias already exists', GREEN);
    }
    
    // Ensure @/*
    if (!paths['@/*']) {
      paths['@/*'] = ['./src/*'];
      tsChanged = true;
      log('  Added @/* path alias', GREEN);
      fixed++;
    } else {
      log('  @/* path alias already exists', GREEN);
    }
    
    if (tsChanged) {
      fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2) + '\n');
      log('  Saved updated tsconfig.json', GREEN);
    }
  } catch (e) {
    log(`  Error parsing tsconfig.json: ${e.message}`, RED);
    errors++;
  }
} else {
  log('  ❌ tsconfig.json not found!', RED);
  errors++;
}

// ---- 5. Scan for ALL @hooks/ imports ----
log('\n🔍 Step 5: Scanning for ALL @hooks/ imports...');
const hookImports = scanForHookImports('src');

if (hookImports.size > 0) {
  log(`  Found ${hookImports.size} @hooks/ import(s):`, CYAN);
  const uniqueHooks = new Set();
  for (const imp of hookImports) {
    uniqueHooks.add(imp.hook);
    log(`    ${imp.file} → @hooks/${imp.hook}`, CYAN);
  }
  
  log('\n  Unique hooks required:', CYAN);
  for (const hook of uniqueHooks) {
    const tsPath = path.resolve(`src/hooks/${hook}.ts`);
    const tsxPath = path.resolve(`src/hooks/${hook}.tsx`);
    if (fs.existsSync(tsPath) || fs.existsSync(tsxPath)) {
      log(`    ✓ ${hook} - EXISTS`, GREEN);
    } else {
      log(`    ❌ ${hook} - MISSING (not created by this script)`, RED);
      errors++;
    }
  }
} else {
  log('  No @hooks/ imports found in src/', YELLOW);
}

// ---- 6. Summary ----
log('\n' + '='.repeat(50), CYAN);
log('SUMMARY', CYAN);
log('='.repeat(50), CYAN);
log(`  Files created/updated: ${fixed}`, GREEN);
log(`  Warnings: ${warnings}`, YELLOW);
log(`  Errors: ${errors}`, errors > 0 ? RED : GREEN);
log('');

if (errors > 0) {
  log('❌ Some issues remain. Check the errors above.', RED);
  log('\nNext steps:', CYAN);
  log('  1. Review and fix any missing hooks listed above', CYAN);
  log('  2. Ensure all required npm packages are installed:', CYAN);
  log('     npm install @radix-ui/react-toast class-variance-authority lucide-react', CYAN);
  log('  3. Run: npm run build', CYAN);
} else {
  log('🎉 All fixes applied! Run the following to verify:', GREEN);
  log('  npm run build', CYAN);
  log('\nThen commit and push:', CYAN);
  log('  git add .', CYAN);
  log('  git commit -m "fix: add missing hooks and path aliases for clean build"', CYAN);
  log('  git push origin main', CYAN);
}

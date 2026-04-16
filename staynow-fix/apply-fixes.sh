#!/bin/bash
# ============================================================
# StayNow Build Fix Script
# Fixes missing @hooks/ imports and other build errors
# Run from the root of your StayNow project
# ============================================================

set -e

echo "🔧 StayNow Build Fix Script"
echo "============================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verify we're in a Next.js project
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: No package.json found. Run this from your project root.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Found package.json${NC}"

# 1. Ensure src/hooks directory exists
echo ""
echo "📁 Creating src/hooks/ directory..."
mkdir -p src/hooks
echo -e "${GREEN}✓ src/hooks/ ready${NC}"

# 2. Create use-mobile hook
echo ""
echo "📝 Creating src/hooks/use-mobile.tsx..."
cat > src/hooks/use-mobile.tsx << 'HOOKEOF'
"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
HOOKEOF
echo -e "${GREEN}✓ src/hooks/use-mobile.tsx created${NC}"

# 3. Check if toast component exists, create if not
if [ ! -f "src/components/ui/toast.tsx" ]; then
  echo ""
  echo "📝 Creating src/components/ui/toast.tsx (dependency for use-toast)..."
  mkdir -p src/components/ui
  cat > src/components/ui/toast.tsx << 'TOASTEOF'
"use client"

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
TOASTEOF
  echo -e "${GREEN}✓ src/components/ui/toast.tsx created${NC}"
else
  echo -e "${YELLOW}⚠ src/components/ui/toast.tsx already exists, skipping${NC}"
fi

# 4. Create use-toast hook
echo ""
echo "📝 Creating src/hooks/use-toast.ts..."
cat > src/hooks/use-toast.ts << 'UTOASTEOF'
"use client"

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
UTOASTEOF
echo -e "${GREEN}✓ src/hooks/use-toast.ts created${NC}"

# 5. Fix tsconfig.json - ensure @hooks/* path alias exists
echo ""
echo "📝 Checking tsconfig.json for @hooks/* path alias..."
if [ -f "tsconfig.json" ]; then
  # Check if @hooks/* exists in paths
  if python3 -c "
import json, sys
with open('tsconfig.json') as f:
    config = json.load(f)
paths = config.get('compilerOptions', {}).get('paths', {})
if '@hooks/*' in paths:
    sys.exit(0)
else:
    sys.exit(1)
" 2>/dev/null; then
    echo -e "${GREEN}✓ @hooks/* path alias already exists in tsconfig.json${NC}"
  else
    echo -e "${YELLOW}⚠ @hooks/* path alias missing - adding it...${NC}"
    python3 << 'PYEOF'
import json

with open("tsconfig.json", "r") as f:
    config = json.load(f)

if "compilerOptions" not in config:
    config["compilerOptions"] = {}
if "paths" not in config["compilerOptions"]:
    config["compilerOptions"]["paths"] = {}

# Add @hooks/* path alias
config["compilerOptions"]["paths"]["@hooks/*"] = ["./src/hooks/*"]

# Ensure @/* exists
if "@/*" not in config["compilerOptions"]["paths"]:
    config["compilerOptions"]["paths"]["@/*"] = ["./src/*"]

with open("tsconfig.json", "w") as f:
    json.dump(config, f, indent=2)

print("✓ Updated tsconfig.json with @hooks/* path alias")
PYEOF
    echo -e "${GREEN}✓ tsconfig.json updated${NC}"
  fi
else
  echo -e "${RED}❌ tsconfig.json not found!${NC}"
fi

# 6. Scan for any other @hooks/ imports in the codebase
echo ""
echo "🔍 Scanning for ALL @hooks/ imports across the project..."
HOOK_IMPORTS=$(rg -r '' '@hooks/' src/ --no-heading 2>/dev/null || true)
if [ -z "$HOOK_IMPORTS" ]; then
  echo -e "${YELLOW}⚠ rg not found, using grep fallback...${NC}"
  HOOK_IMPORTS=$(grep -rn '@hooks/' src/ 2>/dev/null || true)
fi

if [ -n "$HOOK_IMPORTS" ]; then
  echo "Found @hooks/ imports:"
  echo "$HOOK_IMPORTS"
  echo ""
  
  # Extract unique hook names
  UNIQUE_HOOKS=$(echo "$HOOK_IMPORTS" | grep -oP '@hooks/\K[a-z0-9_-]+' | sort -u)
  echo "Unique hooks needed: $UNIQUE_HOOKS"
  echo ""
  
  for hook in $UNIQUE_HOOKS; do
    HOOK_FILE="src/hooks/${hook}.ts"
    HOOK_FILE_TSX="src/hooks/${hook}.tsx"
    if [ ! -f "$HOOK_FILE" ] && [ ! -f "$HOOK_FILE_TSX" ]; then
      echo -e "${RED}❌ Missing hook: ${hook} (not found as .ts or .tsx)${NC}"
    else
      echo -e "${GREEN}✓ Hook ${hook} exists${NC}"
    fi
  done
else
  echo -e "${GREEN}✓ No additional @hooks/ imports found${NC}"
fi

# 7. Check for missing dependencies
echo ""
echo "📦 Checking required dependencies..."
MISSING_DEPS=""

check_dep() {
  if node -e "try { require.resolve('$1'); } catch(e) { process.exit(1); }" 2>/dev/null; then
    echo -e "${GREEN}✓ $1${NC}"
  else
    echo -e "${RED}❌ $1 (missing)${NC}"
    MISSINGING_DEPS="$MISSING_DEPS $1"
  fi
}

check_dep "@radix-ui/react-toast"
check_dep "class-variance-authority"
check_dep "lucide-react"
check_dep "@radix-ui/react-slot"
check_dep "@radix-ui/react-tooltip"

if [ -n "$MISSING_DEPS" ]; then
  echo ""
  echo -e "${YELLOW}⚠ Some dependencies are missing. Install them with:${NC}"
  echo "  npm install$MISSING_DEPS"
fi

# 8. Try to build
echo ""
echo "🚀 Attempting build..."
echo "============================"
if npm run build 2>&1; then
  echo ""
  echo -e "${GREEN}🎉 BUILD SUCCESSFUL! 🎉${NC}"
  echo ""
  echo "Now commit and push:"
  echo "  git add ."
  echo "  git commit -m 'fix: add missing hooks and path aliases for clean build'"
  echo "  git push origin main"
else
  echo ""
  echo -e "${RED}❌ Build failed. Check the errors above.${NC}"
  echo ""
  echo "Common next steps:"
  echo "  1. Install missing deps: npm install @radix-ui/react-toast class-variance-authority lucide-react"
  echo "  2. Check for other missing imports"
  echo "  3. Run 'npm run build' again"
fi

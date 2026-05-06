"use client";

/**
 * Purpose: Dropdown menu with click-outside-to-close behavior.
 * Dependencies: React refs + events for positioning and dismiss.
 * Related: src/lib/utils.ts
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------- Context ---------- */

interface DropdownContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = React.createContext<DropdownContextValue>({
  open: false,
  toggle: () => {},
  close: () => {},
});

/* ---------- DropdownMenu (root) ---------- */

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggle = React.useCallback(() => setOpen((prev) => !prev), []);
  const close = React.useCallback(() => setOpen(false), []);

  // Close on click outside
  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, toggle, close }}>
      <div ref={containerRef} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

/* ---------- DropdownMenuTrigger ---------- */

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { toggle } = React.useContext(DropdownContext);
  return (
    <button
      ref={ref}
      type="button"
      className={cn("inline-flex items-center justify-center", className)}
      onClick={toggle}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

/* ---------- DropdownMenuContent ---------- */

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, close } = React.useContext(DropdownContext);
  if (!open) return null;

  return (
    <div
      ref={ref}
      role="menu"
      className={cn(
        "absolute right-0 z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-lg animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DropdownMenuItem) {
          return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
            onClick: (e: React.MouseEvent) => {
              const originalOnClick = (child.props as Record<string, unknown>).onClick as React.MouseEventHandler | undefined;
              originalOnClick?.(e);
              close();
            },
          });
        }
        return child;
      })}
    </div>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

/* ---------- DropdownMenuItem ---------- */

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="menuitem"
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
      className
    )}
    tabIndex={0}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

/* ---------- DropdownMenuSeparator ---------- */

function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};

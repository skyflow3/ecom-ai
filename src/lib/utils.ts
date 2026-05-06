/**
 * Purpose: className utility — merge Tailwind classes safely
 * Dependencies: clsx, tailwind-merge
 * Related: All UI components
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

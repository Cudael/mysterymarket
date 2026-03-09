import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts using tailwind-merge.
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 * @returns A single merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price stored in cents as a USD currency string.
 * @param priceInCents - The price in cents (integer).
 * @returns A formatted currency string, e.g. "$12.99".
 */
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

/**
 * Constructs an absolute URL by prepending the app's base URL.
 * Falls back to "http://localhost:3000" if NEXT_PUBLIC_APP_URL is not set.
 * @param path - The path to append (e.g., "/ideas/123").
 * @returns The full absolute URL string.
 */
export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`;
}

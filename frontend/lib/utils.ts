import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return "—";
  const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
}

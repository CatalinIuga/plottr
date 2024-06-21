import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * O funcție utilitară care combină clasele Tailwind CSS cu clsx.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

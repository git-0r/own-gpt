import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * @returns Timestamp-based ID, Example output: "1674239745184-k4n1pqa3r"
 */
export function generateTimestampId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

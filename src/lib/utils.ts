import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const PLACEHOLDER_PROFILE_IMAGE_COUNT = 5;

export function getRandomPlaceholderProfileImage(): string {
  const index = Math.floor(Math.random() * PLACEHOLDER_PROFILE_IMAGE_COUNT) + 1;
  return `/images/placeholder-profile-images/${index}.jpeg`;
}

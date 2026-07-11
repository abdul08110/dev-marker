import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// `text-box-trim` is a custom utility (see index.css) that sets the `text-box` CSS property.
// Out of the box tailwind-merge buckets any `text-*` class into the text-color group, so it
// treats `text-box-trim` as conflicting with `text-white`/`text-score-text` and drops one of
// them. Register it as its own group so a text color and text-box trimming can coexist in cn().
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "text-box-trim": ["text-box-trim"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const PLACEHOLDER_PROFILE_IMAGE_COUNT = 2;

export function getRandomPlaceholderProfileImage(): string {
  const index = Math.floor(Math.random() * PLACEHOLDER_PROFILE_IMAGE_COUNT) + 1;
  return `/images/placeholder-profile-images/${index}.jpeg`;
}

/** Tiny classname joiner — avoids pulling in clsx for this small a need. */
export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

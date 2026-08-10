import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Profile photo. Width/height are always set so the box is reserved before the
 * image decodes — no layout shift.
 *
 * `eager` is for above-the-fold instances (hero, preloader). Next 16 replaced
 * the old `priority` prop with `preload`.
 */
export function Avatar({
  size = 40,
  eager = false,
  ring = true,
  className = "",
}: {
  size?: number;
  eager?: boolean;
  ring?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full ${
        ring ? "ring-1 ring-line" : ""
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={site.avatar}
        alt={`${site.name} — ${site.role}`}
        width={size}
        height={size}
        preload={eager}
        loading={eager ? undefined : "lazy"}
        sizes={`${size}px`}
        className="size-full object-cover"
      />
    </span>
  );
}

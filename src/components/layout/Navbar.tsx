"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { navLinks, site } from "@/lib/site";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";

const ids = navLinks.map((l) => l.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Without this the page scrolls behind the fixed overlay, so closing the menu
  // drops the reader somewhere they never chose to go.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#about"
        className="glass sr-only rounded-full px-4 py-2 text-sm focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[95]"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-[75] flex justify-center px-4 pt-4">
        <motion.nav
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className={cn(
            "flex w-full max-w-5xl items-center justify-between rounded-full px-3 py-2 transition-all duration-400",
            scrolled ? "glass shadow-[0_14px_40px_-24px_#000]" : "bg-transparent",
          )}
        >
          <a
            href="#home"
            className="flex items-center gap-2.5 pl-1 text-sm font-medium tracking-tight"
            aria-label={`${site.name} — home`}
          >
            <Avatar size={30} eager />
            <span className="hidden sm:inline">{site.firstName}</span>
          </a>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                    active === link.id
                      ? "text-fg"
                      : "text-muted hover:text-fg",
                  )}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/8"
                      transition={{ type: "spring", stiffness: 340, damping: 30 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-full bg-[linear-gradient(100deg,var(--color-blue),var(--color-cyan))] px-4 py-2 text-sm font-medium text-[#03121f] transition-[filter] hover:brightness-110 sm:inline-flex"
            >
              Let&apos;s talk
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="glass grid size-11 place-items-center rounded-full text-fg lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[74] bg-ink/85 backdrop-blur-xl lg:hidden"
            onClick={() => setOpen(false)}
            data-lenis-prevent
          >
            {/* 8 links are ~504px tall — taller than a landscape phone. The
                scroll container is this div; the list uses min-h-full so
                justify-center only centres when there IS spare room. With
                h-full + justify-center the overflow above the centre line is
                unreachable, which stranded the first two links. */}
            <div
              data-lenis-prevent
              className="h-full overflow-y-auto overscroll-contain"
            >
              <motion.ul
                className="flex min-h-full flex-col items-center justify-center gap-2 px-6 py-24"
                initial="hidden"
                animate="show"
                variants={{
                  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                }}
              >
                {navLinks.map((link) => (
                  <motion.li
                    key={link.id}
                    variants={{
                      hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
                      show: { opacity: 1, y: 0, filter: "blur(0px)" },
                    }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block px-6 py-3 text-2xl font-medium tracking-tight transition-colors",
                        active === link.id
                          ? "text-gradient"
                          : "text-muted hover:text-fg",
                      )}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

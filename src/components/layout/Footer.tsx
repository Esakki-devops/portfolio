import { Mail, Download } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { navLinks, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative px-6 pt-16 pb-10">
      <div
        aria-hidden
        className="mx-auto mb-12 h-px max-w-6xl bg-[linear-gradient(90deg,transparent,var(--color-blue),var(--color-cyan),var(--color-purple),transparent)] bg-[length:200%_100%]"
        style={{ animation: "line-sweep 9s linear infinite" }}
      />

      <div className="mx-auto grid w-full max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Avatar size={34} />
            <p className="font-medium tracking-tight">{site.name}</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
            {site.role} in {site.location}, working toward cloud and DevOps
            engineering.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-[11px] tracking-[0.18em] text-faint uppercase">
            Navigate
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-1 text-sm">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="inline-block py-1.5 text-muted transition-colors hover:text-cyan"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[11px] tracking-[0.18em] text-faint uppercase">
            Elsewhere
          </h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
              className="glass grid size-11 place-items-center rounded-xl text-muted transition-colors hover:text-cyan"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn profile"
              className="glass grid size-11 place-items-center rounded-xl text-muted transition-colors hover:text-cyan"
            >
              <LinkedinIcon className="size-4" />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label="Send an email"
              className="glass grid size-11 place-items-center rounded-xl text-muted transition-colors hover:text-cyan"
            >
              <Mail className="size-4" />
            </a>
            <a
              href={site.resumeHref}
              download
              aria-label="Download resume"
              className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs text-muted transition-colors hover:text-cyan"
            >
              <Download className="size-3.5" />
              Resume
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-6xl flex-col gap-2 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p className="font-mono">Built with Next.js &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
}

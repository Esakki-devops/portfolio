"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { GithubIcon } from "@/components/icons";
import type { GithubPayload } from "@/app/api/github/route";
import { site } from "@/lib/site";

/**
 * Live GitHub panel. Shows real counts, or an honest empty state — deliberately
 * no decorative contribution heatmap, which would imply activity that isn't
 * there.
 */
export function GitHubActivity() {
  const [data, setData] = useState<GithubPayload | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/github", { signal: controller.signal })
      .then((r) => r.json())
      .then((d: GithubPayload) => setData(d))
      .catch(() => {
        if (!controller.signal.aborted) {
          setData({ profile: null, repos: [], unavailable: true });
        }
      });

    return () => controller.abort();
  }, []);

  const loading = data === null;
  const profile = data?.profile ?? null;
  const repos = data?.repos ?? [];

  return (
    <Reveal className="mt-14">
      <div className="glass glow-ring rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="flex items-center gap-2 text-sm font-medium tracking-tight text-fg">
            <GithubIcon className="size-4" />
            GitHub
          </h3>
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-cyan"
          >
            @{site.githubUser}
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        {loading && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="shimmer h-20 rounded-lg" />
            ))}
          </div>
        )}

        {!loading && profile && (
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-white/3 p-4">
              <dt className="text-[11px] tracking-wider text-faint uppercase">
                Public repositories
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gradient tabular-nums">
                {profile.publicRepos}
              </dd>
            </div>
            <div className="rounded-lg border border-line bg-white/3 p-4">
              <dt className="text-[11px] tracking-wider text-faint uppercase">
                Followers
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gradient tabular-nums">
                {profile.followers}
              </dd>
            </div>
          </dl>
        )}

        {!loading && !profile && (
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Couldn&apos;t reach the GitHub API right now. The profile is at{" "}
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-cyan underline-offset-4 hover:underline"
            >
              @{site.githubUser}
            </a>
            .
          </p>
        )}

        {!loading && profile && repos.length === 0 && (
          <p className="mt-4 rounded-lg border border-line bg-white/3 p-4 text-sm leading-relaxed text-muted">
            No public repositories yet — the project work above lives in private
            repos and coursework. Pushing these publicly is the next step.
          </p>
        )}

        {!loading && repos.length > 0 && (
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {repos.map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="glow-ring block h-full rounded-lg border border-line bg-white/3 p-3.5 transition-colors hover:bg-white/6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate font-mono text-sm text-fg">
                      {repo.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-3 font-mono text-[11px] text-faint">
                      <span className="flex items-center gap-1">
                        <Star className="size-3" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="size-3" />
                        {repo.forks}
                      </span>
                    </span>
                  </div>
                  {repo.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted">
                      {repo.description}
                    </p>
                  )}
                  {repo.language && (
                    <p className="mt-2 text-[11px] text-cyan">{repo.language}</p>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  );
}

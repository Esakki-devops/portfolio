import { site } from "@/lib/site";

export const revalidate = 3600;

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  pushedAt: string;
};

export type GithubPayload = {
  profile: {
    login: string;
    name: string | null;
    publicRepos: number;
    followers: number;
    url: string;
  } | null;
  repos: Repo[];
  unavailable: boolean;
};

type ApiUser = {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
};

type ApiRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  fork: boolean;
  pushed_at: string;
};

const EMPTY: GithubPayload = { profile: null, repos: [], unavailable: true };

/** Live profile + latest public repos, cached an hour to stay inside rate limits. */
export async function GET() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${site.githubUser}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/users/${site.githubUser}/repos?sort=pushed&per_page=6&type=owner`,
        { headers, next: { revalidate: 3600 } },
      ),
    ]);

    if (!userRes.ok) return Response.json(EMPTY);

    const user = (await userRes.json()) as ApiUser;
    // A repo failure shouldn't blank the profile stats.
    const rawRepos = repoRes.ok ? ((await repoRes.json()) as ApiRepo[]) : [];

    const repos: Repo[] = (Array.isArray(rawRepos) ? rawRepos : [])
      .filter((r) => !r.fork)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        url: r.html_url,
        pushedAt: r.pushed_at,
      }));

    return Response.json({
      profile: {
        login: user.login,
        name: user.name,
        publicRepos: user.public_repos,
        followers: user.followers,
        url: user.html_url,
      },
      repos,
      unavailable: false,
    } satisfies GithubPayload);
  } catch {
    return Response.json(EMPTY);
  }
}

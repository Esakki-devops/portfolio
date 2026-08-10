/**
 * Identity, contact and SEO. Every value here comes from the owner's CV or a
 * verified public profile — keep it factual, no aspirational job titles.
 */
export const site = {
  name: "Esakki Alaguvel",
  firstName: "Esakki",
  role: "IT Support Engineer",
  roleLong: "IT Support Engineer — Cloud & DevOps",
  tagline:
    "Supporting Windows and Linux systems, networks, and cloud infrastructure — and building toward DevOps through Docker, AWS, and automation.",
  email: "Esakkialaguvel1511@gmail.com",
  phone: "+91 9487858833",
  phoneHref: "+919487858833",
  location: "Tirunelveli, Tamil Nadu, India",
  githubUser: "Esakki-devops",
  githubUrl: "https://github.com/Esakki-devops",
  linkedinUrl: "https://www.linkedin.com/in/esakki-alaguvel-187917289/",
  resumeHref: "/Esakki-Alaguvel-Resume.pdf",
  avatar: "/profile.jpg",
  // PLACEHOLDER — set to the real domain before deploying. Canonical, OG and
  // sitemap URLs all derive from this.
  url: "https://esakki-alaguvel.vercel.app",
} as const;

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof navLinks)[number]["id"];

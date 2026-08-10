import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Backdrop } from "@/components/effects/Backdrop";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { Preloader } from "@/components/effects/Preloader";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { ScrollUtilities } from "@/components/effects/ScrollUtilities";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const description = `${site.roleLong} based in ${site.location}. ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description,
  keywords: [
    "IT Support Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
    "AWS",
    "Docker",
    "Linux Administration",
    "Windows Server",
    "Networking",
    "CCNA",
    "Wazuh",
    "Tirunelveli",
    site.name,
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description,
    url: site.url,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  telephone: site.phone,
  url: site.url,
  image: `${site.url}${site.avatar}`,
  sameAs: [site.githubUrl, site.linkedinUrl],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tirunelveli",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "PSN College of Engineering and Technology",
  },
  worksFor: { "@type": "Organization", name: "Five Two Supports Pvt Ltd" },
  knowsAbout: [
    "IT Support",
    "Windows Server",
    "Linux Administration",
    "Networking",
    "AWS",
    "Docker",
    "Nginx",
    "Wazuh",
    "Active Directory",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <Backdrop />
        <CursorGlow />
        <Preloader />
        <SmoothScroll />
        <ScrollUtilities />

        <ToastProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}

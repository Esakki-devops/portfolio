/**
 * Portfolio content, sourced from Esakki Alaguvel's CV and confirmed details.
 * Do not add achievements, metrics or credentials that aren't backed by those.
 */

export const terminalScript = [
  { cmd: "systemctl status nginx", out: "active (running)", tone: "cyan" },
  { cmd: "docker compose up -d", out: "Containers running", tone: "blue" },
  { cmd: "aws ec2 describe-instances", out: "Instances listed", tone: "purple" },
  { cmd: "ping 8.8.8.8", out: "0% packet loss", tone: "cyan" },
  { cmd: "git push origin main", out: "Changes pushed", tone: "purple" },
] as const;

export type SkillCategory = {
  title: string;
  icon: string;
  blurb: string;
  skills: { name: string; level: number }[];
};

/** Levels are self-assessed working confidence, not exam scores. */
export const skillCategories: SkillCategory[] = [
  {
    title: "Operating Systems",
    icon: "Terminal",
    blurb: "Day-to-day administration, user management and troubleshooting.",
    skills: [
      { name: "Windows 10 / 11", level: 88 },
      { name: "Windows Server", level: 78 },
      { name: "Ubuntu Linux", level: 82 },
      { name: "Linux Administration", level: 78 },
    ],
  },
  {
    title: "Cloud",
    icon: "Cloud",
    blurb: "AWS core services, hands-on through study and support work.",
    skills: [
      { name: "AWS EC2", level: 74 },
      { name: "AWS S3", level: 72 },
      { name: "IAM & VPC", level: 66 },
      { name: "Route 53", level: 45 },
    ],
  },
  {
    title: "Networking",
    icon: "Network",
    blurb: "CCNA-certified, applied daily to connectivity troubleshooting.",
    skills: [
      { name: "TCP/IP", level: 85 },
      { name: "DNS & DHCP", level: 84 },
      { name: "VLAN & VPN", level: 76 },
      { name: "Cisco Packet Tracer", level: 74 },
    ],
  },
  {
    title: "DevOps & Infrastructure",
    icon: "Container",
    blurb: "Containers and web serving — the foundation I'm building on.",
    skills: [
      { name: "Docker", level: 76 },
      { name: "Docker Compose", level: 72 },
      { name: "Nginx", level: 70 },
      { name: "Git & GitHub", level: 78 },
    ],
  },
  {
    title: "Monitoring & Security",
    icon: "Shield",
    blurb: "Log visibility and endpoint security fundamentals.",
    skills: [
      { name: "Wazuh SIEM", level: 72 },
      { name: "Log Monitoring", level: 74 },
      { name: "Firewall Fundamentals", level: 68 },
      { name: "Active Directory", level: 76 },
    ],
  },
  {
    title: "Programming",
    icon: "Braces",
    blurb: "Scripting for automation and small tooling tasks.",
    skills: [
      { name: "Python", level: 58 },
      { name: "Bash", level: 52 },
      { name: "C", level: 55 },
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  stats: { label: string; value: string }[];
  accent: [string, string];
  icon: string;
  repo?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "ad-monitoring-dashboard",
    title: "AD Monitoring Dashboard",
    summary:
      "Security monitoring for Active Directory activity using Wazuh and OpenSearch.",
    description:
      "A monitoring dashboard that surfaces Active Directory events and operational health. Wazuh agents feed security events into OpenSearch, giving visibility into identity activity and endpoint state.",
    tags: ["Wazuh", "OpenSearch", "Active Directory", "Security Monitoring"],
    stats: [
      { label: "Focus", value: "SIEM" },
      { label: "Scope", value: "Identity" },
    ],
    accent: ["#3b82f6", "#22d3ee"],
    icon: "Shield",
    featured: true,
  },
  {
    slug: "docker-ticketing-system",
    title: "Docker Ticketing System",
    summary:
      "Containerised ticketing stack with Node.js services, MongoDB and Redis.",
    description:
      "A multi-container application stack orchestrated with Docker Compose — Node.js services for application logic, MongoDB for persistence, and Redis for fast state handling.",
    tags: ["Docker", "Docker Compose", "MongoDB", "Redis", "Node.js"],
    stats: [
      { label: "Services", value: "4" },
      { label: "Runtime", value: "Docker" },
    ],
    accent: ["#a855f7", "#3b82f6"],
    icon: "Container",
    featured: true,
  },
  {
    slug: "voip-infrastructure",
    title: "VoIP Infrastructure",
    summary:
      "Asterisk telephony with SIP/IAX2 routing and endpoint readiness checks.",
    description:
      "Telephony infrastructure work covering Asterisk configuration, SIP and IAX2 call routing, endpoint provisioning, and the network monitoring needed to keep calls clean.",
    tags: ["Asterisk", "SIP", "IAX2", "Network Monitoring"],
    stats: [
      { label: "Protocols", value: "SIP/IAX2" },
      { label: "Layer", value: "Telephony" },
    ],
    accent: ["#22d3ee", "#a855f7"],
    icon: "Radio",
    featured: true,
  },
  {
    slug: "smart-solar-tracking",
    title: "Smart Solar Tracking System",
    summary:
      "IoT solar tracker that repositions panels automatically and reports telemetry.",
    description:
      "An IoT-enabled solar tracking system built with sensors and microcontrollers. Panels reposition automatically toward available light, and remote monitoring reports performance telemetry.",
    tags: ["IoT", "Sensors", "Microcontrollers", "Remote Monitoring"],
    stats: [
      { label: "Type", value: "IoT" },
      { label: "Domain", value: "Energy" },
    ],
    accent: ["#3b82f6", "#a855f7"],
    icon: "Activity",
  },
  {
    slug: "iot-smart-door-lock",
    title: "IoT Smart Door Lock",
    summary:
      "Remote-access door lock with real-time notifications and access logs.",
    description:
      "A connected access-control prototype offering remote authorisation from a smartphone, real-time notifications on entry events, and a persistent access log for review.",
    tags: ["IoT", "Remote Access", "Notifications", "Access Logs"],
    stats: [
      { label: "Access", value: "Remote" },
      { label: "Logging", value: "Events" },
    ],
    accent: ["#a855f7", "#22d3ee"],
    icon: "Lock",
  },
];

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  icon: string;
  kind: "work" | "internship" | "education";
  achievements: string[];
  tech: string[];
};

/** Ordered oldest → newest so the timeline reads as a progression. */
export const experience: ExperienceItem[] = [
  {
    role: "Higher Secondary Education",
    company: "Schaffter Higher Secondary School",
    period: "Completed",
    location: "Tirunelveli, IN",
    icon: "GraduationCap",
    kind: "education",
    achievements: ["Overall percentage: 81.4%."],
    tech: [],
  },
  {
    role: "B.E. Electronics and Communication Engineering",
    company: "PSN College of Engineering and Technology",
    period: "2021 — 2025",
    location: "Tirunelveli, IN",
    icon: "GraduationCap",
    kind: "education",
    achievements: [
      "Electronics and communication fundamentals with project work in IoT, automation and networking.",
      "Built the solar tracking and smart door lock systems as part of coursework.",
    ],
    tech: ["Electronics", "IoT", "Embedded Systems"],
  },
  {
    role: "Laptop Disassembly Technician Intern",
    company: "E Dot Technologies",
    period: "June 2023",
    location: "Tirunelveli, IN",
    icon: "Wrench",
    kind: "internship",
    achievements: [
      "Assisted in laptop assembly and disassembly operations.",
      "Diagnosed hardware issues and identified faulty components.",
      "Performed preventive maintenance and troubleshooting.",
      "Supported refurbishment and recycling activities.",
    ],
    tech: ["Hardware Diagnostics", "Preventive Maintenance"],
  },
  {
    role: "IT Support Engineer",
    company: "Five Two Supports Pvt Ltd",
    period: "2025 — Present",
    location: "Tirunelveli, IN",
    icon: "Server",
    kind: "work",
    achievements: [
      "Provide technical support for Windows, Linux and network-related issues.",
      "Install, configure and troubleshoot desktops, laptops, printers and software applications.",
      "Manage user accounts, email configurations and system access requests.",
      "Support server administration, backup verification and infrastructure monitoring.",
      "Assist in cloud and DevOps-related operational activities.",
      "Troubleshoot VPN, DNS, DHCP, connectivity and hardware issues.",
      "Maintain IT documentation and resolve support tickets.",
    ],
    tech: ["Windows Server", "Ubuntu", "Active Directory", "VPN", "DNS/DHCP"],
  },
];

/** Counts derived from content on this page — nothing invented. */
export const stats = [
  { value: 5, suffix: "", label: "Projects Built", icon: "Boxes" },
  { value: 4, suffix: "", label: "Certifications", icon: "Award" },
  { value: 20, suffix: "+", label: "Technologies Used", icon: "Layers" },
  { value: 1, suffix: "+", label: "Years in IT Support", icon: "Server" },
] as const;

export const orbitTech = [
  { name: "Linux", ring: 0, color: "#eab308" },
  { name: "Docker", ring: 0, color: "#22d3ee" },
  { name: "AWS", ring: 0, color: "#f59e0b" },
  { name: "Nginx", ring: 1, color: "#10b981" },
  { name: "Windows", ring: 1, color: "#3b82f6" },
  { name: "Python", ring: 1, color: "#a855f7" },
  { name: "Git", ring: 1, color: "#ef4444" },
  { name: "Wazuh", ring: 2, color: "#22d3ee" },
  { name: "Cisco", ring: 2, color: "#3b82f6" },
  { name: "MongoDB", ring: 2, color: "#10b981" },
  { name: "Redis", ring: 2, color: "#ef4444" },
  { name: "VMware", ring: 2, color: "#a855f7" },
] as const;

export type Certification = {
  title: string;
  issuer: string;
  status: string;
  accent: [string, string];
  icon: string;
};

export const certifications: Certification[] = [
  {
    title: "Cisco Certified Network Associate (CCNA)",
    issuer: "Cisco",
    status: "Certified",
    accent: ["#22d3ee", "#3b82f6"],
    icon: "Network",
  },
  {
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    status: "In progress",
    accent: ["#f59e0b", "#a855f7"],
    icon: "Cloud",
  },
  {
    title: "ESIM Certification",
    issuer: "Spoken Tutorial, IIT Bombay",
    status: "Certified",
    accent: ["#3b82f6", "#22d3ee"],
    icon: "Activity",
  },
  {
    title: "SCILAB Certification",
    issuer: "Spoken Tutorial, IIT Bombay",
    status: "Certified",
    accent: ["#a855f7", "#3b82f6"],
    icon: "Braces",
  },
];

export type Achievement = {
  title: string;
  detail: string;
  group: "Achievement" | "Activity";
  icon: string;
  accent: [string, string];
};

export const achievements: Achievement[] = [
  {
    title: "State-Level Yoga Championship",
    detail: "Represented at the state-level yoga championship.",
    group: "Achievement",
    icon: "Star",
    accent: ["#f59e0b", "#a855f7"],
  },
  {
    title: "Volunteer — TNV AAPDA MITRA",
    detail:
      "Disaster-response volunteering with TNV AAPDA MITRA and local NGOs.",
    group: "Activity",
    icon: "Radio",
    accent: ["#a855f7", "#22d3ee"],
  },
  {
    title: "UBA Gram Panchayat Development Workshop",
    detail:
      "Participated in the Unnat Bharat Abhiyan rural development workshop.",
    group: "Activity",
    icon: "Network",
    accent: ["#22d3ee", "#a855f7"],
  },
];

export const aboutTimeline = [
  {
    year: "2021",
    title: "Started engineering",
    body: "Began B.E. in Electronics and Communication at PSN College, Tirunelveli.",
  },
  {
    year: "2023",
    title: "First hands-on role",
    body: "Interned at E Dot Technologies doing hardware diagnostics and repair.",
  },
  {
    year: "2025",
    title: "Into IT support",
    body: "Joined Five Two Supports as an IT Support Engineer across Windows, Linux and networks.",
  },
  {
    year: "Now",
    title: "Moving toward DevOps",
    body: "Building depth in AWS, Docker, Nginx and monitoring to grow into a DevOps role.",
  },
] as const;

/**
 * Static content for the portfolio.
 * Edit this file to update projects, testimonials, and links — no component
 * changes needed. UI chrome (labels, buttons, nav) is translated via /messages;
 * this file holds structured data + project prose.
 *
 * NOTE: Project workflow prose (problem/method/process/goal) is kept in a
 * single language here for maintainability. If you later need it bilingual,
 * move these strings into /messages or a localized map.
 */

export type Project = {
  slug: string;
  title: string;
  /** Short category shown as a tag, e.g. "SaaS Dashboard". */
  category: string;
  year: string;
  /** Your role on the project, e.g. "Lead UI/UX Designer". */
  role: string;
  /** Duration, e.g. "3 months". */
  timeline: string;
  /** One-line summary shown on the work card. */
  summary: string;
  /** Tools / methods used — rendered as mono tags. */
  tags: string[];
  /** Path under /public, e.g. "/projects/benchtop.png". */
  image: string;
  /** Show in the Work section on the home page. */
  featured: boolean;
  /**
   * Under NDA. When true, final visuals are blurred + locked, but the
   * workflow narrative (problem/method/process/goal) is still shown, since
   * only non-final / sanitized work is shared on request.
   */
  protected: boolean;

  // --- Workflow narrative (shown on the /work/[slug] detail page) ---
  /** What problem the project set out to solve. */
  problem: string;
  /** The approach / methods used to solve it. */
  method: string;
  /** How it fit the business / operational flow. */
  businessProcess: string;
  /** The goal and the outcome. */
  goal: string;

  /** External Behance/Dribbble link (omit for NDA work). */
  externalUrl?: string;
};

export const projects: Project[] = [
  {
    slug: 'benchtop-saas',
    title: 'Benchtop — Lab Workflow Platform',
    category: 'SaaS Dashboard',
    year: '2025',
    role: 'Lead UI/UX Designer',
    timeline: '4 months',
    summary:
      'Turned a tangled lab-management workflow into a calm, single-screen dashboard teams actually enjoy using.',
    tags: ['Figma', 'Design System', 'React', 'Supabase'],
    image: '/projects/benchtop.png',
    featured: true,
    protected: false,
    problem:
      'Lab technicians juggled five disconnected tools to track samples, leading to lost data and slow turnaround. Leadership wanted one source of truth without retraining the whole team.',
    method:
      'Ran stakeholder interviews and shadowed two technicians for a day. Mapped the existing flow, cut it from 12 steps to 5, then built a design system in Figma and prototyped the core flow before a line of code.',
    businessProcess:
      'Designed around the real lab routine: intake → assignment → testing → review → report. Each stage maps to a single dashboard view, so a technician never loses context mid-task.',
    goal:
      'Ship a dashboard that cuts sample turnaround time and onboards new staff in under a day. Result: a clean React build, adopted across the lab with minimal training.',
    externalUrl: 'https://behance.net/fandibayu',
  },
  {
    slug: 'fintech-onboarding',
    title: 'Fintech Onboarding App',
    category: 'Mobile App',
    year: '2024',
    role: 'Product Designer',
    timeline: '3 months',
    summary:
      'Rebuilt a drop-off-heavy signup into a friction-free flow — fewer steps, clearer trust signals.',
    tags: ['Figma', 'User Research', 'Prototyping'],
    image: '/projects/fintech.png',
    featured: true,
    protected: true,
    problem:
      'A fintech client was losing most new users during a 7-step KYC onboarding. The flow felt invasive and unclear about why each piece of data was needed.',
    method:
      'Audited the funnel, ran usability tests on the existing flow, and redesigned around progressive disclosure — asking for the minimum upfront and explaining each request in plain language.',
    businessProcess:
      'Aligned the flow with compliance requirements while resequencing steps so the heaviest verification came after the user already felt committed.',
    goal:
      'Lift activation without weakening compliance. The redesign cut onboarding from 7 steps to 3 visible stages and measurably improved completion.',
  },
  {
    slug: 'agency-landing',
    title: 'Creative Agency Landing Page',
    category: 'Landing Page',
    year: '2024',
    role: 'UI/UX Designer & Developer',
    timeline: '6 weeks',
    summary:
      'A motion-driven brand site that turned a refresh into measurable conversions.',
    tags: ['Figma', 'Next.js', 'Framer Motion'],
    image: '/projects/agency.png',
    featured: true,
    protected: false,
    problem:
      'An agency had strong work but a dated site that did not convert. They needed a page that felt as creative as their portfolio and pushed visitors to enquire.',
    method:
      'Defined a bold type-led art direction, designed in Figma, then built it myself in Next.js with purposeful scroll motion — keeping the brand voice intact from design to code.',
    businessProcess:
      'Structured the page around a single conversion path: hook → proof → services → clear enquiry CTA, removing every distraction in between.',
    goal:
      'Increase qualified enquiries from the site. The launch lifted enquiry rate and gave the team a page they were proud to share.',
    externalUrl: 'https://dribbble.com/fandibayu',
  },
  {
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard System',
    category: 'SaaS Web App',
    year: '2023',
    role: 'UI/UX Designer',
    timeline: '5 months',
    summary:
      'A data-dense dashboard made readable through hierarchy, not decoration.',
    tags: ['Figma', 'Design System', 'Data Viz'],
    image: '/projects/analytics.png',
    featured: true,
    protected: true,
    problem:
      'An internal analytics tool overwhelmed users with raw numbers and no hierarchy. Decisions were slow because nothing told the user what mattered.',
    method:
      'Established a clear visual hierarchy and a reusable component library, choosing the right chart for each question and letting whitespace do the work.',
    businessProcess:
      'Mapped each dashboard view to a real decision the team needed to make, so every screen answered a specific question instead of dumping data.',
    goal:
      'Make the data fast to read and act on. The system shipped as a consistent component library that scaled across new views.',
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Source platform — shown as a verified link on the card. */
  platform: 'Upwork' | 'Fiverr' | 'LinkedIn';
  url: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      'Fandi went above and beyond with high quality work and on timely manner. He’s very professional and friendly, as well. ✨',
    name: 'Mira C.',
    role: 'Client',
    platform: 'Upwork',
    url: 'https://www.upwork.com/freelancers/~015efc2530d0409842?mp_source=share',
  },
  {
    quote:
      'Working with Fanbayy on our website design was a stellar experience! His creativity and professionalism were top-notch, perfectly aligning with our brand. Proactive communication and deep understanding made collaboration a breeze — LOVED working with him and will definitely be back for future projects! 😊',
    name: 'Rhanie',
    role: 'Website Design Client',
    platform: 'Fiverr',
    url: 'https://www.fiverr.com/fanddibayy',
  },
  {
    quote:
      'Fandi is a highly capable UX/Design professional who consistently delivers thoughtful, user-centric solutions. He has a strong grasp of design fundamentals and pairs that with a practical understanding of how products are built, which makes his work both elegant and implementable.',
    name: 'Abhiram Sampath',
    role: 'Design Recommendation',
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/fandibayu/',
  },
];

/** Social profiles — `key` maps to an icon in the SocialLinks component. */
export type SocialKey = 'behance' | 'dribbble' | 'github' | 'linkedin';

export const socials: { key: SocialKey; label: string; url: string }[] = [
  { key: 'dribbble', label: 'Dribbble', url: 'https://dribbble.com/fandibayu' },
  { key: 'behance', label: 'Behance', url: 'https://behance.net/fandibayu' },
  // LinkedIn added on top of the original three — hiring managers expect it.
  // Remove this line if you'd rather keep only design profiles.
  { key: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/fandibayu' },
  { key: 'github', label: 'GitHub', url: 'https://github.com/fandibayu' },
];

/** Contact + identity constants. */
export const SITE = {
  name: 'Fandi Bayu',
  role: 'UI/UX Designer',
  email: 'fandi.bayu110@gmail.com',
  resumeUrl: '/resume.pdf',
  yearsExperience: 4,
} as const;

/** Tools shown as a row in the About section. */
export const stack: string[] = [
  'Figma',
  'React',
  'Vue',
  'Tailwind CSS',
  'Supabase',
  'Claude',
  'Stitch',
  'ChatGPT',
  'Google AI Studio',
];

/**
 * Upwork freelance highlight — the featured stat block in the Experience
 * section. `hours` is the headline; `earned`/`clients` are supporting stats.
 */
export const upwork = {
  hours: '2,034',
  earned: '$10K+',
  clients: '10+',
  status: 'Top Rated',
  url: 'https://www.upwork.com/freelancers/~015efc2530d0409842?mp_source=share',
} as const;

export type ExperienceMetric = { value: string; label: string };

export type ExperienceRole = {
  title: string;
  /** Employment type, e.g. "Part-time", "Freelance", "Contract". */
  type?: string;
  /** Time range, e.g. "May 2023 — Present" or "Apr 2025 · 1 mo". */
  period: string;
  description: string;
  /** Plain metric chips, e.g. ["$1K+ earned", "15+ clients"] (Fiverr-style). */
  stats?: string[];
  /** Structured value+label metrics, rendered elegantly (featured roles). */
  metrics?: ExperienceMetric[];
  /** Small status pill, e.g. "Top Rated". */
  badge?: string;
  /** External CTA link (e.g. Upwork profile). Label comes from messages. */
  ctaUrl?: string;
  /** Elevated treatment for a standout role. */
  featured?: boolean;
  /** Marks an ongoing role (the node shows a live dot). */
  current?: boolean;
};

export type ExperienceEntry = {
  /** Company / platform — one timeline node may hold several roles. */
  company: string;
  /** Location, e.g. "Jakarta, Indonesia" or "Remote". */
  location: string;
  roles: ExperienceRole[];
};

// NOTE: Single-language prose (consistent with `projects`). Edit freely.
export const experience: ExperienceEntry[] = [
  {
    company: 'Solusi247',
    location: 'Jakarta, Indonesia',
    roles: [
      {
        title: 'UI/UX Engineer',
        type: 'Contract',
        period: 'May 2023 — Present',
        current: true,
        description:
          'Build and slice UI dashboards and web apps — turning stakeholder mockups into clean HTML/CSS (Bootstrap 5, Tailwind) and Vue (PrimeVue, Vuetify). Maintain a reusable component library and collaborate with front-end and back-end developers, applying Design Thinking to keep flows optimal.',
      },
    ],
  },
  {
    company: 'Upwork',
    location: 'Remote',
    roles: [
      {
        title: 'UI/UX Designer',
        type: 'Freelance',
        period: 'Dec 2024 — Present',
        current: true,
        featured: true,
        badge: upwork.status,
        description:
          'Designing dashboards and web apps for international clients across SaaS, healthcare, e-commerce, and internal tools — using AI-assisted workflows to speed up research, ideation, and prototyping without losing clarity.',
        metrics: [
          { value: upwork.hours, label: 'hours worked' },
          { value: upwork.clients, label: 'clients' },
          { value: upwork.earned, label: 'earned' },
        ],
        ctaUrl: upwork.url,
      },
    ],
  },
  {
    company: 'PT Atask Teknologi Internasional',
    location: 'Jakarta · Remote',
    roles: [
      {
        title: 'Web Designer',
        type: 'Part-time',
        period: 'Apr 2025 · 1 mo',
        description:
          'Designed and built the homepage UI — ran stakeholder research to define the optimal flow and sections, then shipped the final design as HTML, Tailwind CSS 4, and JavaScript.',
      },
      {
        title: 'UI Designer',
        type: 'Freelance',
        period: 'Oct 2024 — Mar 2025 · 6 mos',
        description:
          'Designed mobile apps in Figma aligned to business workflows, built interactive prototypes, and partnered with the team to turn business processes into intuitive, seamless user flows.',
      },
    ],
  },
  {
    company: 'Fiverr',
    location: 'Remote',
    roles: [
      {
        title: 'UI/UX Designer',
        type: 'Freelance',
        period: 'Nov 2024 — Oct 2025',
        description:
          'Designed user-centered interfaces for startups and small businesses — dashboard UI, web apps, and marketing sites with structured UX thinking and pixel-precise execution.',
        stats: ['$1K+ earned', '15+ clients served'],
      },
    ],
  },
  {
    company: 'PrimeSkills (VR & AR)',
    location: 'Jakarta, Indonesia',
    roles: [
      {
        title: 'UI/UX Design Intern',
        type: 'Internship',
        period: 'Feb 2023 — Aug 2023',
        description:
          'Supported the design team on immersive VR/AR experiences — interface layouts, interaction flows, and usability improvements — turning concepts into interactive prototypes.',
      },
    ],
  },
];

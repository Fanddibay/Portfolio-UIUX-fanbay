/**
 * Static content for the portfolio.
 * Edit this file to update projects, testimonials, and links — no component
 * changes needed. UI chrome (labels, buttons, nav) is translated via /messages;
 * this file holds structured data + project prose.
 *
 * BILINGUAL PROSE: narrative fields (summary, problem/method/process/goal,
 * experience descriptions, roadmap, metric labels, timelines) are `Localized`
 * — `{ en, id }` — so switching language translates the content too. Technical
 * terms (tool names, tags, job titles, categories, platform badges) stay in
 * English on purpose. Resolve a Localized value with `loc(value, locale)`.
 */

/** A string available in both site languages. */
export type Localized = { en: string; id: string };

/** Resolve a Localized value for the active locale (falls back to English). */
export function loc(value: Localized, locale: string): string {
  return locale === 'id' ? value.id : value.en;
}

export type Project = {
  slug: string;
  title: string;
  /** Short category shown as a tag, e.g. "SaaS Dashboard". Technical — kept in English. */
  category: string;
  year: string;
  /** Your role on the project, e.g. "Lead UI/UX Designer". Kept in English. */
  role: string;
  /** Duration, e.g. "3 months" / "3 bulan". */
  timeline: Localized;
  /** One-line summary shown on the work card. */
  summary: Localized;
  /** Tools / methods used — rendered as mono tags. Technical — kept in English. */
  tags: string[];
  /** Path under /public, e.g. "/projects/benchtop.webp". Used as the card poster. */
  image: string;
  /**
   * Optional multi-image gallery shown on the detail page (paginated + lightbox).
   * When present, the detail hero cycles through these; the card shows a "+N" badge.
   * Falls back to `[image]` when omitted.
   */
  images?: string[];
  /** Live, publicly-accessible product — shows a pulsing "Live Public" badge. */
  live?: boolean;
  /**
   * Self-initiated product where I'm the Product Owner (not client work).
   * Gets a highlighted card in the grid + a traction/roadmap treatment on
   * the detail page. Only Fanplanner uses this today.
   */
  ownProduct?: boolean;
  /** Traction metrics (value + localized label) shown on the card + detail page. */
  metrics?: { value: string; label: Localized }[];
  /**
   * Multiple external links (e.g. app + landing page). When present, these
   * render as buttons and take precedence over the single `externalUrl`.
   */
  externalLinks?: { label: Localized; url: string }[];
  /** Product build phases (MVP roadmap) — shown on the detail page. */
  roadmap?: { phase: string; title: Localized; body: Localized }[];
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
  problem: Localized;
  /** The approach / methods used to solve it. */
  method: Localized;
  /** How it fit the business / operational flow. */
  businessProcess: Localized;
  /** The goal and the outcome. */
  goal: Localized;

  /** External Behance/Dribbble/live-site link (omit for NDA work). */
  externalUrl?: string;
  /** Custom label for the external link (defaults to the "viewExternal" message). */
  externalLabel?: Localized;
};

export const projects: Project[] = [
  {
    slug: 'nowcasting-bmkg',
    title: 'Nowcasting BMKG — Weather Nowcasting Dashboard',
    category: 'Map Dashboard',
    year: '2026',
    role: 'UI/UX Engineer',
    timeline: { en: '4 months', id: '4 bulan' },
    summary: {
      en: "Redesigned BMKG's public weather-nowcasting platform — giving anyone a real-time, at-a-glance view of conditions forming across Indonesia, with per-region forecast timelines and one-click PDF reports.",
      id: 'Redesign platform weather-nowcasting publik milik BMKG — memberi siapa saja pandangan real-time dan sekilas atas kondisi cuaca yang terbentuk di seluruh Indonesia, dengan timeline prakiraan per wilayah dan laporan PDF sekali klik.',
    },
    tags: ['Figma', 'Cursor', 'Vue', 'Tailwind CSS', 'AI Coding'],
    image: '/projects/nowcasting.webp',
    live: true,
    featured: true,
    protected: false,
    problem: {
      en: "People struggled to quickly check the nowcasting conditions forming in their own area. This was a redesign of BMKG's older platform — rebuilt with new capabilities: a forecast timeline for any region the user selects, exportable PDF reports, and a national view of nowcasting activity across Indonesia at a glance.",
      id: 'Masyarakat kesulitan mengecek dengan cepat kondisi nowcasting yang sedang terbentuk di wilayah mereka sendiri. Ini adalah redesign dari platform lama BMKG — dibangun ulang dengan kemampuan baru: timeline prakiraan untuk wilayah mana pun yang dipilih pengguna, laporan PDF yang bisa diekspor, dan tampilan nasional aktivitas nowcasting di seluruh Indonesia secara sekilas.',
    },
    method: {
      en: 'Grounded the design in real user and stakeholder needs — pairing each weather condition with an intuitive icon, encoding severity through a deliberate color scale (calm → dangerous), and keeping the flow simple enough that anyone can read the map without training.',
      id: 'Mendasarkan desain pada kebutuhan nyata pengguna dan stakeholder — memasangkan setiap kondisi cuaca dengan ikon yang intuitif, menyandikan tingkat bahaya lewat skala warna yang disengaja (tenang → berbahaya), dan menjaga alurnya cukup sederhana sehingga siapa pun bisa membaca peta tanpa pelatihan.',
    },
    businessProcess: {
      en: 'Started from the client\'s brief and translated the requirements into design. Reviewed each screen with stakeholders; once approved, I sliced the design into production Vue + Tailwind CSS — owning both the design and the front-end build.',
      id: 'Dimulai dari brief klien dan menerjemahkan kebutuhan menjadi desain. Mereview setiap layar bersama stakeholder; setelah disetujui, saya slicing desain menjadi kode produksi Vue + Tailwind CSS — menangani sekaligus desain dan pembangunan front-end.',
    },
    goal: {
      en: 'Ship a public tool that lets anyone in Indonesia read real-time nowcasting at a glance. It is now live and publicly accessible — turning a specialist internal tool into something the general public can actually use.',
      id: 'Merilis alat publik yang memungkinkan siapa saja di Indonesia membaca nowcasting real-time secara sekilas. Kini sudah live dan dapat diakses publik — mengubah alat internal khusus menjadi sesuatu yang benar-benar bisa dipakai masyarakat umum.',
    },
    externalUrl: 'https://nowcasting.bmkg.go.id:8443/',
    externalLabel: { en: 'View live site', id: 'Lihat situs live' },
  },
  {
    slug: 'hgrid-247-de',
    title: 'Hgrid 247 DE',
    category: 'SaaS Data Workflow',
    year: '2026',
    role: 'UI/UX Designer',
    timeline: { en: '2 months', id: '2 bulan' },
    summary: {
      en: "A redesign of Hgrid 247's data-workflow builder — turning a rigid, hard-to-follow interface into a clean, modern, step-by-step canvas where building a data pipeline is easy to understand and genuinely pleasant to use.",
      id: 'Redesign data-workflow builder milik Hgrid 247 — mengubah antarmuka yang kaku dan sulit diikuti menjadi kanvas step-by-step yang bersih dan modern, di mana membangun data pipeline jadi mudah dipahami dan benar-benar nyaman digunakan.',
    },
    tags: ['Figma', 'Claude', 'Stitch', 'Google Docs', 'Claude Design', 'build design.md'],
    image: '/projects/hgrid.webp',
    // Gallery ordered by the app's sidebar nav: Workflow → Datasets → HDFS → Job → Cluster → Users
    images: [
      '/projects/hgrid.webp',
      '/projects/hgrid-datasets.webp',
      '/projects/hgrid-hdfs.webp',
      '/projects/hgrid-job.webp',
      '/projects/hgrid-cluster.webp',
      '/projects/hgrid-user.webp',
    ],
    featured: true,
    protected: false,
    problem: {
      en: 'The previous Hgrid 247 workflow builder felt rigid and hard to use. This redesign reimagines it as a clean, modern, step-by-step experience — making the act of building a data workflow easy to follow, so users feel confident and satisfied with the new UI.',
      id: 'Workflow builder Hgrid 247 sebelumnya terasa kaku dan sulit dipakai. Redesign ini membayangkannya ulang sebagai pengalaman step-by-step yang bersih dan modern — membuat proses membangun data workflow mudah diikuti, sehingga pengguna merasa percaya diri dan puas dengan UI baru.',
    },
    method: {
      en: 'Started from the stakeholder brief and worked to fully understand it. I used Claude to generate a guide.md that translated the brief into context an AI agent could reason over, then wrote a design.md so every design prompt stayed consistent with the system — and iterated on the output until it felt right. Roughly 70% of this project ran through an AI-assisted workflow.',
      id: 'Dimulai dari brief stakeholder dan berupaya memahaminya sepenuhnya. Saya memakai Claude untuk membuat guide.md yang menerjemahkan brief menjadi konteks yang bisa dipahami AI agent, lalu menulis design.md agar setiap prompt desain tetap konsisten dengan sistem — dan mengiterasi hasilnya hingga terasa pas. Sekitar 70% proyek ini berjalan lewat workflow yang dibantu AI.',
    },
    businessProcess: {
      en: "Behind the work is a straightforward business goal: the old interface's stiff, dated feel didn't match the product. Redesigning it toward a clean, elegant, professional look repositions Hgrid 247 as a modern data-engineering tool teams actually want to open.",
      id: 'Di balik pekerjaan ini ada tujuan bisnis yang jelas: kesan kaku dan ketinggalan zaman dari antarmuka lama tidak cocok dengan produknya. Mendesainnya ulang ke arah tampilan yang bersih, elegan, dan profesional memposisikan ulang Hgrid 247 sebagai alat data-engineering modern yang benar-benar ingin dibuka tim.',
    },
    goal: {
      en: 'Raise users’ interest in reaching for the tool and make it genuinely easy to use. The project is still ongoing, so there aren’t final outcome metrics yet — but the new direction reframes workflow-building as something clear and approachable rather than intimidating.',
      id: 'Meningkatkan minat pengguna untuk memakai alat ini dan membuatnya benar-benar mudah digunakan. Proyek masih berjalan, jadi belum ada metrik hasil akhir — tetapi arah baru ini membingkai ulang pembangunan workflow sebagai sesuatu yang jelas dan mudah didekati, bukan menakutkan.',
    },
  },
  {
    slug: 'benchtop-saas',
    title: 'Benchtop — Construction Document Platform',
    category: 'SaaS Web App',
    year: '2026',
    role: 'UI/UX Designer',
    timeline: { en: '2 months', id: '2 bulan' },
    summary: {
      en: 'Designed the document tracking module for a construction platform — replacing manual transmittal follow-ups with automated delivery and read-receipt tracking across all project stakeholders.',
      id: 'Mendesain modul pelacakan dokumen untuk platform konstruksi — menggantikan follow-up transmittal manual dengan pelacakan pengiriman otomatis dan tanda terima baca ke seluruh stakeholder proyek.',
    },
    tags: ['Figma', 'Design System', 'Claude Design', 'SaaS', 'Design Thinking'],
    image: '/projects/benchtop.webp',
    featured: true,
    protected: false,
    problem: {
      en: 'Construction teams had no reliable way to confirm whether stakeholders had actually viewed the drawings sent to them. Follow-ups happened over email, revision history was scattered across files, and there was no official audit trail — making miscommunication between architects, builders, and clients a recurring issue.',
      id: 'Tim konstruksi tidak punya cara yang andal untuk memastikan apakah stakeholder benar-benar sudah melihat gambar yang dikirimkan. Follow-up dilakukan lewat email, riwayat revisi tersebar di banyak file, dan tidak ada jejak audit resmi — membuat miskomunikasi antara arsitek, kontraktor, dan klien jadi masalah yang berulang.',
    },
    method: {
      en: 'Worked within a product team, owning the Documents / Register module end-to-end. Mapped the transmittal workflow with the team, designed the revision matrix and per-recipient view tracking in Figma, and delivered detailed annotations for the dev team to build from. Designed the PDF export flow so any transmittal could be generated as an official cover sheet document.',
      id: 'Bekerja dalam tim produk, menangani modul Documents / Register secara end-to-end. Memetakan workflow transmittal bersama tim, mendesain matriks revisi dan pelacakan tampilan per penerima di Figma, serta menyerahkan anotasi detail untuk dibangun tim dev. Mendesain alur ekspor PDF sehingga transmittal mana pun bisa dihasilkan sebagai dokumen cover sheet resmi.',
    },
    businessProcess: {
      en: 'Documents flow through a single system: a set is issued → recipients (builder, client, structural engineer) are notified → the platform logs who viewed it and when → full revision history stays visible in the matrix. No email chains. No manual spreadsheets.',
      id: 'Dokumen mengalir lewat satu sistem: satu set diterbitkan → penerima (kontraktor, klien, structural engineer) diberi tahu → platform mencatat siapa yang melihat dan kapan → riwayat revisi lengkap tetap terlihat di matriks. Tanpa rantai email. Tanpa spreadsheet manual.',
    },
    goal: {
      en: 'Replace a manual, email-based process with automated tracking. Stakeholders now see in real-time which documents have been delivered and read, and by whom. The PDF export eliminated manual document preparation — turning a multi-step process into one click.',
      id: 'Menggantikan proses manual berbasis email dengan pelacakan otomatis. Stakeholder kini melihat secara real-time dokumen mana yang sudah terkirim dan terbaca, serta oleh siapa. Ekspor PDF menghapus penyiapan dokumen manual — mengubah proses banyak langkah menjadi satu klik.',
    },
    externalUrl: 'https://behance.net/fandibayu',
  },
  {
    slug: 'upvendo-pos',
    title: 'Upvendo — Restaurant POS System',
    category: 'POS Systems',
    year: '2024–2026',
    role: 'UI/UX Designer',
    timeline: { en: '2 years', id: '2 tahun' },
    summary: {
      en: 'Designed a full-featured POS system for European restaurants — replacing manual operations with an automated platform covering transactions, reporting, marketing, and third-party delivery integrations.',
      id: 'Mendesain sistem POS berfitur lengkap untuk restoran Eropa — menggantikan operasi manual dengan platform otomatis yang mencakup transaksi, pelaporan, marketing, dan integrasi delivery pihak ketiga.',
    },
    tags: ['Figma', 'Design System', 'User-Centric', 'Auto Layout'],
    image: '/projects/upvendo.webp',
    live: true,
    featured: true,
    protected: false,
    problem: {
      en: 'European restaurants were running operations manually — from tracking daily transactions to compiling monthly reports and managing delivery orders across separate platforms. There was no unified system, making it error-prone, time-consuming, and difficult to scale. Owners needed a single platform that could handle everything — sales, inventory, marketing, and third-party integrations — without requiring their team to start from scratch.',
      id: 'Restoran-restoran Eropa menjalankan operasi secara manual — dari mencatat transaksi harian hingga menyusun laporan bulanan dan mengelola pesanan delivery di berbagai platform terpisah. Tidak ada sistem terpadu, sehingga rawan error, memakan waktu, dan sulit di-scale. Pemilik butuh satu platform yang bisa menangani semuanya — penjualan, inventaris, marketing, dan integrasi pihak ketiga — tanpa mengharuskan tim mereka memulai dari nol.',
    },
    method: {
      en: "Worked in an Agile team, brainstorming directly with the product owner to align on scope and priorities each sprint. Designed the full system in Figma using a scalable design system with Auto Layout for cross-module consistency. Delivered detailed handoffs to the development team and stayed involved across iterations. Recognizing that restaurant staff aren't always technical, we embedded step-by-step video instructions into each module — reducing onboarding time and minimizing input errors in daily use.",
      id: 'Bekerja dalam tim Agile, brainstorming langsung dengan product owner untuk menyelaraskan scope dan prioritas tiap sprint. Mendesain keseluruhan sistem di Figma memakai design system yang scalable dengan Auto Layout demi konsistensi antar modul. Menyerahkan handoff detail ke tim development dan tetap terlibat sepanjang iterasi. Menyadari staf restoran tidak selalu paham teknis, kami menyematkan instruksi video step-by-step di setiap modul — mengurangi waktu onboarding dan meminimalkan kesalahan input dalam penggunaan sehari-hari.',
    },
    businessProcess: {
      en: 'The platform covers the full restaurant operation cycle: orders come in from in-house staff or third-party delivery platforms (Deliveroo and others), transactions are processed and logged in real-time, and data rolls up into daily, weekly, and monthly reports automatically. Menus, inventory, and tax rates per item are managed centrally — any update reflects across the entire system instantly. When adding menu items, the platform integrates with AI to automatically generate professional product photos — so restaurants can present their menu visually without needing a photographer. Marketing tools, loyalty programs, and gift cards are built in, so owners manage everything from one place.',
      id: 'Platform ini mencakup seluruh siklus operasi restoran: pesanan masuk dari staf internal atau platform delivery pihak ketiga (Deliveroo dan lainnya), transaksi diproses dan dicatat secara real-time, dan data terkumpul otomatis menjadi laporan harian, mingguan, dan bulanan. Menu, inventaris, dan tarif pajak per item dikelola terpusat — setiap pembaruan langsung tercermin di seluruh sistem. Saat menambahkan item menu, platform terintegrasi dengan AI untuk otomatis menghasilkan foto produk profesional — sehingga restoran bisa menyajikan menu mereka secara visual tanpa perlu fotografer. Alat marketing, program loyalitas, dan gift card sudah terpasang, jadi pemilik mengelola semuanya dari satu tempat.',
    },
    goal: {
      en: 'The goal was to move European restaurants from fragmented, manual operations to a fully automated POS — with a third-party integration model that connects rather than replaces (restaurants plug Deliveroo and similar platforms directly into Upvendo without rebuilding their existing setup). AI-generated product photography is built into the menu management flow, giving every item a professional visual without extra effort. Result: 6+ restaurants in Belgium are now live on the platform, with the integration model enabling fast onboarding for new users.',
      id: 'Tujuannya adalah memindahkan restoran Eropa dari operasi manual yang terfragmentasi ke POS yang sepenuhnya otomatis — dengan model integrasi pihak ketiga yang menghubungkan alih-alih menggantikan (restoran menyambungkan Deliveroo dan platform serupa langsung ke Upvendo tanpa membangun ulang setup yang sudah ada). Fotografi produk hasil AI tertanam dalam alur pengelolaan menu, memberi setiap item visual profesional tanpa usaha tambahan. Hasilnya: 6+ restoran di Belgia kini live di platform, dengan model integrasi yang memungkinkan onboarding cepat untuk pengguna baru.',
    },
    externalLinks: [
      { label: { en: 'Visit Upvendo', id: 'Kunjungi Upvendo' }, url: 'https://upvendo.com/' },
    ],
  },
  {
    slug: 'threadline-telehealth',
    title: 'Threadline — Telehealth Dashboard',
    category: 'SaaS Dashboard',
    year: '2026',
    role: 'UI/UX Designer',
    timeline: { en: '5 months', id: '5 bulan' },
    summary: {
      en: 'A telehealth dashboard for clinicians — replacing fragmented manual workflows with an integrated platform for session management, clinical documentation, and psychometric assessments.',
      id: 'Dashboard telehealth untuk klinisi — menggantikan workflow manual yang terfragmentasi dengan platform terintegrasi untuk manajemen sesi, dokumentasi klinis, dan asesmen psikometrik.',
    },
    tags: ['Figma', 'SaaS', 'Dashboard', 'Auto Layout', 'MUI Components'],
    image: '/projects/threadline.webp',
    featured: true,
    protected: true,
    problem: {
      en: 'Clinicians were coordinating care through disconnected tools — running session calls on external platforms, taking notes by hand, and sourcing psychometric assessments from the internet or shared documents. The lack of a unified workflow created inefficiencies and made it difficult to deliver consistent, trackable care.',
      id: 'Para klinisi mengoordinasikan layanan lewat alat-alat yang terputus — menjalankan panggilan sesi di platform eksternal, mencatat secara manual, dan mengambil asesmen psikometrik dari internet atau dokumen bersama. Ketiadaan workflow terpadu menciptakan inefisiensi dan menyulitkan penyampaian layanan yang konsisten dan bisa dilacak.',
    },
    method: {
      en: 'Worked within an Agile team, collaborating directly with the product owner and stakeholders to map the full clinician workflow. Conducted competitor analysis and collaborative brainstorming to shape the information architecture and feature priorities. Designed in Figma using MUI Components to stay aligned with the development stack. Delivered detailed handoffs to the development team and maintained a structured UX review process — tracking implementation accuracy against design intent through a dedicated review document.',
      id: 'Bekerja dalam tim Agile, berkolaborasi langsung dengan product owner dan stakeholder untuk memetakan keseluruhan workflow klinisi. Melakukan analisis kompetitor dan brainstorming kolaboratif untuk membentuk information architecture dan prioritas fitur. Mendesain di Figma memakai MUI Components agar selaras dengan development stack. Menyerahkan handoff detail ke tim development dan menjaga proses UX review yang terstruktur — melacak akurasi implementasi terhadap intent desain lewat dokumen review khusus.',
    },
    businessProcess: {
      en: 'Built a detailed feature brief covering all modules, verifying that every touchpoint aligned with the end-to-end workflow of both clinicians and their clients. The flow covers client onboarding, session scheduling, call management, post-session documentation, and psychometric test assignment — each module designed to reduce manual input and ensure continuity across the full care journey.',
      id: 'Menyusun feature brief detail yang mencakup semua modul, memastikan setiap touchpoint selaras dengan workflow end-to-end baik klinisi maupun klien mereka. Alurnya mencakup onboarding klien, penjadwalan sesi, manajemen panggilan, dokumentasi pasca-sesi, dan penugasan tes psikometrik — setiap modul dirancang untuk mengurangi input manual dan memastikan kesinambungan di sepanjang perjalanan layanan.',
    },
    goal: {
      en: 'Enable clinicians to manage their full care workflow from a single dashboard — from sending a session link to conducting the call, documenting notes, and assigning assessments post-session. Psychometric testing is fully functional within the platform, and clients join sessions by simply pasting a link into their browser — no additional software required.',
      id: 'Memungkinkan klinisi mengelola seluruh workflow layanan mereka dari satu dashboard — dari mengirim tautan sesi hingga menjalankan panggilan, mencatat dokumentasi, dan menugaskan asesmen pasca-sesi. Tes psikometrik berfungsi penuh di dalam platform, dan klien bergabung ke sesi cukup dengan menempelkan tautan di browser — tanpa perlu software tambahan.',
    },
  },
  {
    slug: 'kitasemua-insurance',
    title: 'Kitasemua — Insurance Mobile App',
    category: 'Mobile App',
    year: '2025',
    role: 'UI/UX Designer',
    timeline: { en: '6 months', id: '6 bulan' },
    summary: {
      en: 'Digitized the end-to-end insurance experience for underserved users — replacing agent visits and paperwork with a conversational bot that guides purchase and claims through plain-language chat.',
      id: 'Mendigitalkan pengalaman asuransi end-to-end untuk pengguna yang kurang terlayani — menggantikan kunjungan agen dan dokumen kertas dengan bot percakapan yang memandu pembelian dan klaim lewat chat berbahasa sederhana.',
    },
    tags: ['Figma', 'Brainstorming', 'Wireframe', 'Animation', 'Mobile App'],
    image: '/projects/kitasemua.webp',
    featured: true,
    protected: true,
    problem: {
      en: 'Traditional insurance in Indonesia required users to physically meet an agent, fill out paper forms, and wait through an opaque process — creating high barriers for lower-middle income users who needed coverage the most. There was no clear, simple way to understand what was covered, file a claim, or track its status without human assistance.',
      id: 'Asuransi tradisional di Indonesia mengharuskan pengguna bertemu agen secara fisik, mengisi formulir kertas, dan menunggu melalui proses yang tidak transparan — menciptakan hambatan besar bagi pengguna berpenghasilan menengah ke bawah yang justru paling membutuhkan perlindungan. Tidak ada cara yang jelas dan sederhana untuk memahami apa yang ditanggung, mengajukan klaim, atau melacak statusnya tanpa bantuan manusia.',
    },
    method: {
      en: 'Worked directly from the brief with a focus on the target audience: lower-middle income users unfamiliar with financial jargon or multi-step digital flows. Ran brainstorming sessions to map the full user journey — from awareness to claim settlement — then wireframed and animated key interactions to validate the conversational bot approach before moving to high-fidelity screens.',
      id: 'Bekerja langsung dari brief dengan fokus pada target audiens: pengguna berpenghasilan menengah ke bawah yang tidak familier dengan jargon keuangan atau alur digital berlangkah banyak. Menjalankan sesi brainstorming untuk memetakan keseluruhan user journey — dari awareness hingga penyelesaian klaim — lalu membuat wireframe dan menganimasikan interaksi kunci untuk memvalidasi pendekatan bot percakapan sebelum beralih ke layar high-fidelity.',
    },
    businessProcess: {
      en: 'The app replaces the traditional agent-led sales model with a self-serve digital flow. Users browse available plans, receive guided recommendations through the chat bot, complete their purchase in-app, and file claims through the same conversational interface — eliminating the need for any face-to-face interaction or paper documentation at every stage.',
      id: 'Aplikasi ini menggantikan model penjualan tradisional yang dipimpin agen dengan alur digital swalayan. Pengguna menelusuri paket yang tersedia, menerima rekomendasi terpandu lewat chat bot, menyelesaikan pembelian di dalam aplikasi, dan mengajukan klaim lewat antarmuka percakapan yang sama — menghilangkan kebutuhan interaksi tatap muka atau dokumentasi kertas di setiap tahap.',
    },
    goal: {
      en: 'Enable lower-middle income users to purchase and file insurance claims entirely from their phone — no agent visit, no paperwork, no complex language. The conversational bot removes friction at every touchpoint, making the process as simple as a chat. Result: a user can go from zero to covered, and from incident to claim filed, without leaving the app.',
      id: 'Memungkinkan pengguna berpenghasilan menengah ke bawah membeli dan mengajukan klaim asuransi sepenuhnya dari ponsel mereka — tanpa kunjungan agen, tanpa dokumen kertas, tanpa bahasa yang rumit. Bot percakapan menghilangkan friksi di setiap touchpoint, membuat prosesnya sesederhana chat. Hasilnya: pengguna bisa beranjak dari nol ke terlindungi, dan dari insiden ke klaim terajukan, tanpa keluar dari aplikasi.',
    },
  },
  {
    slug: 'fanplanner',
    title: 'Fanplanner — Personal Finance PWA',
    category: 'PWA Web App',
    year: '2026',
    role: 'Product Owner',
    timeline: { en: '3 months', id: '3 bulan' },
    summary: {
      en: 'A personal-finance PWA I designed, built, and shipped end-to-end — turning everyday spending into effortless records through natural-language input, receipt scanning, and multi-pocket tracking, with clean Excel/PDF exports.',
      id: 'PWA keuangan pribadi yang saya desain, bangun, dan rilis end-to-end — mengubah pengeluaran sehari-hari menjadi catatan yang mudah lewat input bahasa natural, pemindaian struk, dan pelacakan multi-pocket, dengan ekspor Excel/PDF yang rapi.',
    },
    tags: [
      'Figma',
      'Cursor',
      'Product Thinking',
      'Business Strategy',
      'Cloudflare',
      'Web Analytics',
      'Social Media',
      'MVP',
    ],
    image: '/projects/fanplanner.webp',
    // Gallery ordered as the product story: overview → input → tracking → pockets → assistant → account
    images: [
      '/projects/fanplanner-home.webp',
      '/projects/fanplanner-light.webp',
      '/projects/fanplanner-trans.webp',
      '/projects/fanplanner-input.webp',
      '/projects/fanplanner-history.webp',
      '/projects/fanplanner-pocket.webp',
      '/projects/fanplanner-detailpocket.webp',
      '/projects/fanplanner-chatbot.webp',
      '/projects/fanplanner-setting.webp',
    ],
    live: true,
    ownProduct: true,
    featured: true,
    protected: false,
    metrics: [
      { value: '100+', label: { en: 'active users', id: 'pengguna aktif' } },
      { value: '10+', label: { en: 'paying subscribers', id: 'pelanggan berbayar' } },
      { value: '3', label: { en: 'MVPs shipped', id: 'MVP dirilis' } },
    ],
    problem: {
      en: "Most people still track money by hand — scattered across phone notes, spreadsheets, or paper — so it's tedious and easy to give up on. Fanplanner makes recording effortless: type it in plain language (“Beli bakso 24 ribu” and the amount and date fill themselves in) or just snap a photo of the receipt. Every record can be reviewed and exported to a clean, presentable Excel or PDF.",
      id: 'Kebanyakan orang masih mencatat uang secara manual — tersebar di catatan ponsel, spreadsheet, atau kertas — sehingga merepotkan dan mudah menyerah. Fanplanner membuat pencatatan jadi mudah: ketik dengan bahasa sederhana (“Beli bakso 24 ribu” dan nominal serta tanggalnya terisi sendiri) atau cukup foto struknya. Setiap catatan bisa ditinjau dan diekspor ke Excel atau PDF yang rapi dan siap disajikan.',
    },
    method: {
      en: 'I started from problems I saw around me — and in my own life — then mapped each one to a solution and studied competitors for ideas worth adapting. To validate, I ran qualitative research: a Google Form asking about features, usability, and suggestions after people tried the app. I turned that feedback into a simple metric matrix to surface which needs were most urgent — which is exactly how the Pockets feature emerged.',
      id: 'Saya mulai dari masalah yang saya lihat di sekitar — dan dalam hidup saya sendiri — lalu memetakan tiap masalah ke solusinya dan mempelajari kompetitor untuk ide yang layak diadaptasi. Untuk memvalidasi, saya menjalankan riset kualitatif: sebuah Google Form yang menanyakan fitur, usability, dan saran setelah orang mencoba aplikasinya. Saya mengubah masukan itu menjadi matriks metrik sederhana untuk memunculkan kebutuhan mana yang paling mendesak — dan begitulah persisnya fitur Pockets muncul.',
    },
    businessProcess: {
      en: 'The model is product-led: core tracking stays free with sensible limits, and a premium license unlocks everything — unlimited transactions, more than two pockets, split-bill sharing, and unlimited chatbot questions. Licenses run on tokens I built with Supabase: an active token means an active license with no feature limits, which is how Fanplanner earns revenue.',
      id: 'Modelnya product-led: pelacakan inti tetap gratis dengan batas yang wajar, dan lisensi premium membuka semuanya — transaksi tanpa batas, lebih dari dua pocket, berbagi split-bill, dan pertanyaan chatbot tanpa batas. Lisensi berjalan di atas token yang saya bangun dengan Supabase: token aktif berarti lisensi aktif tanpa batasan fitur, dan begitulah Fanplanner memperoleh pendapatan.',
    },
    goal: {
      en: 'Help people actually understand and maintain their cash flow month to month. The features that landed hardest were Pockets, natural-language entry, and the clean exports — users could finally read their spending at a glance. Fanplanner is live and public, with 100+ monthly active users and 10+ paying subscribers.',
      id: 'Membantu orang benar-benar memahami dan menjaga arus kas mereka dari bulan ke bulan. Fitur yang paling mengena adalah Pockets, input bahasa natural, dan ekspor yang rapi — pengguna akhirnya bisa membaca pengeluaran mereka secara sekilas. Fanplanner sudah live dan publik, dengan 100+ pengguna aktif bulanan dan 10+ pelanggan berbayar.',
    },
    roadmap: [
      {
        phase: 'MVP 1',
        title: { en: 'Effortless recording', id: 'Pencatatan yang mudah' },
        body: {
          en: 'Natural-language text entry, receipt-photo capture, and clean Excel/PDF exports.',
          id: 'Input teks bahasa natural, tangkapan foto struk, dan ekspor Excel/PDF yang rapi.',
        },
      },
      {
        phase: 'MVP 2',
        title: { en: 'Pockets & sharing', id: 'Pockets & berbagi' },
        body: {
          en: 'Multi-wallet Pockets so every transaction shows which balance it left, plus split-bill sharing with friends.',
          id: 'Pockets multi-dompet sehingga setiap transaksi menunjukkan dari saldo mana ia keluar, plus berbagi split-bill dengan teman.',
        },
      },
      {
        phase: 'MVP 3',
        title: { en: 'Assistant & premium', id: 'Asisten & premium' },
        body: {
          en: 'An AI chatbot that explains your finances and suggests next steps, plus a Supabase-token premium license.',
          id: 'Chatbot AI yang menjelaskan keuanganmu dan menyarankan langkah berikutnya, plus lisensi premium berbasis token Supabase.',
        },
      },
    ],
    externalLinks: [
      { label: { en: 'Open App', id: 'Buka Aplikasi' }, url: 'https://fanplanner-app.com/' },
      { label: { en: 'View Landing Page', id: 'Lihat Landing Page' }, url: 'https://fanplanner.site/' },
    ],
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
  { key: 'dribbble', label: 'Dribbble', url: 'https://dribbble.com/fanbayy' },
  { key: 'behance', label: 'Behance', url: 'https://www.behance.net/fanddibayy' },
  // LinkedIn added on top of the original three — hiring managers expect it.
  // Remove this line if you'd rather keep only design profiles.
  { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/fandibayu/' },
  { key: 'github', label: 'GitHub', url: 'https://github.com/Fanddibay' },
];

/** Contact + identity constants. */
export const SITE = {
  name: 'Fandi Bayu',
  role: 'UI/UX Designer',
  email: 'fandi.bayu110@gmail.com',
  /** Résumé PDFs by language — served from /public. */
  resume: { id: '/resume-id.pdf', en: '/resume-en.pdf' },
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
  'Lovable',
  'MCP Connector',
  'Claude Skills',
  'Project MD',
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

/**
 * Highlights ticker — feeds the blue auto-scrolling stat band shown right below
 * the hero (StatsMarquee). `value` is the headline number (locale-independent,
 * so it lives here); `labelKey` resolves to a translated label in the messages
 * `statsMarquee` namespace. Numbers tagged (est.) are safe to tune to taste.
 */
export const highlights: { value: string; labelKey: string }[] = [
  { value: '4+', labelKey: 'years' }, // years of experience (see CLAUDE.md)
  { value: upwork.hours, labelKey: 'hours' }, // 2,034 — real Upwork total
  { value: '20+', labelKey: 'projects' }, // est. — projects delivered
  { value: '25+', labelKey: 'clients' }, // 10+ Upwork · 15+ Fiverr
  { value: upwork.earned, labelKey: 'earned' }, // $10K+
  { value: upwork.status, labelKey: 'topRated' }, // Top Rated
];

export type ExperienceMetric = { value: string; label: Localized };

export type ExperienceRole = {
  title: string;
  /** Employment type, e.g. "Part-time" / "Paruh Waktu". */
  type?: Localized;
  /** Time range, e.g. "May 2023 — Present" / "Mei 2023 — Sekarang". */
  period: Localized;
  description: Localized;
  /** Plain metric chips, e.g. ["$1K+ earned", "15+ clients"] (Fiverr-style). */
  stats?: Localized[];
  /** Structured value+label metrics, rendered elegantly (featured roles). */
  metrics?: ExperienceMetric[];
  /** Small status pill, e.g. "Top Rated". Platform term — kept in English. */
  badge?: string;
  /** External CTA link (e.g. Upwork profile). Label comes from messages. */
  ctaUrl?: string;
  /** Certificate image (in /public). Opens in a lightbox modal when set. */
  certificateUrl?: string;
  /** Elevated treatment for a standout role. */
  featured?: boolean;
  /** Marks an ongoing role (the node shows a live dot). */
  current?: boolean;
};

export type ExperienceEntry = {
  /** Company / platform — one timeline node may hold several roles. */
  company: string;
  /** Location, e.g. "Jakarta, Indonesia" or "Remote". Proper nouns — kept as-is. */
  location: string;
  roles: ExperienceRole[];
};

export const experience: ExperienceEntry[] = [
  {
    company: 'Solusi247',
    location: 'Jakarta, Indonesia',
    roles: [
      {
        title: 'UI/UX Engineer',
        type: { en: 'Contract', id: 'Kontrak' },
        period: { en: 'May 2023 — Present', id: 'Mei 2023 — Sekarang' },
        current: true,
        description: {
          en: 'Design and build dashboards and web apps for government and enterprise clients — including BMKG products like Nowcasting and Dashboard Signature. I work both sides: designing flows in Figma to match the client brief, then slicing them into production code (Vue, Tailwind, Bootstrap), with AI-assisted tooling like Cursor to move faster. Sitting between design and engineering, I make sure what ships matches the design — cutting the miscommunication and rework that usually happens on handoff between designers and FE/BE developers.',
          id: 'Mendesain dan membangun dashboard dan web app untuk klien pemerintah dan enterprise — termasuk produk BMKG seperti Nowcasting dan Dashboard Signature. Saya bekerja di dua sisi: mendesain alur di Figma agar sesuai brief klien, lalu slicing menjadi kode produksi (Vue, Tailwind, Bootstrap), dengan tooling berbantuan AI seperti Cursor agar lebih cepat. Berada di antara desain dan engineering, saya memastikan yang dirilis sesuai dengan desain — memangkas miskomunikasi dan rework yang biasanya terjadi saat handoff antara desainer dan developer FE/BE.',
        },
      },
    ],
  },
  {
    company: 'Upwork',
    location: 'Remote',
    roles: [
      {
        title: 'UI/UX Designer',
        type: { en: 'Freelance', id: 'Freelance' },
        period: { en: 'Dec 2024 — Present', id: 'Des 2024 — Sekarang' },
        current: true,
        featured: true,
        badge: upwork.status,
        description: {
          en: 'Designing dashboards and web apps for international clients across SaaS, healthcare, e-commerce, and internal tools — using AI-assisted workflows to speed up research, ideation, and prototyping without losing clarity.',
          id: 'Mendesain dashboard dan web app untuk klien internasional di bidang SaaS, healthcare, e-commerce, dan internal tools — memakai workflow berbantuan AI untuk mempercepat riset, ideasi, dan prototyping tanpa kehilangan kejelasan.',
        },
        metrics: [
          { value: upwork.hours, label: { en: 'hours worked', id: 'jam kerja' } },
          { value: upwork.clients, label: { en: 'clients', id: 'klien' } },
          { value: upwork.earned, label: { en: 'earned', id: 'pendapatan' } },
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
        type: { en: 'Part-time', id: 'Paruh Waktu' },
        period: { en: 'Apr 2025 · 1 mo', id: 'Apr 2025 · 1 bln' },
        description: {
          en: 'Owned the homepage end-to-end — ran stakeholder research to define the right flow and sections, designed it, then shipped it as production code in HTML, Tailwind CSS 4, and JavaScript.',
          id: 'Menangani homepage secara end-to-end — menjalankan riset stakeholder untuk menentukan alur dan bagian yang tepat, mendesainnya, lalu merilisnya sebagai kode produksi dengan HTML, Tailwind CSS 4, dan JavaScript.',
        },
      },
      {
        title: 'UI Designer',
        type: { en: 'Freelance', id: 'Freelance' },
        period: { en: 'Oct 2024 — Mar 2025 · 6 mos', id: 'Okt 2024 — Mar 2025 · 6 bln' },
        description: {
          en: 'Designed mobile apps in Figma aligned to business workflows, built interactive prototypes, and partnered with the team to turn business processes into intuitive, seamless user flows.',
          id: 'Mendesain aplikasi mobile di Figma yang selaras dengan workflow bisnis, membangun prototipe interaktif, dan bermitra dengan tim untuk mengubah proses bisnis menjadi alur pengguna yang intuitif dan mulus.',
        },
      },
    ],
  },
  {
    company: 'Fiverr',
    location: 'Remote',
    roles: [
      {
        title: 'UI/UX Designer',
        type: { en: 'Freelance', id: 'Freelance' },
        period: { en: 'Nov 2024 — Oct 2025', id: 'Nov 2024 — Okt 2025' },
        description: {
          en: 'Designed user-centered interfaces for startups and small businesses — dashboard UI, web apps, and marketing sites with structured UX thinking and pixel-precise execution.',
          id: 'Mendesain antarmuka yang berpusat pada pengguna untuk startup dan bisnis kecil — dashboard UI, web app, dan situs marketing dengan pemikiran UX terstruktur dan eksekusi presisi.',
        },
        stats: [
          { en: '20+ projects delivered', id: '20+ proyek selesai' },
          { en: '15+ clients served', id: '15+ klien terlayani' },
          { en: '$1K+ earned', id: '$1K+ pendapatan' },
        ],
      },
    ],
  },
  {
    company: 'PrimeSkills (VR & AR)',
    location: 'Jakarta, Indonesia',
    roles: [
      {
        title: 'UI/UX Design Intern',
        type: { en: 'Internship', id: 'Magang' },
        period: { en: 'Mar 2023 — Aug 2023', id: 'Mar 2023 — Agu 2023' },
        description: {
          en: 'Supported the design team on immersive VR/AR experiences — interface layouts, interaction flows, and usability improvements — turning concepts into interactive prototypes.',
          id: 'Mendukung tim desain pada pengalaman VR/AR yang imersif — layout antarmuka, alur interaksi, dan peningkatan usability — mengubah konsep menjadi prototipe interaktif.',
        },
        certificateUrl: '/certificate-primeskills.webp',
      },
    ],
  },
];

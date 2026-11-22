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
  /** One punchy, factual outcome for the card — the line a recruiter reads first. */
  impact?: Localized;
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
    slug: 'amanahfy',
    title: 'Amanahfy: Charity Fundraising Platform',
    category: 'Fundraising SaaS',
    year: '2026',
    role: 'Senior UI/UX Designer',
    timeline: { en: 'Aug 2026 – ongoing', id: 'Agu 2026 – berjalan' },
    summary: {
      en: 'Designing the admin side of a fundraising platform for Islamic charities. I turn dense PRDs into analytics, campaign, and registration flows that operators can use without a manual.',
      id: 'Mendesain sisi admin platform fundraising untuk lembaga amal Islam. Saya mengubah PRD yang padat menjadi alur analitik, kampanye, dan registrasi yang bisa dipakai operator tanpa buku panduan.',
    },
    impact: {
      en: '44 feature tickets since Aug 2026: 37 designed, 14 handed off.',
      id: '44 tiket fitur sejak Agu 2026: 37 didesain, 14 diserahkan ke developer.',
    },
    tags: ['Figma', 'Design System', 'User Flows', 'Edge-case States', 'Dev Handoff', 'Claude Code'],
    image: '/projects/amanahfy.webp',
    // Gallery follows the product's sidebar: Dashboards → Campaigns → Registrations
    images: [
      '/projects/amanahfy.webp',
      '/projects/amanahfy-analytics.webp',
      '/projects/amanahfy-labels.webp',
      '/projects/amanahfy-views.webp',
      '/projects/amanahfy-registrations.webp',
    ],
    featured: true,
    protected: false,
    problem: {
      en: 'Amanahfy runs fundraising for Islamic non-profits: campaigns, event registrations, sponsorships, and donations in several currencies. Every new feature arrives as a dense PRD and has to fit into an admin that is already crowded. Lists must scale to hundreds of campaigns, setup must be hard to get wrong, and every edge case (missing details, failed loads, version conflicts) needs a clear answer on screen, not a support ticket.',
      id: 'Amanahfy menjalankan fundraising untuk lembaga nirlaba Islam: kampanye, registrasi event, sponsorship, dan donasi dalam beberapa mata uang. Setiap fitur baru datang sebagai PRD yang padat dan harus masuk ke admin yang sudah ramai. Daftar harus tetap rapi untuk ratusan kampanye, setup harus sulit untuk salah, dan setiap edge case (data belum lengkap, gagal memuat, konflik versi) butuh jawaban yang jelas di layar, bukan tiket support.',
    },
    method: {
      en: 'Spec-first: I read the PRD, map every requirement to a screen and a state, then design the flow and hi-fi screens in Figma on the Brand V2 design system, reusing existing patterns before inventing new ones. Each ticket ships with its edge-case states, a PRD coverage check (covered, partly, later) and dev-ready components with an interactive prototype. Claude Code with a Figma MCP bridge speeds up audits and documentation; the design decisions stay mine.',
      id: 'Spec-first: saya membaca PRD, memetakan setiap requirement ke layar dan state, lalu mendesain alur dan layar hi-fi di Figma di atas design system Brand V2, memakai ulang pola yang sudah ada sebelum membuat yang baru. Setiap tiket diserahkan lengkap dengan state edge case, pengecekan cakupan PRD (tercakup, sebagian, nanti), dan komponen siap-dev dengan prototipe interaktif. Claude Code dengan bridge Figma MCP mempercepat audit dan dokumentasi; keputusan desain tetap di tangan saya.',
    },
    businessProcess: {
      en: 'Work runs on a ticket loop with the product team: product writes the ticket, I design, product reviews, then it goes to developers or back for rework. A single decision log ties every choice to a PRD requirement, so reviews focus on product questions instead of re-explaining past calls, and developers get one source of truth.',
      id: 'Pekerjaan berjalan dalam siklus tiket bersama tim produk: tim produk menulis tiket, saya mendesain, tim produk mereview, lalu diteruskan ke developer atau kembali untuk revisi. Satu decision log mengaitkan setiap keputusan ke requirement PRD, jadi review fokus pada pertanyaan produk alih-alih menjelaskan ulang keputusan lama, dan developer punya satu sumber kebenaran.',
    },
    goal: {
      en: 'Help charities raise more with less admin effort: faster campaign setup, clearer reporting, fewer support questions. Designs so far include a multi-currency Funds Raised analytics view, labels and saved views for large campaign lists, and group-booking registration with missing-details tracking. Since August 2026: 44 feature tickets across the Charity Dashboard, Charity Week, and white-label checkout, 37 designed through base screens or beyond, and 14 handed off to developers. Work is ongoing.',
      id: 'Membantu lembaga amal menggalang lebih banyak dengan usaha admin yang lebih sedikit: setup kampanye lebih cepat, laporan lebih jelas, pertanyaan support lebih sedikit. Desain yang sudah dikerjakan antara lain tampilan analitik Funds Raised multi-mata uang, label dan saved views untuk daftar kampanye yang besar, serta registrasi group booking dengan pelacakan data yang belum lengkap. Sejak Agustus 2026: 44 tiket fitur di Charity Dashboard, Charity Week, dan white-label checkout, 37 sudah didesain sampai base screen atau lebih, dan 14 sudah diserahkan ke developer. Pekerjaan masih berjalan.',
    },
  },
  {
    slug: 'nowcasting-bmkg',
    title: 'Nowcasting BMKG: Weather Nowcasting Dashboard',
    category: 'Map Dashboard',
    year: '2026',
    role: 'UI/UX Engineer',
    timeline: { en: '4 months', id: '4 bulan' },
    summary: {
      en: "Redesigned BMKG's public weather-nowcasting platform so anyone can see the weather forming across Indonesia in real time, with a forecast timeline per region and one-click PDF reports.",
      id: 'Redesign platform nowcasting cuaca publik milik BMKG, sehingga siapa saja bisa melihat kondisi cuaca yang sedang terbentuk di seluruh Indonesia secara real-time, lengkap dengan timeline prakiraan per wilayah dan laporan PDF sekali klik.',
    },
    impact: {
      en: 'Live public tool with real-time nowcasting for all of Indonesia.',
      id: 'Alat publik yang sudah live, dengan nowcasting real-time untuk seluruh Indonesia.',
    },
    tags: ['Figma', 'Cursor', 'Vue', 'Tailwind CSS', 'AI Coding'],
    image: '/projects/nowcasting.webp',
    live: true,
    featured: true,
    protected: false,
    problem: {
      en: "People couldn't quickly check the weather forming in their own area. I redesigned BMKG's older platform and added a forecast timeline for any region the user selects, exportable PDF reports, and a national view of nowcasting activity across Indonesia.",
      id: 'Masyarakat sulit mengecek dengan cepat kondisi cuaca yang sedang terbentuk di wilayah mereka. Saya meredesain platform lama BMKG dan menambahkan timeline prakiraan untuk wilayah mana pun yang dipilih pengguna, laporan PDF yang bisa diekspor, dan tampilan nasional aktivitas nowcasting di seluruh Indonesia.',
    },
    method: {
      en: 'I based the design on what users and stakeholders needed. Each weather condition has its own icon, severity follows a color scale from calm to dangerous, and the flow stays simple enough that anyone can read the map without training.',
      id: 'Desainnya saya dasarkan pada kebutuhan pengguna dan stakeholder. Setiap kondisi cuaca punya ikon sendiri, tingkat bahaya mengikuti skala warna dari tenang sampai berbahaya, dan alurnya cukup sederhana sehingga siapa pun bisa membaca peta tanpa pelatihan.',
    },
    businessProcess: {
      en: "I started from the client's brief and translated the requirements into screens, then reviewed each screen with stakeholders. Once a screen was approved, I built it in Vue and Tailwind CSS myself, so the same person owned the design and the front end.",
      id: 'Saya mulai dari brief klien dan menerjemahkan requirement menjadi layar, lalu mereview setiap layar bersama stakeholder. Setelah disetujui, layar tersebut saya bangun sendiri dengan Vue dan Tailwind CSS, jadi desain dan front-end dipegang orang yang sama.',
    },
    goal: {
      en: 'Ship a public tool that lets anyone in Indonesia read real-time nowcasting at a glance. It is live and open to the public, so a tool built for specialists now works for the general public.',
      id: 'Merilis alat publik yang membuat siapa saja di Indonesia bisa membaca nowcasting real-time dengan cepat. Platform ini sudah live dan terbuka untuk publik, jadi alat yang dulu dibuat untuk kalangan ahli kini bisa dipakai masyarakat umum.',
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
      en: "A redesign of Hgrid 247's data-workflow builder. The old interface was rigid and hard to follow; the new one is a step-by-step canvas that makes building a data pipeline easy to understand.",
      id: 'Redesign data-workflow builder milik Hgrid 247. Antarmuka lamanya kaku dan sulit diikuti; versi baru berupa kanvas step-by-step yang membuat proses membangun data pipeline mudah dipahami.',
    },
    impact: {
      en: 'Rigid builder → clear step-by-step canvas, ~70% AI-assisted.',
      id: 'Builder kaku → kanvas step-by-step yang jelas, ~70% dibantu AI.',
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
      en: 'The previous Hgrid 247 workflow builder was rigid and hard to use. The redesign breaks workflow building into clear steps, so users can follow along and trust what they are building.',
      id: 'Workflow builder Hgrid 247 sebelumnya kaku dan sulit dipakai. Redesign ini memecah proses membangun workflow menjadi langkah-langkah yang jelas, sehingga pengguna bisa mengikuti dan yakin dengan apa yang mereka bangun.',
    },
    method: {
      en: 'I started by working through the stakeholder brief until I understood it fully. I used Claude to turn the brief into a guide.md that an AI agent could work from, then wrote a design.md so every design prompt stayed consistent with the system, and iterated on the output until it was right. About 70% of the project ran through this AI-assisted workflow.',
      id: 'Saya mulai dengan mempelajari brief stakeholder sampai benar-benar paham. Saya memakai Claude untuk mengubah brief menjadi guide.md yang bisa dipakai AI agent, lalu menulis design.md agar setiap prompt desain konsisten dengan sistem, dan mengiterasi hasilnya sampai pas. Sekitar 70% proyek ini berjalan lewat workflow berbantuan AI tersebut.',
    },
    businessProcess: {
      en: "The business goal was simple: the old interface looked stiff and dated, which didn't match the product. A clean, professional redesign presents Hgrid 247 as a modern data-engineering tool that teams want to use.",
      id: 'Tujuan bisnisnya sederhana: antarmuka lama terlihat kaku dan ketinggalan zaman, tidak sesuai dengan produknya. Redesign yang bersih dan profesional menampilkan Hgrid 247 sebagai alat data-engineering modern yang ingin dipakai tim.',
    },
    goal: {
      en: 'Get more users to reach for the tool and make it easy to use. The project is still ongoing, so there are no final outcome metrics yet.',
      id: 'Membuat lebih banyak pengguna mau memakai alat ini dan membuatnya mudah digunakan. Proyek masih berjalan, jadi belum ada metrik hasil akhir.',
    },
  },
  {
    slug: 'benchtop-saas',
    title: 'Benchtop: Construction Document Platform',
    category: 'SaaS Web App',
    year: '2026',
    role: 'UI/UX Designer',
    timeline: { en: '2 months', id: '2 bulan' },
    summary: {
      en: 'Designed the document tracking module for a construction platform. Manual transmittal follow-ups are replaced by automatic delivery and read-receipt tracking for every project stakeholder.',
      id: 'Mendesain modul pelacakan dokumen untuk platform konstruksi. Follow-up transmittal manual diganti pelacakan pengiriman dan tanda terima baca otomatis untuk setiap stakeholder proyek.',
    },
    impact: {
      en: 'Email follow-ups replaced by automatic read-receipt tracking.',
      id: 'Follow-up email diganti pelacakan tanda terima baca otomatis.',
    },
    tags: ['Figma', 'Design System', 'Claude Design', 'SaaS', 'Design Thinking'],
    image: '/projects/benchtop.webp',
    featured: true,
    protected: false,
    problem: {
      en: 'Construction teams had no reliable way to confirm whether stakeholders had actually viewed the drawings sent to them. Follow-ups happened over email, revision history was scattered across files, and there was no official audit trail, so miscommunication between architects, builders, and clients kept happening.',
      id: 'Tim konstruksi tidak punya cara yang andal untuk memastikan apakah stakeholder sudah melihat gambar yang dikirimkan. Follow-up dilakukan lewat email, riwayat revisi tersebar di banyak file, dan tidak ada jejak audit resmi, sehingga miskomunikasi antara arsitek, kontraktor, dan klien terus berulang.',
    },
    method: {
      en: 'Worked within a product team, owning the Documents / Register module end-to-end. Mapped the transmittal workflow with the team, designed the revision matrix and per-recipient view tracking in Figma, and delivered detailed annotations for the dev team to build from. Designed the PDF export flow so any transmittal could be generated as an official cover sheet document.',
      id: 'Bekerja dalam tim produk, menangani modul Documents / Register secara end-to-end. Memetakan workflow transmittal bersama tim, mendesain matriks revisi dan pelacakan tampilan per penerima di Figma, serta menyerahkan anotasi detail untuk dibangun tim dev. Mendesain alur ekspor PDF sehingga transmittal mana pun bisa dihasilkan sebagai dokumen cover sheet resmi.',
    },
    businessProcess: {
      en: 'Documents flow through a single system: a set is issued → recipients (builder, client, structural engineer) are notified → the platform logs who viewed it and when → full revision history stays visible in the matrix. Nobody has to chase email threads or update a spreadsheet by hand.',
      id: 'Dokumen mengalir lewat satu sistem: satu set diterbitkan → penerima (kontraktor, klien, structural engineer) diberi tahu → platform mencatat siapa yang melihat dan kapan → riwayat revisi lengkap tetap terlihat di matriks. Tidak ada lagi rantai email atau spreadsheet yang diperbarui manual.',
    },
    goal: {
      en: 'Replace a manual, email-based process with automated tracking. Stakeholders now see in real time which documents have been delivered and read, and by whom. The PDF export removed manual document preparation, so a multi-step task now takes one click.',
      id: 'Menggantikan proses manual berbasis email dengan pelacakan otomatis. Stakeholder kini bisa melihat secara real-time dokumen mana yang sudah terkirim dan dibaca, serta oleh siapa. Ekspor PDF menghapus penyiapan dokumen manual, jadi pekerjaan beberapa langkah kini cukup satu klik.',
    },
    externalUrl: 'https://behance.net/fandibayu',
  },
  {
    slug: 'upvendo-pos',
    title: 'Upvendo: Restaurant POS System',
    category: 'POS Systems',
    year: '2024–2026',
    role: 'UI/UX Designer',
    timeline: { en: '2 years', id: '2 tahun' },
    summary: {
      en: 'Designed a full POS system for European restaurants. It replaces manual operations with one platform for transactions, reporting, marketing, and third-party delivery integrations.',
      id: 'Mendesain sistem POS lengkap untuk restoran di Eropa. Sistem ini menggantikan operasi manual dengan satu platform untuk transaksi, pelaporan, marketing, dan integrasi delivery pihak ketiga.',
    },
    impact: {
      en: '6+ restaurants in Belgium now run on the platform.',
      id: '6+ restoran di Belgia kini berjalan di platform ini.',
    },
    tags: ['Figma', 'Design System', 'User-Centric', 'Auto Layout'],
    image: '/projects/upvendo.webp',
    live: true,
    featured: true,
    protected: false,
    problem: {
      en: 'European restaurants were running operations by hand, from tracking daily transactions to compiling monthly reports and managing delivery orders on separate platforms. Without one system, the work was error-prone, slow, and hard to scale. Owners needed a single platform for sales, inventory, marketing, and third-party integrations that their team could adopt without starting from scratch.',
      id: 'Restoran di Eropa menjalankan operasinya secara manual, mulai dari mencatat transaksi harian, menyusun laporan bulanan, sampai mengelola pesanan delivery di platform yang terpisah-pisah. Tanpa satu sistem terpadu, pekerjaan ini rawan error, lambat, dan sulit dikembangkan. Pemilik butuh satu platform untuk penjualan, inventaris, marketing, dan integrasi pihak ketiga yang bisa dipakai tim tanpa mulai dari nol.',
    },
    method: {
      en: "Worked in an Agile team and brainstormed directly with the product owner to agree on scope and priorities each sprint. I designed the full system in Figma on a scalable design system with Auto Layout, so every module stayed consistent, and delivered detailed handoffs to the developers while staying involved across iterations. Restaurant staff aren't always technical, so we added step-by-step video instructions to each module, which shortened onboarding and reduced input errors in daily use.",
      id: 'Bekerja dalam tim Agile dan brainstorming langsung dengan product owner untuk menyepakati scope dan prioritas tiap sprint. Saya mendesain seluruh sistem di Figma di atas design system yang scalable dengan Auto Layout agar setiap modul konsisten, lalu menyerahkan handoff detail ke developer dan tetap terlibat sepanjang iterasi. Karena staf restoran tidak selalu paham teknis, kami menambahkan instruksi video step-by-step di setiap modul, yang mempersingkat onboarding dan mengurangi kesalahan input sehari-hari.',
    },
    businessProcess: {
      en: 'The platform covers the full restaurant cycle. Orders come in from staff or third-party delivery platforms such as Deliveroo, transactions are processed and logged in real time, and the data rolls up into daily, weekly, and monthly reports automatically. Menus, inventory, and per-item tax rates are managed in one place, and any update applies across the whole system right away. When staff add a menu item, the platform uses AI to generate a product photo, so restaurants can show their menu visually without hiring a photographer. Marketing tools, loyalty programs, and gift cards are built in, so owners run everything from one place.',
      id: 'Platform ini mencakup seluruh siklus operasional restoran. Pesanan masuk dari staf atau platform delivery pihak ketiga seperti Deliveroo, transaksi diproses dan dicatat secara real-time, lalu datanya otomatis terkumpul menjadi laporan harian, mingguan, dan bulanan. Menu, inventaris, dan tarif pajak per item dikelola di satu tempat, dan setiap perubahan langsung berlaku di seluruh sistem. Saat staf menambahkan item menu, platform memakai AI untuk membuat foto produk, sehingga restoran bisa menampilkan menunya secara visual tanpa menyewa fotografer. Alat marketing, program loyalitas, dan gift card sudah tersedia, jadi pemilik mengelola semuanya dari satu tempat.',
    },
    goal: {
      en: 'The goal was to move European restaurants from scattered, manual operations to an automated POS. Third-party platforms such as Deliveroo plug straight into Upvendo, so restaurants keep their existing setup instead of rebuilding it. AI product photos are part of the menu flow, so every item gets a professional image with no extra work. Result: 6+ restaurants in Belgium are live on the platform, and the integration model keeps onboarding for new restaurants fast.',
      id: 'Tujuannya memindahkan restoran Eropa dari operasi manual yang tersebar ke POS otomatis. Platform pihak ketiga seperti Deliveroo tersambung langsung ke Upvendo, jadi restoran tetap memakai setup yang sudah ada tanpa membangun ulang. Foto produk dari AI sudah menjadi bagian dari alur menu, sehingga setiap item punya gambar profesional tanpa kerja tambahan. Hasilnya: 6+ restoran di Belgia sudah live di platform ini, dan model integrasinya membuat onboarding restoran baru tetap cepat.',
    },
    externalLinks: [
      { label: { en: 'Visit Upvendo', id: 'Kunjungi Upvendo' }, url: 'https://upvendo.com/' },
    ],
  },
  {
    slug: 'threadline-telehealth',
    title: 'Threadline: Telehealth Dashboard',
    category: 'SaaS Dashboard',
    year: '2026',
    role: 'UI/UX Designer',
    timeline: { en: '5 months', id: '5 bulan' },
    summary: {
      en: 'A telehealth dashboard for clinicians that replaces scattered manual workflows with one platform for session management, clinical notes, and psychometric assessments.',
      id: 'Dashboard telehealth untuk klinisi yang menggantikan workflow manual yang tersebar dengan satu platform untuk manajemen sesi, catatan klinis, dan asesmen psikometrik.',
    },
    impact: {
      en: 'Sessions, notes, and psychometric tests in one dashboard.',
      id: 'Sesi, catatan, dan tes psikometrik dalam satu dashboard.',
    },
    tags: ['Figma', 'SaaS', 'Dashboard', 'Auto Layout', 'MUI Components'],
    image: '/projects/threadline.webp',
    featured: true,
    protected: true,
    problem: {
      en: 'Clinicians were coordinating care across disconnected tools: session calls on external platforms, handwritten notes, and psychometric assessments sourced from the internet or shared documents. Without one workflow, care was slow to coordinate and hard to track consistently.',
      id: 'Klinisi mengoordinasikan layanan lewat alat-alat yang terpisah: panggilan sesi di platform eksternal, catatan tulis tangan, dan asesmen psikometrik dari internet atau dokumen bersama. Tanpa satu workflow, koordinasi layanan jadi lambat dan sulit dilacak secara konsisten.',
    },
    method: {
      en: 'Worked in an Agile team with the product owner and stakeholders to map the full clinician workflow. Competitor analysis and joint brainstorming shaped the information architecture and feature priorities. I designed in Figma with MUI components to match the development stack, delivered detailed handoffs, and ran a structured UX review that tracked how closely the build matched the design in a dedicated review document.',
      id: 'Bekerja dalam tim Agile bersama product owner dan stakeholder untuk memetakan seluruh workflow klinisi. Analisis kompetitor dan brainstorming bersama membentuk information architecture dan prioritas fitur. Saya mendesain di Figma dengan komponen MUI agar sesuai dengan development stack, menyerahkan handoff detail, dan menjalankan UX review terstruktur yang mencatat seberapa sesuai hasil build dengan desain di dokumen review khusus.',
    },
    businessProcess: {
      en: 'I wrote a detailed feature brief for every module and checked each touchpoint against the end-to-end workflow of clinicians and their clients. The flow covers client onboarding, session scheduling, call management, post-session notes, and psychometric test assignment, and each module is designed to cut manual input and keep the care journey continuous.',
      id: 'Saya menyusun feature brief detail untuk setiap modul dan mengecek setiap touchpoint terhadap workflow end-to-end klinisi dan klien mereka. Alurnya mencakup onboarding klien, penjadwalan sesi, manajemen panggilan, catatan pasca-sesi, dan penugasan tes psikometrik, dan setiap modul dirancang untuk mengurangi input manual dan menjaga kesinambungan layanan.',
    },
    goal: {
      en: 'Let clinicians run their whole care workflow from one dashboard: sending the session link, running the call, writing notes, and assigning assessments after the session. Psychometric tests run inside the platform, and clients join a session by pasting a link into their browser with no extra software.',
      id: 'Klinisi bisa menjalankan seluruh workflow layanan dari satu dashboard: mengirim tautan sesi, menjalankan panggilan, menulis catatan, dan menugaskan asesmen setelah sesi. Tes psikometrik berjalan di dalam platform, dan klien bergabung ke sesi cukup dengan menempelkan tautan di browser tanpa software tambahan.',
    },
  },
  {
    slug: 'kitasemua-insurance',
    title: 'Kitasemua: Insurance Mobile App',
    category: 'Mobile App',
    year: '2025',
    role: 'UI/UX Designer',
    timeline: { en: '6 months', id: '6 bulan' },
    summary: {
      en: 'Moved the full insurance journey into an app for underserved users. A chat bot guides purchase and claims in plain language, replacing agent visits and paperwork.',
      id: 'Memindahkan seluruh perjalanan asuransi ke aplikasi untuk pengguna yang belum terlayani. Chat bot memandu pembelian dan klaim dengan bahasa sederhana, menggantikan kunjungan agen dan dokumen kertas.',
    },
    impact: {
      en: 'Buy cover and file claims in a chat, with no agent or paperwork.',
      id: 'Beli asuransi dan ajukan klaim lewat chat, tanpa agen dan tanpa kertas.',
    },
    tags: ['Figma', 'Brainstorming', 'Wireframe', 'Animation', 'Mobile App'],
    image: '/projects/kitasemua.webp',
    featured: true,
    protected: true,
    problem: {
      en: 'Traditional insurance in Indonesia meant meeting an agent in person, filling out paper forms, and waiting through an unclear process. That kept out lower-middle income users, who needed coverage most. There was no simple way to see what was covered, file a claim, or track its status without help from a person.',
      id: 'Asuransi tradisional di Indonesia berarti bertemu agen secara langsung, mengisi formulir kertas, dan menunggu proses yang tidak jelas. Hal ini menghambat pengguna berpenghasilan menengah ke bawah, padahal mereka yang paling membutuhkan perlindungan. Tidak ada cara sederhana untuk melihat apa yang ditanggung, mengajukan klaim, atau melacak statusnya tanpa bantuan orang lain.',
    },
    method: {
      en: 'Worked from the brief with a focus on the target audience: lower-middle income users who are unfamiliar with financial terms or multi-step digital flows. I ran brainstorming sessions to map the user journey from first awareness to claim settlement, then wireframed and animated the key interactions to test the chat bot approach before moving to high-fidelity screens.',
      id: 'Bekerja dari brief dengan fokus pada target audiens: pengguna berpenghasilan menengah ke bawah yang belum terbiasa dengan istilah keuangan atau alur digital yang panjang. Saya menjalankan sesi brainstorming untuk memetakan user journey dari awareness sampai penyelesaian klaim, lalu membuat wireframe dan animasi interaksi utama untuk menguji pendekatan chat bot sebelum masuk ke layar high-fidelity.',
    },
    businessProcess: {
      en: 'The app replaces agent-led sales with a self-serve flow. Users browse plans, get recommendations from the chat bot, buy in the app, and file claims through the same chat, with no face-to-face meeting or paper forms at any stage.',
      id: 'Aplikasi ini menggantikan penjualan lewat agen dengan alur swalayan. Pengguna menelusuri paket, mendapat rekomendasi dari chat bot, membeli di aplikasi, dan mengajukan klaim lewat chat yang sama, tanpa tatap muka atau formulir kertas di tahap mana pun.',
    },
    goal: {
      en: 'Let lower-middle income users buy insurance and file claims from their phone, without an agent visit, paperwork, or complex language. The chat bot keeps each step as simple as sending a message. Result: a user can get covered, and later file a claim after an incident, without leaving the app.',
      id: 'Pengguna berpenghasilan menengah ke bawah bisa membeli asuransi dan mengajukan klaim dari ponsel, tanpa kunjungan agen, dokumen kertas, atau bahasa yang rumit. Chat bot membuat setiap langkah sesederhana mengirim pesan. Hasilnya: pengguna bisa mendapat perlindungan, lalu mengajukan klaim setelah insiden, tanpa keluar dari aplikasi.',
    },
  },
  {
    slug: 'fanplanner',
    title: 'Fanplanner: Personal Finance PWA',
    category: 'PWA Web App',
    year: '2026',
    role: 'Product Owner',
    timeline: { en: '3 months', id: '3 bulan' },
    summary: {
      en: 'A personal-finance PWA I designed, built, and shipped myself. You log spending by typing a sentence or scanning a receipt, track it across multiple pockets, and export clean Excel or PDF reports.',
      id: 'PWA keuangan pribadi yang saya desain, bangun, dan rilis sendiri. Pengeluaran dicatat dengan mengetik satu kalimat atau memindai struk, dilacak di beberapa pocket, lalu diekspor ke laporan Excel atau PDF yang rapi.',
    },
    impact: {
      en: 'Designed, built, and shipped solo. 3 MVPs live with paying subscribers.',
      id: 'Didesain, dibangun, dan dirilis sendiri. 3 MVP live dengan pelanggan berbayar.',
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
      en: 'Most people still track money by hand in phone notes, spreadsheets, or on paper, which is tedious and easy to give up on. Fanplanner makes logging quick: type it in plain language (“Beli bakso 24 ribu” fills in the amount and date) or snap a photo of the receipt. Every record can be reviewed and exported to a clean Excel or PDF file.',
      id: 'Kebanyakan orang masih mencatat uang secara manual di catatan ponsel, spreadsheet, atau kertas, sehingga merepotkan dan mudah ditinggalkan. Fanplanner membuat pencatatan jadi cepat: ketik dengan bahasa sehari-hari (“Beli bakso 24 ribu” langsung mengisi nominal dan tanggal) atau foto struknya. Setiap catatan bisa ditinjau dan diekspor ke file Excel atau PDF yang rapi.',
    },
    method: {
      en: 'I started from problems I saw around me and in my own life, mapped each one to a solution, and studied competitors for ideas worth adapting. To validate, I ran qualitative research: a Google Form asking about features, usability, and suggestions after people tried the app. I sorted that feedback into a simple matrix to find the most urgent needs, and that is where the Pockets feature came from.',
      id: 'Saya mulai dari masalah yang saya lihat di sekitar dan dalam hidup saya sendiri, memetakan tiap masalah ke solusinya, dan mempelajari kompetitor untuk ide yang layak diadaptasi. Untuk validasi, saya menjalankan riset kualitatif: Google Form yang menanyakan fitur, usability, dan saran setelah orang mencoba aplikasinya. Masukan itu saya susun ke dalam matriks sederhana untuk menemukan kebutuhan paling mendesak, dan dari situlah fitur Pockets lahir.',
    },
    businessProcess: {
      en: 'The model is product-led. Core tracking is free with sensible limits, and a premium license unlocks unlimited transactions, more than two pockets, split-bill sharing, and unlimited chatbot questions. Licenses run on tokens I built with Supabase: an active token means an active license with no feature limits, and that is how Fanplanner earns revenue.',
      id: 'Modelnya product-led. Pelacakan inti gratis dengan batas yang wajar, dan lisensi premium membuka transaksi tanpa batas, lebih dari dua pocket, berbagi split-bill, dan pertanyaan chatbot tanpa batas. Lisensi berjalan di atas token yang saya bangun dengan Supabase: token aktif berarti lisensi aktif tanpa batasan fitur, dan dari situlah Fanplanner mendapat pemasukan.',
    },
    goal: {
      en: 'Help people understand and manage their cash flow month to month. Users responded most to Pockets, natural-language entry, and the clean exports, because they could finally read their spending at a glance. Fanplanner is live and public, with 100+ monthly active users and 10+ paying subscribers.',
      id: 'Membantu orang memahami dan mengelola arus kas mereka dari bulan ke bulan. Fitur yang paling disukai pengguna adalah Pockets, input bahasa sehari-hari, dan ekspor yang rapi, karena pengeluaran akhirnya bisa dibaca dengan cepat. Fanplanner sudah live dan terbuka untuk publik, dengan 100+ pengguna aktif bulanan dan 10+ pelanggan berbayar.',
    },
    roadmap: [
      {
        phase: 'MVP 1',
        title: { en: 'Quick recording', id: 'Pencatatan cepat' },
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
          id: 'Chatbot AI yang menjelaskan keuangan Anda dan menyarankan langkah berikutnya, plus lisensi premium berbasis token Supabase.',
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
  /** Short project context — what the engagement was about (bilingual). */
  project: Localized;
  /** Verbatim substring of `quote` to emphasise — the line a recruiter should catch. */
  highlight?: string;
  /** Source platform — shown as a verified link on the card (optional). */
  platform?: 'Upwork' | 'Fiverr' | 'LinkedIn';
  url?: string;
};

/** Fiverr profile — linked from the footer and the Fiverr testimonial.
 * Declared before `testimonials`, which reads it. */
export const fiverr = {
  url: 'https://www.fiverr.com/fanddibayy',
} as const;

export const testimonials: Testimonial[] = [
  {
    quote:
      'Fandi went above and beyond with high quality work and on timely manner. He’s very professional and friendly, as well. ✨',
    highlight: 'high quality work and on timely manner',
    name: 'Mira C.',
    role: 'Client',
    project: {
      en: 'Design system for their design pages',
      id: 'Design system untuk halaman desain mereka',
    },
    platform: 'Upwork',
    url: 'https://www.upwork.com/freelancers/~015efc2530d0409842?mp_source=share',
  },
  {
    quote:
      'Working with Fanbayy on our website design was a stellar experience! His creativity and professionalism were top-notch, perfectly aligning with our brand. Proactive communication and deep understanding made collaboration a breeze — LOVED working with him and will definitely be back for future projects! 😊',
    highlight: 'creativity and professionalism were top-notch',
    name: 'Rhanie',
    role: 'Website Design Client',
    project: {
      en: 'Web design, built out in WordPress',
      id: 'Desain web, dibangun ke WordPress',
    },
    platform: 'Fiverr',
    url: fiverr.url,
  },
  {
    quote:
      'Fandi is a highly capable UX/Design professional who consistently delivers thoughtful, user-centric solutions. He has a strong grasp of design fundamentals and pairs that with a practical understanding of how products are built, which makes his work both elegant and implementable.',
    highlight: 'both elegant and implementable',
    name: 'Abhiram Sampath',
    role: 'Design Recommendation',
    project: {
      en: 'UI/UX design for a micro-SaaS',
      id: 'Desain UI/UX untuk micro-SaaS',
    },
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/fandibayu/',
  },
  {
    quote:
      'It was a pleasure working with Fandi. They are a highly talented UI/UX designer who truly understands how to translate a brief into a polished, professional design. Their communication was excellent, and they were very proactive throughout the entire process. I am happy with the final result and would highly recommend them to anyone looking for high-quality, creative work.',
    highlight: 'translate a brief into a polished, professional design',
    name: 'Bechir A.',
    role: 'Client',
    project: {
      en: 'UI/UX design for a mobile app',
      id: 'Desain UI/UX untuk aplikasi mobile',
    },
    platform: 'Upwork',
    url: 'https://www.upwork.com/freelancers/~015efc2530d0409842?mp_source=share',
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

/**
 * Client & platform logos for the hero strip ("Trusted by…"), drawn from the
 * Experience timeline + project clients. Each slug has two files in
 * /public/clients: `<slug>.png` (full colour, shown on hover in light mode) and
 * `<slug>-mono.png` (silhouette used as a CSS mask so it takes any theme colour).
 * `ratio` = width / height of the trimmed artwork; `scale` tunes optical size.
 * NDA clients (Threadline, Kitasemua) are deliberately left out.
 */
export type ClientLogo = {
  slug: string;
  name: string;
  ratio: number;
  /** Text set beside an icon-only mark (for logos that have no wordmark). */
  caption?: string;
  scale?: number;
};

export const clients: ClientLogo[] = [
  { slug: 'amanahfy', name: 'Amanahfy', ratio: 4.894 },
  { slug: 'solusi247', name: 'Solusi247', ratio: 5.206, scale: 0.92 },
  { slug: 'upvendo', name: 'Upvendo', ratio: 4.39, scale: 0.96 },
  { slug: 'atask', name: 'Atask', ratio: 3.392 },
  { slug: 'upwork', name: 'Upwork', ratio: 3.614 },
  { slug: 'fiverr', name: 'Fiverr', ratio: 3.297, scale: 0.92 },
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
 * section. Only hours and clients are public; earnings are intentionally
 * not shown anywhere on the site.
 */
export const upwork = {
  hours: '2,400+',
  clients: '13',
  /** Client products taken all the way to launch via Upwork. */
  launches: '3',
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
  { value: upwork.hours, labelKey: 'hours' }, // 2,400+ — Upwork total
  { value: '20+', labelKey: 'projects' }, // est. — projects delivered
  { value: '25+', labelKey: 'clients' }, // 13 Upwork · 15+ Fiverr (kept conservative)
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
  /**
   * Skills & tools used in this role, shown as scannable chips for recruiters.
   * Industry terms stay in English (they're what recruiters search for) and also
   * feed the Person JSON-LD `knowsAbout` in seo.ts.
   */
  skills?: string[];
  /** Plain metric chips, e.g. ["20+ projects", "15+ clients"] (Fiverr-style). */
  stats?: Localized[];
  /** Structured value+label metrics, rendered elegantly (featured roles). */
  metrics?: ExperienceMetric[];
  /** Small status pill, e.g. "Top Rated". Platform term — kept in English. */
  badge?: string;
  /** External CTA link (e.g. Upwork profile). Label comes from messages. */
  ctaUrl?: string;
  /** Certificate image (in /public). Opens in a lightbox modal when set. */
  certificateUrl?: string;
  /** One punchy, factual result — the line a recruiter reads first. */
  achievement?: Localized;
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
  /** Square logo/icon in /public (timeline tile). */
  logo?: string;
  roles: ExperienceRole[];
};

export const experience: ExperienceEntry[] = [
  {
    company: 'Amanahfy',
    location: 'Remote',
    logo: '/clients/amanahfy-icon.png',
    roles: [
      {
        title: 'Senior UI/UX Designer',
        achievement: {
          en: '44 feature tickets since Aug 2026, with 37 designed and 14 handed off to developers.',
          id: '44 tiket fitur sejak Agu 2026, 37 sudah didesain dan 14 sudah diserahkan ke developer.',
        },
        type: { en: 'Freelance', id: 'Freelance' },
        period: { en: 'Aug 2026 – Present', id: 'Agu 2026 – Sekarang' },
        skills: ['Figma', 'SaaS Dashboard', 'User Flows', 'UI States & Edge Cases', 'Design System', 'Interactive Prototyping', 'Developer Handoff', 'Claude Code'],
        current: true,
        description: {
          en: 'I design the operator side of a fundraising platform for Islamic non-profits: the Charity Dashboard and the role-based campaign dashboard for Charity Week USA. I turn PRDs into user flows, UI states, and hi-fi Figma screens for sponsorship (beneficiary assignment, events, check-in), CRM integrations, and reporting. Developers get dev-ready components and interactive prototypes, and every screen traces back to a PRD requirement and follows the Brand V2 design system.',
          id: 'Saya mendesain sisi operator platform fundraising untuk lembaga nirlaba Islam: Charity Dashboard dan dashboard kampanye Charity Week USA berbasis peran. Saya mengubah PRD menjadi user flow, state UI, dan layar hi-fi di Figma untuk sponsorship (penugasan beneficiary, event, check-in), integrasi CRM, dan pelaporan. Developer menerima komponen siap-dev dan prototipe interaktif, dan setiap layar bisa ditelusuri ke requirement PRD serta mengikuti design system Brand V2.',
        },
      },
    ],
  },
  {
    company: 'Solusi247',
    location: 'Jakarta, Indonesia',
    logo: '/clients/solusi247-icon.png',
    roles: [
      {
        title: 'UI/UX Engineer',
        achievement: {
          en: "Designed and built the front end of BMKG's public Nowcasting platform, now live.",
          id: 'Mendesain dan membangun front-end platform Nowcasting BMKG yang kini live untuk publik.',
        },
        type: { en: 'Contract', id: 'Kontrak' },
        period: { en: 'May 2023 – Present', id: 'Mei 2023 – Sekarang' },
        skills: ['Figma', 'Vue.js', 'Tailwind CSS', 'Bootstrap', 'Dashboard Design', 'Design to Code', 'Cursor'],
        current: true,
        description: {
          en: 'I design and build dashboards and web apps for government and enterprise clients, including BMKG products such as Nowcasting and Dashboard Signature. I design the flows in Figma from the client brief, then build them in Vue, Tailwind, and Bootstrap, using Cursor to speed up the coding. Because one person owns both the design and the front end, fewer details get lost in handoff and the FE and BE developers spend less time on rework.',
          id: 'Saya mendesain dan membangun dashboard serta web app untuk klien pemerintah dan enterprise, termasuk produk BMKG seperti Nowcasting dan Dashboard Signature. Alurnya saya desain di Figma berdasarkan brief klien, lalu saya bangun dengan Vue, Tailwind, dan Bootstrap, dibantu Cursor agar coding lebih cepat. Karena desain dan front-end dipegang satu orang, lebih sedikit detail yang hilang saat handoff dan rework untuk developer FE dan BE berkurang.',
        },
      },
    ],
  },
  {
    company: 'Upwork',
    location: 'Remote',
    logo: '/clients/upwork-icon.svg',
    roles: [
      {
        title: 'UI/UX Designer',
        achievement: {
          en: 'Top Rated on Upwork, based on client feedback across international contracts.',
          id: 'Berstatus Top Rated di Upwork berdasarkan ulasan klien dari kontrak internasional.',
        },
        type: { en: 'Freelance', id: 'Freelance' },
        period: { en: 'Dec 2024 – Present', id: 'Des 2024 – Sekarang' },
        skills: ['Figma', 'Dashboard Design', 'Web App Design', 'UX Research', 'Prototyping', 'AI-assisted Workflow'],
        current: true,
        featured: true,
        badge: upwork.status,
        description: {
          en: 'I design dashboards and web apps for international clients in SaaS, healthcare, e-commerce, and internal tools. AI tools speed up my research, ideation, and prototyping, while the design decisions and final checks stay with me.',
          id: 'Saya mendesain dashboard dan web app untuk klien internasional di bidang SaaS, healthcare, e-commerce, dan internal tools. Tools AI mempercepat riset, ideasi, dan prototyping, sementara keputusan desain dan pengecekan akhir tetap saya pegang.',
        },
        metrics: [
          { value: upwork.hours, label: { en: 'hours worked', id: 'jam kerja' } },
          { value: upwork.clients, label: { en: 'international clients', id: 'klien mancanegara' } },
          { value: upwork.launches, label: { en: 'projects launched', id: 'proyek diluncurkan' } },
        ],
        ctaUrl: upwork.url,
      },
    ],
  },
  {
    company: 'PT Atask Teknologi Internasional',
    location: 'Jakarta · Remote',
    logo: '/clients/atask-icon.png',
    roles: [
      {
        title: 'Web Designer',
        achievement: {
          en: 'Took the homepage from stakeholder research to production code.',
          id: 'Mengerjakan homepage dari riset stakeholder sampai kode produksi.',
        },
        type: { en: 'Part-time', id: 'Paruh Waktu' },
        period: { en: 'Apr 2025 · 1 mo', id: 'Apr 2025 · 1 bln' },
        skills: ['Stakeholder Research', 'Figma', 'HTML', 'Tailwind CSS 4', 'JavaScript'],
        description: {
          en: 'I owned the company homepage: stakeholder research to decide the flow and sections, the design, and the production build in HTML, Tailwind CSS 4, and JavaScript.',
          id: 'Saya memegang homepage perusahaan: riset stakeholder untuk menentukan alur dan section, desain, hingga build produksi dengan HTML, Tailwind CSS 4, dan JavaScript.',
        },
      },
      {
        title: 'UI Designer',
        achievement: {
          en: 'Turned business processes into mobile app flows and clickable prototypes.',
          id: 'Mengubah proses bisnis menjadi alur aplikasi mobile dan prototipe interaktif.',
        },
        type: { en: 'Freelance', id: 'Freelance' },
        period: { en: 'Oct 2024 – Mar 2025 · 6 mos', id: 'Okt 2024 – Mar 2025 · 6 bln' },
        skills: ['Figma', 'Mobile App Design', 'User Flows', 'Interactive Prototyping'],
        description: {
          en: "Designed mobile apps in Figma based on the company's business workflows and built interactive prototypes for review. I worked with the team to turn each business process into a user flow.",
          id: 'Mendesain aplikasi mobile di Figma berdasarkan workflow bisnis perusahaan dan membuat prototipe interaktif untuk direview. Bersama tim, saya mengubah setiap proses bisnis menjadi user flow.',
        },
      },
    ],
  },
  {
    company: 'Fiverr',
    location: 'Remote',
    logo: '/clients/fiverr-icon.svg',
    roles: [
      {
        title: 'UI/UX Designer',
        achievement: {
          en: 'Delivered 20+ projects for startups and small businesses.',
          id: 'Menyelesaikan 20+ proyek untuk startup dan bisnis kecil.',
        },
        type: { en: 'Freelance', id: 'Freelance' },
        period: { en: 'Nov 2024 – Oct 2025', id: 'Nov 2024 – Okt 2025' },
        skills: ['Figma', 'Dashboard UI', 'Web App Design', 'Marketing Sites', 'UX Design'],
        description: {
          en: 'I designed dashboards, web apps, and marketing sites, from the user flows and wireframes to the final UI.',
          id: 'Saya mendesain dashboard, web app, dan situs marketing, mulai dari user flow dan wireframe sampai UI final.',
        },
        stats: [
          { en: '20+ projects delivered', id: '20+ proyek selesai' },
          { en: '15+ clients served', id: '15+ klien terlayani' },
        ],
      },
    ],
  },
  {
    company: 'PrimeSkills (VR & AR)',
    location: 'Jakarta, Indonesia',
    logo: '/clients/primeskills-icon.png',
    roles: [
      {
        title: 'UI/UX Design Intern',
        achievement: {
          en: 'Designed VR/AR interface layouts and interaction flows in a certified internship.',
          id: 'Mendesain layout antarmuka dan alur interaksi VR/AR dalam program magang bersertifikat.',
        },
        type: { en: 'Internship', id: 'Magang' },
        period: { en: 'Mar 2023 – Aug 2023', id: 'Mar 2023 – Agu 2023' },
        skills: ['Figma', 'VR/AR Interfaces', 'Interaction Design', 'Usability', 'Prototyping'],
        description: {
          en: 'Supported the design team on VR/AR projects with interface layouts, interaction flows, and usability fixes, and turned concepts into interactive prototypes.',
          id: 'Membantu tim desain di proyek VR/AR lewat layout antarmuka, alur interaksi, dan perbaikan usability, serta mengubah konsep menjadi prototipe interaktif.',
        },
        certificateUrl: '/certificate-primeskills.webp',
      },
    ],
  },
];

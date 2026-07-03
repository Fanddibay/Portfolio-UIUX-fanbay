# DESIGN.md — Fandi Bayu Portfolio

> Source of truth untuk semua keputusan visual, token, dan interaksi.
> Selalu refer ke file ini sebelum menulis UI code apapun.

---

## 1. Brand Direction

**Positioning:** UI/UX Engineer who designs with intent and builds with AI.
**Audience:** Hiring Managers + Startup Founders
**Mood:** Clean, professional, motion-driven, typography-forward
**Style:** Minimal Single Column — generous whitespace, strong typographic hierarchy, purposeful micro-animations
**Reference Visual:** Dribbble — clean, professional, clear

---

## 2. Color Tokens

### Light Mode (Default)

| Token                    | Hex       | Usage                                |
| ------------------------ | --------- | ------------------------------------ |
| `--background`           | `#FAFAFA` | Page background                      |
| `--foreground`           | `#09090B` | Primary text                         |
| `--card`                 | `#FFFFFF` | Card / section surface               |
| `--card-foreground`      | `#09090B` | Text on cards                        |
| `--primary`              | `#18181B` | Primary action, headings             |
| `--primary-foreground`   | `#FFFFFF` | Text on primary                      |
| `--secondary`            | `#3F3F46` | Secondary labels, subtext            |
| `--secondary-foreground` | `#FFFFFF` | Text on secondary bg                 |
| `--accent`               | `#2563EB` | CTA, links, highlights, hover states |
| `--accent-foreground`    | `#FFFFFF` | Text on accent                       |
| `--muted`                | `#F4F4F5` | Subtle backgrounds, tags             |
| `--muted-foreground`     | `#64748B` | Placeholder, caption                 |
| `--border`               | `#E4E4E7` | Dividers, input borders              |
| `--ring`                 | `#2563EB` | Focus ring                           |
| `--destructive`          | `#DC2626` | Error states                         |

### Dark Mode

| Token                    | Hex       | Usage                                       |
| ------------------------ | --------- | ------------------------------------------- |
| `--background`           | `#09090B` | Page background                             |
| `--foreground`           | `#F4F4F5` | Primary text                                |
| `--card`                 | `#18181B` | Card / section surface                      |
| `--card-foreground`      | `#F4F4F5` | Text on cards                               |
| `--primary`              | `#F4F4F5` | Primary action, headings                    |
| `--primary-foreground`   | `#09090B` | Text on primary                             |
| `--secondary`            | `#27272A` | Secondary surface                           |
| `--secondary-foreground` | `#A1A1AA` | Secondary text                              |
| `--accent`               | `#3B82F6` | CTA, links, highlights (lightened for dark) |
| `--accent-foreground`    | `#FFFFFF` | Text on accent                              |
| `--muted`                | `#27272A` | Subtle backgrounds                          |
| `--muted-foreground`     | `#71717A` | Placeholder, caption                        |
| `--border`               | `#27272A` | Dividers, input borders                     |
| `--ring`                 | `#3B82F6` | Focus ring                                  |
| `--destructive`          | `#EF4444` | Error states                                |

### Implementation (CSS Variables)

```css
:root {
  --background: #fafafa;
  --foreground: #09090b;
  --card: #ffffff;
  --card-foreground: #09090b;
  --primary: #18181b;
  --primary-foreground: #ffffff;
  --secondary: #3f3f46;
  --secondary-foreground: #ffffff;
  --accent: #2563eb;
  --accent-foreground: #ffffff;
  --muted: #f4f4f5;
  --muted-foreground: #64748b;
  --border: #e4e4e7;
  --ring: #2563eb;
  --destructive: #dc2626;
}

.dark {
  --background: #09090b;
  --foreground: #f4f4f5;
  --card: #18181b;
  --card-foreground: #f4f4f5;
  --primary: #f4f4f5;
  --primary-foreground: #09090b;
  --secondary: #27272a;
  --secondary-foreground: #a1a1aa;
  --accent: #3b82f6;
  --accent-foreground: #ffffff;
  --muted: #27272a;
  --muted-foreground: #71717a;
  --border: #27272a;
  --ring: #3b82f6;
  --destructive: #ef4444;
}
```

---

## 3. Typography

### Font Family

| Role                         | Font                                         | Loaded via         |
| ---------------------------- | -------------------------------------------- | ------------------ |
| Heading / Display            | **Plus Jakarta Sans**                        | next/font (Google) |
| Body / UI                    | **Open Sans**                                | next/font (Google) |
| Label / Overline / Timestamp | **Plus Jakarta Sans** (uppercase + tracking) | next/font (Google) |

> Loaded with `next/font` in `[locale]/layout.tsx` (self-hosted, no layout shift) — no `@import`.
> The `font-mono` token is kept for labels but now maps to Plus Jakarta Sans; the
> uppercase + wide tracking carries the "technical label" feel (no true monospace).

### Type Scale

| Token     | Size            | Weight | Font           | Line Height | Usage                   |
| --------- | --------------- | ------ | -------------- | ----------- | ----------------------- |
| `display` | 72px / 4.5rem   | 800    | Archivo        | 1.0         | Hero headline           |
| `h1`      | 56px / 3.5rem   | 700    | Archivo        | 1.1         | Section titles          |
| `h2`      | 40px / 2.5rem   | 700    | Archivo        | 1.2         | Subsection titles       |
| `h3`      | 28px / 1.75rem  | 600    | Archivo        | 1.3         | Card titles             |
| `h4`      | 20px / 1.25rem  | 600    | Archivo        | 1.4         | Labels, tags            |
| `body-lg` | 18px / 1.125rem | 400    | Space Grotesk  | 1.7         | Lead paragraph, about   |
| `body`    | 16px / 1rem     | 400    | Space Grotesk  | 1.6         | General content         |
| `body-sm` | 14px / 0.875rem | 400    | Space Grotesk  | 1.5         | Captions, metadata      |
| `label`   | 12px / 0.75rem  | 500    | Space Grotesk  | 1.4         | Tags, badges, overlines |
| `mono`    | 14px / 0.875rem | 400    | JetBrains Mono | 1.6         | Code, tool names        |

### Tailwind Config

```js
fontFamily: {
  heading: ['var(--font-plus-jakarta)', 'sans-serif'], // Plus Jakarta Sans
  body: ['var(--font-open-sans)', 'sans-serif'],        // Open Sans
  mono: ['var(--font-plus-jakarta)', 'sans-serif'],     // labels (Plus Jakarta)
}
```

---

## 4. Spacing System

Gunakan skala 4px base. Semua spacing harus kelipatan 4.

| Token | Value | Tailwind | Usage                      |
| ----- | ----- | -------- | -------------------------- |
| `xs`  | 4px   | `p-1`    | Icon padding, tight gaps   |
| `sm`  | 8px   | `p-2`    | Component internal spacing |
| `md`  | 16px  | `p-4`    | Default padding            |
| `lg`  | 24px  | `p-6`    | Section padding            |
| `xl`  | 32px  | `p-8`    | Card padding               |
| `2xl` | 48px  | `p-12`   | Section gap                |
| `3xl` | 64px  | `p-16`   | Large section gap          |
| `4xl` | 96px  | `p-24`   | Section vertical padding   |
| `5xl` | 128px | `p-32`   | Hero vertical padding      |

**Max content width:** `max-w-6xl` (1152px) dengan horizontal padding `px-6` (mobile) → `px-8` (desktop)

---

## 5. Border Radius

| Token  | Value  | Tailwind       | Usage                            |
| ------ | ------ | -------------- | -------------------------------- |
| `sm`   | 6px    | `rounded-md`   | Buttons, badges, tags            |
| `md`   | 12px   | `rounded-xl`   | Cards, inputs                    |
| `lg`   | 16px   | `rounded-2xl`  | Large cards, project cards       |
| `xl`   | 24px   | `rounded-3xl`  | Featured sections, hero elements |
| `full` | 9999px | `rounded-full` | Avatars, pills, icon buttons     |

---

## 6. Shadow Scale

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
--shadow-lg:
  0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05);
--shadow-xl:
  0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05);
```

Dark mode: shadows lebih subtle, gunakan border daripada shadow untuk elevation.

---

## 7. Animation System

### Timing Tokens

| Token    | Duration | Easing                          | Usage                               |
| -------- | -------- | ------------------------------- | ----------------------------------- |
| `fast`   | 150ms    | `ease-out`                      | Hover states, small feedback        |
| `normal` | 250ms    | `ease-out`                      | Transitions, reveals                |
| `slow`   | 400ms    | `ease-out`                      | Page elements, section entries      |
| `enter`  | 500ms    | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll-triggered entrances (spring) |

**Rule:** Enter = ease-out. Exit = ease-in (60-70% dari durasi enter).

### Framer Motion Variants

```ts
// Fade up — default entrance untuk semua section
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// Stagger container
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Fade in (untuk cards dalam grid)
export const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

// Slide in dari kiri (untuk about section)
export const slideLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};
```

### Hover Interactions

```css
/* Card hover */
.card-hover {
  transition:
    transform 250ms ease-out,
    box-shadow 250ms ease-out;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* Button hover */
.btn-hover {
  transition:
    background-color 150ms ease-out,
    transform 150ms ease-out;
}
.btn-hover:hover {
  transform: translateY(-1px);
}
```

### Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Component Patterns

### Button

```
Primary:   bg-[--accent] text-white hover:bg-blue-600 — CTA utama
Secondary: border border-[--border] bg-transparent hover:bg-[--muted] — aksi sekunder
Ghost:     bg-transparent hover:bg-[--muted] — navigasi ringan
```

Semua button: `rounded-md`, min-height `44px`, `px-6 py-2.5`, `font-body font-medium text-sm`

### Project Card

```
bg-[--card]
border border-[--border]
rounded-2xl overflow-hidden
hover: translateY(-4px) + shadow-xl
transition: 250ms ease-out

Struktur:
├── Thumbnail (aspect-video, overflow-hidden)
├── Body (p-6)
│   ├── Tags (tool/type labels) — font-mono text-xs
│   ├── Title — font-heading text-h3
│   ├── Description — font-body text-body-sm text-muted-foreground
│   └── CTA row — "View Case Study →"
```

### Section Layout

```
<section class="py-24 px-6 max-w-6xl mx-auto">
  <div class="mb-16"> <!-- Section header -->
    <span class="overline"><!-- label --></span>
    <h2 class="font-heading text-h1"><!-- title --></h2>
  </div>
  <!-- content -->
</section>
```

### Overline Label

Digunakan sebelum setiap section heading:

```
font: font-mono text-label tracking-widest uppercase
color: text-[--accent]
margin-bottom: mb-3
```

---

## 9. Page Structure & Sections

```
/ (root)
├── Navbar          — sticky, logo + nav links + dark mode toggle + language switcher
├── Hero            — display headline, tagline, CTA button, scroll indicator
├── About           — foto, bio singkat, skills split (Design ↔ Engineer)
├── AI Tools        — cara pakai + konteks (bukan sekadar logo)
├── How I Work      — 4-step process cards
├── Featured Work   — project card grid (3-4 item)
├── Case Studies    — list/grid dengan brief summary + link ke MDX page
├── Testimonials    — 2-3 quotes
├── Contact         — form + social links (Behance, Dribbble, GitHub)
└── Footer          — copyright + language switcher

/work/[slug]        — case study MDX pages
```

---

## 10. Dark Mode Toggle

Gunakan `next-themes`. Class strategy: `class` pada `<html>`.

```tsx
// Tailwind config
darkMode: 'class'

// next-themes
<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
```

---

## 11. i18n

Library: **next-intl**
Locale: `en` (default) + `id`
Switch: toggle di navbar (text: `EN / ID`)

Folder structure:

```
/messages
  en.json
  id.json
```

---

## 12. Z-Index Scale

| Layer      | Value | Usage          |
| ---------- | ----- | -------------- |
| `base`     | 0     | Normal content |
| `elevated` | 10    | Cards on hover |
| `sticky`   | 20    | Sticky navbar  |
| `overlay`  | 40    | Modal backdrop |
| `modal`    | 50    | Modal content  |
| `toast`    | 100   | Notifications  |

---

## 13. Accessibility Checklist

- [ ] Contrast minimum 4.5:1 untuk body text (light & dark)
- [ ] Focus ring visible pada semua interactive elements (`ring-2 ring-[--ring] ring-offset-2`)
- [ ] Semua icon-only buttons punya `aria-label`
- [ ] `prefers-reduced-motion` diterapkan
- [ ] Semantic HTML: `<main>`, `<section>`, `<nav>`, `<footer>`, heading hierarchy h1→h3
- [ ] Alt text untuk semua gambar bermakna
- [ ] Language switcher accessible via keyboard

---

## 14. Breakpoints

```
mobile  : 375px  (default, mobile-first)
sm      : 640px
md      : 768px
lg      : 1024px
xl      : 1280px
2xl     : 1440px
```

---

## 15. Quick Reference — Jangan Dilanggar

1. **Jangan hardcode hex** — selalu gunakan CSS variable / Tailwind token
2. **Jangan pakai emoji sebagai icon** — gunakan Lucide React
3. **Semua animasi harus punya `prefers-reduced-motion` fallback**
4. **Dark mode ditest terpisah** — jangan assume light mode values work
5. **Min touch target 44px** untuk semua button/link
6. **Gunakan `font-heading` untuk heading, `font-body` untuk konten**
7. **Accent color hanya untuk CTA, link, dan highlight** — jangan overuse

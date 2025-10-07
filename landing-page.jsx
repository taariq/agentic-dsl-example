import React from "react";

// Landing Page DSL in TypeScript + a tiny renderer/compiler to React
// ------------------------------------------------------------------
// This file defines:
// 1) A human-friendly DSL (as typed TS objects) for landing pages
// 2) TypeScript types + minimal runtime validation
// 3) A compiler that renders the DSL to a modern, responsive landing page using Tailwind
// 4) A fully-worked example DSL at the bottom that you can edit live
//
// Notes:
// - In a real project, split this into /dsl, /compiler, /components.
// - Styling uses Tailwind utility classes for simplicity.
// - Links open in a new tab with rel="noopener noreferrer" for safety.
// - You can replace the demoPage constant with your own DSL JSON and it will render.

// -----------------------
// Type System (DSL schema)
// -----------------------

type Cta = {
  kind: "primary" | "secondary" | "link";
  label: string;
  href: string;
};

type Media =
  | { type: "image"; src: string; alt?: string; rounded?: boolean }
  | { type: "video"; src: string; poster?: string; autoplay?: boolean; loop?: boolean }
  | { type: "code"; language?: string; content: string };

type HeroSection = {
  type: "hero";
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  media?: Media;
  ctas?: Cta[];
  decor?: "gradient" | "mesh" | "none";
  align?: "left" | "center";
};

type Feature = {
  icon?: string; // lucide icon name or emoji in this minimal demo
  title: string;
  description?: string;
};

type FeaturesSection = {
  type: "features";
  id?: string;
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  items: Feature[];
};

type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  logo?: string;
};

type TestimonialsSection = {
  type: "testimonials";
  id?: string;
  title?: string;
  items: Testimonial[];
  layout?: "grid" | "carousel"; // carousel not implemented in this minimal demo
};

type PricingTier = {
  name: string;
  price: string; // human string (e.g., "$29/mo")
  description?: string;
  features: string[];
  cta?: Cta;
  highlight?: boolean;
};

type PricingSection = {
  type: "pricing";
  id?: string;
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
  footnote?: string;
};

type FaqItem = { q: string; a: string };

type FaqSection = {
  type: "faq";
  id?: string;
  title?: string;
  items: FaqItem[];
};

type LogosSection = {
  type: "logos";
  id?: string;
  title?: string;
  items: { alt?: string; src: string }[];
};

type CtaBannerSection = {
  type: "cta";
  id?: string;
  title: string;
  subtitle?: string;
  ctas: Cta[];
};

type FooterSection = {
  type: "footer";
  columns: { heading?: string; links: { label: string; href: string }[] }[];
  fineprint?: string;
};

export type PageDSL = {
  meta: {
    brand: string;
    logo?: string;
    theme?: "light" | "dark";
    nav?: { label: string; href: string }[];
  };
  sections: (
    | HeroSection
    | FeaturesSection
    | TestimonialsSection
    | PricingSection
    | FaqSection
    | LogosSection
    | CtaBannerSection
    | FooterSection
  )[];
};

// -----------------------
// Minimal Runtime Validation
// -----------------------

function invariant(condition: any, message: string): asserts condition {
  if (!condition) throw new Error("DSL validation error: " + message);
}

function validatePage(dsl: PageDSL) {
  invariant(!!dsl.meta?.brand, "meta.brand is required");
  invariant(Array.isArray(dsl.sections), "sections must be an array");
}

// -----------------------
// Utilities & Atoms
// -----------------------

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

const Button: React.FC<{ cta: Cta } & { className?: string }> = ({ cta, className }) => {
  const base = "inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-sm transition hover:shadow";
  const styles =
    cta.kind === "primary"
      ? "bg-black text-white"
      : cta.kind === "secondary"
      ? "bg-white text-black ring-1 ring-black/10"
      : "bg-transparent underline";
  return (
    <a
      href={cta.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, styles, className)}
    >
      {cta.label}
    </a>
  );
};

const SectionShell: React.FC<{ className?: string; decor?: HeroSection["decor"] }>
  = ({ children, className, decor }) => (
  <section className={cn("relative mx-auto max-w-6xl px-6 py-20", className)}>
    {decor === "gradient" && (
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 to-transparent" />
    )}
    {decor === "mesh" && (
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50" style={{ backgroundImage: `radial-gradient(#93c5fd 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
    )}
    {children}
  </section>
);

// -----------------------
// Renderers (Compiler)
// -----------------------

const RenderHero: React.FC<{ s: HeroSection; brand: string; logo?: string; nav?: PageDSL["meta"]["nav"] }>
  = ({ s, brand, logo, nav }) => {
  return (
    <SectionShell decor={s.decor} className={cn(s.align === "center" ? "text-center" : "text-left") }>
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logo ? <img src={logo} alt={brand} className="h-8 w-8 rounded" /> : <div className="h-8 w-8 rounded bg-black" />}
          <span className="text-lg font-semibold">{brand}</span>
        </div>
        {!!nav?.length && (
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hover:underline">{n.label}</a>
            ))}
          </nav>
        )}
      </header>

      {s.eyebrow && <div className="mb-3 inline-flex rounded-full bg-black/5 px-3 py-1 text-xs font-medium">{s.eyebrow}</div>}
      <h1 className={cn("text-4xl md:text-6xl font-bold tracking-tight", s.align === "center" && "mx-auto max-w-3xl")}>{s.title}</h1>
      {s.subtitle && (
        <p className={cn("mt-4 text-lg text-gray-700", s.align === "center" && "mx-auto max-w-2xl")}>{s.subtitle}</p>
      )}
      {!!s.bullets?.length && (
        <ul className={cn("mt-6 grid gap-2 text-sm text-gray-700", s.align === "center" ? "mx-auto max-w-md text-left" : "") }>
          {s.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2"><span>•</span><span>{b}</span></li>
          ))}
        </ul>
      )}

      {!!s.ctas?.length && (
        <div className={cn("mt-8 flex flex-wrap gap-3", s.align === "center" ? "justify-center" : "") }>
          {s.ctas.map((c, i) => <Button key={i} cta={c} />)}
        </div>
      )}

      {s.media && (
        <div className={cn("mt-12", s.align === "center" && "mx-auto max-w-4xl") }>
          {s.media.type === "image" && (
            <img src={s.media.src} alt={s.media.alt || ""} className={cn("w-full border border-black/10", s.media.rounded && "rounded-2xl")} />
          )}
          {s.media.type === "video" && (
            <video className="w-full rounded-2xl border border-black/10" src={s.media.src} poster={s.media.poster} autoPlay={s.media.autoplay} loop={s.media.loop} controls />
          )}
          {s.media.type === "code" && (
            <pre className="overflow-auto rounded-2xl border border-black/10 bg-gray-50 p-4 text-xs"><code>{s.media.content}</code></pre>
          )}
        </div>
      )}
    </SectionShell>
  );
};

const RenderFeatures: React.FC<{ s: FeaturesSection }>= ({ s }) => {
  const cols = s.columns ?? 3;
  return (
    <SectionShell>
      {s.title && <h2 className="text-3xl font-bold">{s.title}</h2>}
      {s.subtitle && <p className="mt-2 text-gray-700">{s.subtitle}</p>}
      <div className={cn("mt-10 grid gap-6", cols === 2 ? "grid-cols-1 md:grid-cols-2" : cols === 4 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-3") }>
        {s.items.map((f, i) => (
          <div key={i} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-2xl">{f.icon || "✨"}</div>
            <div className="mt-3 text-lg font-semibold">{f.title}</div>
            {f.description && <p className="mt-2 text-sm text-gray-700">{f.description}</p>}
          </div>
        ))}
      </div>
    </SectionShell>
  );
};

const RenderTestimonials: React.FC<{ s: TestimonialsSection }>= ({ s }) => (
  <SectionShell>
    {s.title && <h2 className="text-3xl font-bold">{s.title}</h2>}
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {s.items.map((t, i) => (
        <figure key={i} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <blockquote className="text-gray-800">"{t.quote}"</blockquote>
          <figcaption className="mt-4 flex items-center gap-3 text-sm text-gray-700">
            {t.avatar ? <img src={t.avatar} alt={t.author} className="h-8 w-8 rounded-full" /> : <div className="h-8 w-8 rounded-full bg-black/10" />}
            <div>
              <div className="font-medium">{t.author}</div>
              {t.role && <div className="text-gray-500">{t.role}</div>}
            </div>
            {t.logo && <img src={t.logo} alt="logo" className="ml-auto h-6" />}
          </figcaption>
        </figure>
      ))}
    </div>
  </SectionShell>
);

const RenderPricing: React.FC<{ s: PricingSection }>= ({ s }) => (
  <SectionShell>
    {s.title && <h2 className="text-3xl font-bold">{s.title}</h2>}
    {s.subtitle && <p className="mt-2 text-gray-700">{s.subtitle}</p>}
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {s.tiers.map((t, i) => (
        <div key={i} className={cn("rounded-2xl border p-6 shadow-sm", t.highlight ? "border-black bg-white" : "border-black/10 bg-white") }>
          <div className="text-sm font-medium text-gray-500">{t.name}</div>
          <div className="mt-2 text-3xl font-bold">{t.price}</div>
          {t.description && <p className="mt-2 text-sm text-gray-700">{t.description}</p>}
          <ul className="mt-4 space-y-2 text-sm text-gray-800">
            {t.features.map((f, j) => (<li key={j} className="flex items-start gap-2"><span>✔</span><span>{f}</span></li>))}
          </ul>
          {t.cta && <Button className="mt-6 w-full justify-center" cta={t.cta} />}
        </div>
      ))}
    </div>
    {s.footnote && <p className="mt-6 text-center text-xs text-gray-600">{s.footnote}</p>}
  </SectionShell>
);

const RenderLogos: React.FC<{ s: LogosSection }>= ({ s }) => (
  <SectionShell>
    {s.title && <h2 className="text-center text-sm font-medium text-gray-600">{s.title}</h2>}
    <div className="mt-6 grid grid-cols-2 items-center gap-6 opacity-70 md:grid-cols-6">
      {s.items.map((l, i) => (
        <img key={i} src={l.src} alt={l.alt || "logo"} className="mx-auto h-8" />
      ))}
    </div>
  </SectionShell>
);

const RenderFaq: React.FC<{ s: FaqSection }>= ({ s }) => (
  <SectionShell>
    {s.title && <h2 className="text-3xl font-bold">{s.title}</h2>}
    <div className="mt-8 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
      {s.items.map((f, i) => (
        <details key={i} className="group p-6 open:bg-gray-50">
          <summary className="cursor-pointer text-lg font-medium outline-none">{f.q}</summary>
          <p className="mt-2 text-gray-700">{f.a}</p>
        </details>
      ))}
    </div>
  </SectionShell>
);

const RenderCtaBanner: React.FC<{ s: CtaBannerSection }>= ({ s }) => (
  <SectionShell decor="gradient" className="text-center">
    <h2 className="text-3xl font-bold">{s.title}</h2>
    {s.subtitle && <p className="mt-2 text-gray-700">{s.subtitle}</p>}
    <div className="mt-6 flex justify-center gap-3">
      {s.ctas.map((c, i) => <Button key={i} cta={c} />)}
    </div>
  </SectionShell>
);

const RenderFooter: React.FC<{ s: FooterSection }>= ({ s }) => (
  <footer className="mx-auto max-w-6xl px-6 pb-16">
    <div className="grid gap-10 md:grid-cols-4">
      {s.columns.map((col, i) => (
        <div key={i}>
          {col.heading && <div className="text-sm font-semibold text-gray-600">{col.heading}</div>}
          <ul className="mt-3 space-y-2 text-sm">
            {col.links.map((l, j) => (
              <li key={j}><a className="text-gray-700 hover:underline" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    {s.fineprint && <div className="mt-10 text-xs text-gray-500">{s.fineprint}</div>}
  </footer>
);

function compileSection(s: PageDSL["sections"][number], meta: PageDSL["meta"]) {
  switch (s.type) {
    case "hero": return <RenderHero s={s} brand={meta.brand} logo={meta.logo} nav={meta.nav} />;
    case "features": return <RenderFeatures s={s} />;
    case "testimonials": return <RenderTestimonials s={s} />;
    case "pricing": return <RenderPricing s={s} />;
    case "faq": return <RenderFaq s={s} />;
    case "logos": return <RenderLogos s={s} />;
    case "cta": return <RenderCtaBanner s={s} />;
    case "footer": return <RenderFooter s={s} />;
    default: return null;
  }
}

export const LandingPage: React.FC<{ dsl: PageDSL }> = ({ dsl }) => {
  validatePage(dsl);
  const { meta, sections } = dsl;
  return (
    <div className="min-h-screen bg-white text-black">
      {sections.map((s, i) => (
        <div key={i} id={(s as any).id || undefined}>
          {compileSection(s, meta)}
        </div>
      ))}
    </div>
  );
};

// -----------------------
// Demo Page DSL (edit me)
// -----------------------

const demoPage: PageDSL = {
  meta: {
    brand: "Flux",
    logo: "https://dummyimage.com/128x128/000/fff.png&text=F",
    theme: "light",
    nav: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" }
    ]
  },
  sections: [
    {
      type: "hero",
      id: "hero",
      eyebrow: "New",
      title: "Launch beautiful pages in minutes",
      subtitle: "A TypeScript-first DSL that compiles to responsive React components.",
      bullets: [
        "Typed by design (TS/JSON schema)",
        "Composable sections (hero, features, pricing, FAQ)",
        "Bring-your-own brand and theme"
      ],
      media: { type: "image", src: "https://dummyimage.com/1180x600/ede9fe/1f2937.png&text=Your+Screenshot", rounded: true },
      ctas: [
        { kind: "primary", label: "Get Started", href: "https://example.com" },
        { kind: "secondary", label: "GitHub", href: "https://github.com" }
      ],
      decor: "gradient",
      align: "center"
    },
    {
      type: "logos",
      title: "Trusted by teams at",
      items: [
        { src: "https://dummyimage.com/120x40/000/fff.png&text=A" },
        { src: "https://dummyimage.com/120x40/000/fff.png&text=B" },
        { src: "https://dummyimage.com/120x40/000/fff.png&text=C" },
        { src: "https://dummyimage.com/120x40/000/fff.png&text=D" },
        { src: "https://dummyimage.com/120x40/000/fff.png&text=E" },
        { src: "https://dummyimage.com/120x40/000/fff.png&text=F" }
      ]
    },
    {
      type: "features",
      id: "features",
      title: "Everything you need",
      subtitle: "Opinionated defaults, ergonomic authoring, clean output.",
      columns: 3,
      items: [
        { icon: "⚡", title: "Fast authoring", description: "Describe your page as data, not markup." },
        { icon: "🧱", title: "Composable sections", description: "Add hero, features, testimonials, pricing, FAQ and more." },
        { icon: "🧭", title: "Typed & validated", description: "TypeScript types with runtime checks for safety." },
        { icon: "🎨", title: "Brandable", description: "Swap logo, palette, and spacing via tokens." },
        { icon: "📦", title: "Framework friendly", description: "Use in React, Next.js, or export to HTML." },
        { icon: "🧪", title: "Testable", description: "Snapshot and E2E test the compiled output." }
      ]
    },
    {
      type: "testimonials",
      title: "Loved by builders",
      items: [
        { quote: "We shipped our MVP site in an afternoon.", author: "Sam I.", role: "Founder" },
        { quote: "Finally a landing-page DSL that doesn't fight me.", author: "Alex P.", role: "Designer" }
      ]
    },
    {
      type: "pricing",
      id: "pricing",
      title: "Simple pricing",
      subtitle: "Start free. Upgrade when you grow.",
      tiers: [
        { name: "Hobby", price: "$0", description: "For experiments", features: ["1 project", "Basic sections"], cta: { kind: "secondary", label: "Start free", href: "#" } },
        { name: "Pro", price: "$29/mo", description: "For startups", features: ["Unlimited pages", "All sections", "Email support"], highlight: true, cta: { kind: "primary", label: "Buy Pro", href: "#" } },
        { name: "Scale", price: "Contact", description: "For teams", features: ["Custom themes", "Priority support", "SLA"], cta: { kind: "secondary", label: "Talk to sales", href: "#" } }
      ],
      footnote: "Prices in USD. Taxes may apply."
    },
    {
      type: "faq",
      id: "faq",
      title: "Frequently asked questions",
      items: [
        { q: "Can I self-host?", a: "Yes. The DSL compiles to React; deploy anywhere you can host a React app." },
        { q: "Can I add custom sections?", a: "Yes. Extend the types and add a renderer to the compiler switch." },
        { q: "Is theming supported?", a: "You can swap Tailwind tokens or add a theme layer." }
      ]
    },
    {
      type: "cta",
      title: "Ready to build?",
      subtitle: "Use the DSL below as a starting point.",
      ctas: [
        { kind: "primary", label: "Clone Template", href: "#" },
        { kind: "link", label: "Read Docs", href: "#" }
      ]
    },
    {
      type: "footer",
      columns: [
        { heading: "Product", links: [ { label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" } ] },
        { heading: "Company", links: [ { label: "About", href: "#" }, { label: "Careers", href: "#" } ] },
        { heading: "Resources", links: [ { label: "Docs", href: "#" }, { label: "Blog", href: "#" } ] },
        { heading: "Legal", links: [ { label: "Privacy", href: "#" }, { label: "Terms", href: "#" } ] }
      ],
      fineprint: "© " + new Date().getFullYear() + " Flux Labs. All rights reserved."
    }
  ]
};

// Default export renders the demo DSL so you can see it immediately.
export default function Demo() {
  return <LandingPage dsl={demoPage} />;
}

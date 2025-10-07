# Landing Page DSL

A TypeScript-first Domain Specific Language (DSL) for building beautiful, responsive landing pages with minimal code. Define your entire landing page as a typed data structure and compile it to production-ready React components.

## What is this DSL?

This DSL provides a human-friendly way to author landing pages by describing them as structured data instead of writing HTML/JSX directly. It includes:

- **Type-safe schema** - Full TypeScript types for all sections and components
- **Composable sections** - Mix and match hero, features, testimonials, pricing, FAQ, logos, CTAs, and footer sections
- **Runtime validation** - Validates your DSL at runtime to catch errors early
- **React compiler** - Transforms DSL objects into responsive, Tailwind-styled React components
- **Complete example** - A fully-worked demo page you can customize immediately

## Features

- ⚡ **Fast authoring** - Describe your page as data, not markup
- 🧱 **Composable sections** - Pre-built section types for common landing page patterns
- 🧭 **Typed & validated** - TypeScript types with runtime checks for safety
- 🎨 **Brandable** - Customize logo, colors, and nav through simple config
- 📦 **Framework friendly** - Works with React, Next.js, or can be exported to HTML
- 📱 **Responsive** - Mobile-first design with Tailwind utility classes

## Section Types

The DSL supports the following section types:

- **Hero** - Eye-catching header with title, subtitle, bullets, media, and CTAs
- **Features** - Grid of feature cards with icons and descriptions
- **Testimonials** - Customer quotes with avatars and company logos
- **Pricing** - Pricing tiers with feature lists and CTAs
- **FAQ** - Collapsible Q&A section
- **Logos** - Customer or partner logo grid
- **CTA Banner** - Call-to-action section with buttons
- **Footer** - Multi-column footer with links and fine print

## Getting Started

### Fork and Clone

1. Fork this repository on GitHub
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR-USERNAME/agentic-dsl-example.git
   cd agentic-dsl-example
   ```

### Installation

This project requires a React environment. To use with Next.js, Vite, or Create React App:

#### Option 1: Next.js (recommended)

1. Create a new Next.js project:

   ```bash
   npx create-next-app@latest my-landing-page
   cd my-landing-page
   ```

2. Install Tailwind CSS:

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. Configure Tailwind in `tailwind.config.js`:

   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./app/**/*.{js,ts,jsx,tsx,mdx}",
       "./pages/**/*.{js,ts,jsx,tsx,mdx}",
       "./components/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

4. Add Tailwind directives to your CSS (e.g., `app/globals.css` or `styles/globals.css`):

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. Copy `landing-page.jsx` into your project and use it in your pages

#### Option 2: Vite

1. Create a new Vite project:

   ```bash
   npm create vite@latest my-landing-page -- --template react
   cd my-landing-page
   npm install
   ```

2. Install Tailwind CSS:

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. Configure Tailwind in `tailwind.config.js`:

   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

4. Add Tailwind directives to `src/index.css`:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. Copy `landing-page.jsx` into `src/` and import it in your app

### Usage

1. Copy `landing-page.jsx` into your React project
2. Import and use the DSL:

```jsx
import { LandingPage } from './landing-page';

const myPage = {
  meta: {
    brand: "My Product",
    logo: "/logo.png",
    nav: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" }
    ]
  },
  sections: [
    {
      type: "hero",
      title: "Build amazing things",
      subtitle: "The easiest way to create landing pages",
      ctas: [
        { kind: "primary", label: "Get Started", href: "#" }
      ],
      decor: "gradient",
      align: "center"
    },
    {
      type: "features",
      title: "Why choose us?",
      columns: 3,
      items: [
        { icon: "⚡", title: "Fast", description: "Lightning quick performance" },
        { icon: "🔒", title: "Secure", description: "Enterprise-grade security" },
        { icon: "🎨", title: "Beautiful", description: "Stunning design out of the box" }
      ]
    }
  ]
};

export default function App() {
  return <LandingPage dsl={myPage} />;
}
```

## Customization

### Edit the Demo Page

The file includes a complete `demoPage` constant at the bottom. Edit this object to see your changes immediately:

```javascript
const demoPage = {
  meta: {
    brand: "Your Brand",
    logo: "your-logo.png",
    // ... customize meta
  },
  sections: [
    // ... add/edit/remove sections
  ]
};
```

### Add Custom Sections

1. Define a new type in the type system
2. Add a renderer component (e.g., `RenderCustomSection`)
3. Add a case to the `compileSection` switch statement

### Styling

The DSL uses Tailwind CSS utility classes. To customize:

- Modify the utility classes in the renderer components
- Update your `tailwind.config.js` to change colors, spacing, fonts, etc.
- Add your own custom CSS classes

## Project Structure

```text
landing-page.jsx
├── Type System       # TypeScript types defining the DSL schema
├── Validation        # Runtime validation functions
├── Utilities         # Helper functions and atom components
├── Renderers         # React components for each section type
├── Compiler          # Main compilation logic
└── Demo Page         # Example DSL page definition
```

## Example DSL Structure

```typescript
{
  meta: {
    brand: string,
    logo?: string,
    theme?: "light" | "dark",
    nav?: Array<{ label: string, href: string }>
  },
  sections: [
    {
      type: "hero",
      title: string,
      subtitle?: string,
      ctas?: Array<{
        kind: "primary" | "secondary" | "link",
        label: string,
        href: string
      }>,
      media?: {
        type: "image" | "video" | "code",
        src: string,
        // ... type-specific options
      },
      // ... more options
    },
    // ... more sections
  ]
}
```

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-section`)
3. Commit your changes
4. Push to your fork and submit a pull request

## License

MIT License - feel free to use this in your own projects!

## Credits

Built with React and Tailwind CSS. Designed to be simple, composable, and extensible.

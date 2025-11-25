# Next.js Starter Template

A complete starter template for Next.js projects with multi-language support, TypeScript, Tailwind CSS, and configured best practices.

## 🚀 Features

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Internationalization (Next.js Internationalization)** with support for Italian and English
- **Tailwind CSS v4** for styling
- **shadcn/ui** for reusable UI components
- **ESLint** and **Prettier** configured
- **Husky** for git hooks
- **Optimized fonts** (Geist Sans and Geist Mono)

## 📁 Project Structure

```
nextjs-starter-template/
├── app/                          # Main Next.js application directory
│   ├── [lang]/                   # Dynamic route for supported languages
│   │   ├── components/           # Page-specific components
│   │   │   └── client-button.tsx # Example client-side component
│   │   ├── layout.tsx            # Main layout with i18n support
│   │   └── page.tsx              # Homepage
│   ├── layout.tsx                # Root application layout
│   ├── globals.css               # Global styles and CSS variables
│   └── favicon.ico               # Favicon
│
├── lib/                          # Libraries and utilities
│   ├── configs/                  # Configurations
│   │   └── locales/              # i18n configuration
│   │       ├── i18n.ts           # Function to load translations
│   │       └── index.ts          # Supported locales and default
│   │
│   ├── context/                  # React Context
│   │   └── translation.context.tsx # Context for translations
│   │
│   ├── providers/                # React Providers
│   │   └── index.tsx             # Main provider with i18n
│   │
│   ├── types/                    # TypeScript types
│   │   └── page.type.ts          # Types for page parameters
│   │
│   └── utils/                    # Utility functions
│       ├── i18n.utils.ts         # Utilities for translation interpolation
│       └── shadcn.utils.ts       # Utilities for shadcn/ui
│
├── i18n/                         # Translation JSON files
│   ├── en.json                   # English translations
│   └── it.json                   # Italian translations
│
├── public/                       # Public static files
│
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint configuration
├── postcss.config.mjs            # PostCSS configuration
├── .prettierrc                   # Prettier configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🏗️ Architecture

### Routing and Internationalization

The project uses Next.js dynamic routing with the `[lang]` route to handle supported languages:

- **Pre-configured languages**: Italian (`it`) and English (`en`)
- **Default language**: Italian
- **URL structure**: `/{lang}/...` (e.g., `/it/`, `/en/`)

### Translation System

The i18n system is implemented with:

1. **JSON files** in `i18n/` for each language
2. **`getTranslations()` function** to load translations on the server side
3. **React Context** (`TranslationContext`) to share translations
4. **`useTranslation()` hook** to access translations in client components
5. **`interpolate()` utility** to interpolate variables in strings (e.g., `{{count}}`)

### Components

- **Server Components**: Default React components (e.g., `page.tsx`)
- **Client Components**: Components with `'use client'` for interactivity (e.g., `client-button.tsx`)

### Styling

- **Tailwind CSS v4** for utility-first CSS
- **CSS variables** for themes and colors
- **Dark mode** supported via Tailwind classes
- **shadcn/ui** for accessible and customizable UI components

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build and production
npm run build        # Run lint and build for production
npm run start        # Start production server

# Code quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 📦 Main Dependencies

### Runtime

- `next`: React framework for production
- `react` / `react-dom`: UI library
- `@formatjs/intl-localematcher`: Language matching
- `negotiator`: Language preference negotiation
- `class-variance-authority`: Utility for class variants
- `clsx` / `tailwind-merge`: Utilities for CSS class management
- `lucide-react`: Icons

### Development

- `typescript`: Type safety
- `tailwindcss`: CSS framework
- `eslint`: Linter
- `prettier`: Code formatter
- `husky`: Git hooks

## 🔧 Code Quality Tools

### ESLint Configuration

ESLint is configured with a comprehensive set of rules in `eslint.config.mjs`:

- **Next.js presets**: Uses `eslint-config-next` for core web vitals and TypeScript support
- **TypeScript ESLint**: Full TypeScript support with type-aware linting
- **Custom rules**:
  - `no-console`: Error (allows `warn` and `error`)
  - `no-debugger`: Error
  - `@typescript-eslint/no-unused-vars`: Error (ignores rest siblings)
  - `@typescript-eslint/no-non-null-assertion`: Warning
  - `no-restricted-imports`: Prevents direct `@radix-ui/*` imports (should only be used for component generation)
  - `import/no-extraneous-dependencies`: Error (prevents importing dev dependencies in production code)
- **Component-specific overrides**: Special rules for `components/**/*` files
- **Ignored directories**: `.next/`, `out/`, `build/`, `node_modules/`, `public/`, config files

### Prettier Configuration

Prettier is configured in `.prettierrc` with the following settings:

- **Single quotes**: `true`
- **Trailing commas**: `es5`
- **Tab width**: `2` spaces
- **Bracket spacing**: `true`
- **Use tabs**: `false` (uses spaces)
- **Print width**: `110` characters
- **Semicolons**: `false`
- **Arrow parens**: `avoid` (omit parentheses when possible)

### Husky Git Hooks

Husky is configured to run pre-commit hooks automatically:

- **Setup**: Automatically initialized via `npm run prepare` script
- **Pre-commit hook**: Runs `lint-staged` before each commit
- **lint-staged configuration** (in `package.json`):
  - Runs on `*.{js,jsx,ts,tsx}` files
  - Executes `prettier --write` to format code
  - Executes `eslint --max-warnings=0` to lint code (fails on any warnings)

This ensures that all committed code is properly formatted and passes linting checks.

## 🚦 Getting Started

1. **Clone the repository** (or use this template)

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** at [http://localhost:3000](http://localhost:3000)
   - Italian: [http://localhost:3000/it](http://localhost:3000/it)
   - English: [http://localhost:3000/en](http://localhost:3000/en)

## 📝 Adding New Translations

1. Add keys to JSON files in `i18n/`:

   ```json
   // i18n/it.json
   {
     "hello_world": "Ciao Mondo",
     "my_new_key": "Il mio nuovo testo"
   }
   ```

2. Use translations in components:

   ```tsx
   // Server Component
   const t = await getTranslations(lang as SupportedLocale)
   <h1>{t.my_new_key}</h1>

   // Client Component
   const t = useTranslation()
   <h1>{t.my_new_key}</h1>
   ```

3. For variable interpolation:
   ```json
   {
     "welcome": "Benvenuto, {{name}}!"
   }
   ```
   ```tsx
   interpolate(t.welcome, { name: 'Luca' })
   ```

## 🎨 Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Components will be added to the `components/` directory (if configured) or you can create them manually.

## 🔧 Configuration

### Adding a New Language

1. Add the language in `lib/configs/locales/index.ts`:

   ```ts
   export const supportedLocales = ['it', 'en', 'fr'] as const
   ```

2. Create the translation file in `i18n/fr.json`

3. Add the import in `lib/configs/locales/i18n.ts`:
   ```ts
   const translations = {
     en: () => import('../../../i18n/en.json').then(module => module.default),
     it: () => import('../../../i18n/it.json').then(module => module.default),
     fr: () => import('../../../i18n/fr.json').then(module => module.default),
   }
   ```

## 📚 Best Practices

- **Server Components**: Use server components by default for better performance
- **Client Components**: Use `'use client'` only when necessary (interactivity, hooks, events)
- **Type Safety**: Leverage TypeScript for complete type safety
- **Code Quality**: ESLint and Prettier are configured with Husky for pre-commit hooks
- **i18n**: Keep all translatable strings in JSON files

## 🚀 Deploy

The project is ready to deploy on [Vercel](https://vercel.com) or other platforms that support Next.js.

```bash
npm run build
```

## 📄 License

This is a starter template. Feel free to use and modify it according to your needs.

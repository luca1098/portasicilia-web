# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 3003
npm run build        # Lint then build for production
npm run start        # Start production server on port 3003
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Architecture

### Routing & Internationalization

- **Next.js 16 App Router** with dynamic `[lang]` segment for i18n
- Supported locales: `it` (default), `en` - defined in `lib/configs/locales/index.ts`
- URL structure: `/{lang}/...` (e.g., `/it/`, `/en/`)
- Route groups: `(public)` for public pages, `(listings)` for listing pages

### Translation System

1. JSON translation files in `i18n/{locale}.json`
2. Server-side: `getTranslations(locale)` from `lib/configs/locales/i18n.ts`
3. Client-side: `useTranslation()` hook from `lib/context/translation.context.tsx`
4. Variable interpolation: `interpolate(t.key, { name: 'value' })` for `{{name}}` placeholders

**Adding translations:**
- Add keys to `i18n/it.json` and `i18n/en.json`
- Server components: `const t = await getTranslations(lang as SupportedLocale)`
- Client components: `const t = useTranslation()`

### Component Organization

- `components/ui/` - shadcn/ui base components (Button, Input, etc.)
- `components/form/` - Form field wrappers using react-hook-form
- `components/navbar/`, `components/search/`, `components/footer/` - Layout components
- `components/experience/`, `components/stay/`, `components/location/`, `components/category/`, `components/shop/` - Domain-specific components

### shadcn/ui

- Style: `new-york`
- Add components: `npx shadcn@latest add [component-name]`
- Utils alias: `@/lib/utils/shadcn.utils`
- Direct `@radix-ui/*` imports are restricted (ESLint error) - use shadcn components instead

### State Management

- Zustand for global state
- react-hook-form + zod for forms

## Code Style

- No semicolons, single quotes, 110 char print width
- Trailing commas (es5), 2-space indent
- `no-console` enforced (only `warn`/`error` allowed)
- Husky pre-commit runs Prettier + ESLint with zero warnings tolerance

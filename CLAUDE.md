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
- **NEVER use `??` fallback strings** (e.g., `t.key ?? 'Fallback'`). Always add the translation key to both `i18n/it.json` and `i18n/en.json` instead

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

### Zustand Store Conventions

- Stores live in `core/store/` with `*.store.ts` naming
- Use `persist` middleware with `partialize` for localStorage persistence; storage keys prefixed `ps-`
- Nest mutations in an `actions` object, export a `useXxxActions` selector hook alongside `default` store export
- Access state outside React with `useXxxStore.getState()`
- Never use raw `sessionStorage`/`localStorage` — always use a Zustand store with `persist`

## Code Style

- No semicolons, single quotes, 110 char print width
- Trailing commas (es5), 2-space indent
- `no-console` enforced (only `warn`/`error` allowed)
- Husky pre-commit runs Prettier + ESLint with zero warnings tolerance

### Icons

- All icons must be exported from a centralized `icons.ts` file
- Reuse icons across components as much as possible - never import icons directly from icon libraries inside components
- Import icons only from `icons.ts` (e.g., `import { SearchIcon, HeartIcon } from '@/lib/constants/icons'`)

## Agent Best Practices

These rules apply to any agent (Claude Code or others) working in `web/`. See also `web/AGENT.md`.

1. **Reuse first** — Before creating a new component, hook, or util, search `components/`, `lib/utils/`, `lib/hooks/`. Never duplicate existing code. If something is missing, add it in the right shared location and reuse it.
2. **Forms** — Always use `react-hook-form` with a colocated `<FormProvider>`, and the existing wrappers in `components/form/*-form-field.tsx` (`input`, `select`, `number`, `currency`, `phone`, `textarea`, `combobox`, `radio`, `checkbox`, `rich-text`, `time`, `file-uploader`, `address-autocomplete`). Never build a custom input when a `*-form-field.tsx` already covers it.
3. **Currency** — Always format monetary values with `formatCurrency` from `lib/utils/format.utils.ts`. Never concatenate `€` + number manually or call `Intl.NumberFormat` inline.
4. **Formatting in general** — Before writing any formatting logic (dates, numbers, strings, pluralization), check `lib/utils/`. If the util does not exist, create it there and reuse it — never inline ad-hoc formatters in components.
5. **Clean code** — Small focused functions, explicit names, early returns, no dead code, no obvious comments, no `any`. Respect the component member order documented below (props → state → derived → handlers → `useEffect` → return).
6. **Icons & libraries** — Icons only from `lib/constants/icons.ts`. Never import directly from `lucide-react` or `@radix-ui/*` in components.

### Component Structure

- `useEffect` hooks must always be placed **after** all variable declarations, state, and functions, immediately before the component's return/render statement
- Order within a component: props destructuring → state (`useState`, `useRef`, etc.) → derived variables → functions/handlers → `useEffect` hooks → `return`

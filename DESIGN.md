# DESIGN.md — Porta Sicilia (web)

> **MANDATORY REFERENCE FOR ALL AGENTS WORKING IN `web/`** (Claude Code, AGENT.md consumers, frontend sub-agents, and any other automated assistant).
>
> This file is the **single source of truth** for the strict design and engineering rules of the Porta Sicilia **frontend** (Next.js App Router). Every agent **MUST** read this file before:
> - writing or modifying any code in `web/`
> - creating components, hooks, utilities, pages, layouts, or stores
> - adding translation keys, icons, or shadcn/ui components
> - opening a PR or producing a code review for frontend changes
>
> Scope: **`web/` only.** Backend rules live in `be/CLAUDE.md` and root `CLAUDE.md` and are out of scope here.
>
> **Precedence order** when rules appear to conflict:
> 1. `web/DESIGN.md` (this file) — strictest, always wins
> 2. `web/CLAUDE.md`
> 3. `web/AGENT.md`
> 4. Root `CLAUDE.md` (only the frontend-relevant sections)
>
> If a rule here contradicts code you find in the repo, **the rule wins**: fix the code, do not copy the violation.

---

## 0. How agents must use this file

**Claude Code, sub-agents (frontend-architect, ux-ui-designer, Explore, etc.), and any AGENT.md-compliant assistant:**

1. **Read this file at the start of every session** that touches `web/`. Do not rely on cached summaries — re-read it when the conversation crosses a major task boundary.
2. **Cite the rule** you are applying when making a non-obvious choice (e.g. "per `web/DESIGN.md` §3.3, using `useAction` instead of manual `useState`"). One short reference is enough; do not lecture.
3. **Refuse to implement** any request that would break a rule below. Surface the conflict to the user, propose the compliant alternative, and wait for explicit confirmation before deviating. Do not silently "fix" or rewrite — ask.
4. **When delegating to a sub-agent** (frontend-architect, ux-ui-designer, Explore), include `Read web/DESIGN.md before doing anything else` in the prompt. Do not assume the sub-agent inherits this context.
5. **Before committing or opening a PR**, verify the diff against this file. Treat any violation as a blocker.
6. **Never invent rules** that are not in this file or in `web/CLAUDE.md` / `web/AGENT.md`. If you think a rule is missing, propose it to the user — do not enforce it unilaterally.

---

## 1. Stack & runtime

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript, no semicolons, single quotes, 110-char print width, 2-space indent, trailing commas (es5)
- **UI**: shadcn/ui (style `new-york`) on top of Radix primitives
- **State**: Zustand (global) + react-hook-form + Zod (forms)
- **i18n**: custom JSON-based system (`it` default, `en`)
- **Dev port**: **3003**
- **Lint**: ESLint with **zero-warning tolerance** (Husky pre-commit). Never bypass with `--no-verify`.

---

## 2. Routing & internationalisation

### 2.1 App Router structure

- All pages live under `app/[lang]/...`. The `[lang]` dynamic segment is mandatory.
- Locales: `it` (default), `en`. Defined in `lib/configs/locales/index.ts`.
- URL shape: `/{lang}/...` (e.g. `/it/`, `/en/`).
- Route groups: `(public)`, `(dashboard)`, `(listings)`, `(checkout)`.

### 2.2 Translation system (strict)

- JSON files: `i18n/it.json` and `i18n/en.json`. Both files **must** stay in sync — every key exists in both.
- Server components: `const t = await getTranslations(lang as SupportedLocale)` (from `lib/configs/locales/i18n.ts`).
- Client components: `const t = useTranslation()` (from `lib/context/translation.context.tsx`).
- Variable interpolation: `interpolate(t.key, { name: 'value' })` for `{{name}}` placeholders.
- **NEVER use `??` fallback strings.** `t.key ?? 'Fallback'` is forbidden. Add the key to **both** locale files instead.
- Never hardcode user-facing strings in components. Every visible label, placeholder, error message, alt text, or aria-label must come from the i18n layer.

---

## 3. Forms — non-negotiable

### 3.1 react-hook-form + colocated FormProvider

- Every form **must** use `react-hook-form` with a `<FormProvider>` **colocated** with the `useForm()` call in the same component.
- Child fields read the form via `useFormContext()`. **Never** pass the form object as a prop.
- Validation: **Zod** schemas via `zodResolver`. No ad-hoc string checks, no inline regex validation in handlers.

### 3.2 Always use existing form-field wrappers

Use the wrappers in `components/form/`:

- `input-form-field.tsx`
- `textarea-form-field.tsx`
- `select-form-field.tsx`
- `combobox-form-field.tsx`
- `number-form-field.tsx`
- `currency-form-field.tsx`
- `phone-form-field.tsx`
- `radio-form-field.tsx`
- `checkbox-form-field.tsx`
- `rich-text-form-field.tsx`
- `time-form-field.tsx`
- `file-uploader-form-field.tsx`
- `address-autocomplete-form-field.tsx`

If a wrapper covers the use case, **do not** build a custom input. If a new field type is genuinely needed, add it to `components/form/` with the same naming and API and reuse it across the codebase.

### 3.3 Async submission — `useAction`

- **Never** manage loading state with manual `useState(false)`.
- Always use `useAction` from `lib/hooks/use-action.ts`. It handles loading, error capture, and toast notifications.
- The wrapped async call must return `{ success: true, data }`. Use `onSuccess` / `onError` callbacks for state updates, navigation, and query invalidation.

---

## 4. API layer

- All HTTP traffic goes through `lib/api/fetch-client.ts`:
  - `api` — **client-side**, proxied through `/api`. No CORS issues.
  - `apiServer` — **server-side**, hits `BACKEND_URL` directly.
- Both unwrap the backend's `{ errors, data }` envelope automatically and throw `ApiError` on failure.
- **Never** call `fetch` directly to the backend from a component, page, or server action. Always go through `api` / `apiServer`.
- Domain endpoints live in `lib/api/*.ts` (e.g. `experiences.ts`, `bookings.ts`, `products.ts`). Add new endpoints in the appropriate file — do not inline them in components.

---

## 5. State management

### 5.1 Zustand store conventions

- Stores live in `core/store/` with `*.store.ts` naming.
- Use `persist` middleware with `partialize` for localStorage persistence; storage keys prefixed `ps-`.
- Mutations nested in an `actions` object. Export a `useXxxActions` selector hook alongside the default store export.
- Access state outside React with `useXxxStore.getState()`.

### 5.2 Storage rules

- **Never** use raw `sessionStorage` / `localStorage` directly. Always go through a Zustand store with `persist`.
- **Never** read or write cookies from a component — use the existing helpers or server actions.

---

## 6. Currency, dates, and formatting

### 6.1 Currency

- Render every monetary value through `formatCurrency` from `lib/utils/format.utils.ts`.
- **Never** concatenate `€ + number`. **Never** call `Intl.NumberFormat` inline.
- For currency inputs, use `currency-form-field.tsx`.

### 6.2 Any other formatting (dates, numbers, strings, pluralization, durations…)

Before writing formatting logic:

1. Check `lib/utils/` (`date.utils.ts`, `format.utils.ts`, `i18n.utils.ts`, `checkout.utils.ts`, `youtube.utils.ts`, `form-data.utils.ts`).
2. If a helper is missing, add it to the appropriate file in `lib/utils/` and reuse from there.
3. **Never** inline ad-hoc formatters inside components.

---

## 7. Icons & external libraries

- Icons **only** from `lib/constants/icons.ts`. **Never** import from `lucide-react` (or any icon library) directly in a component.
- If an icon is missing, add it to `icons.ts` first, then import it from there.
- Direct `@radix-ui/*` imports are an **ESLint error**. Use the shadcn/ui components in `components/ui/` instead.
- Add new shadcn components with `npx shadcn@latest add [component-name]` (style: `new-york`). Utils alias: `@/lib/utils/shadcn.utils`.

---

## 8. Components — organisation & structure

### 8.1 Folder layout

- `components/ui/` — shadcn/ui base (Button, Input, Dialog, etc.)
- `components/form/` — form field wrappers (see §3.2)
- `components/navbar/`, `components/search/`, `components/footer/` — layout
- `components/experience/`, `components/stay/`, `components/location/`, `components/category/`, `components/shop/`, `components/dashboard/` — domain-specific

### 8.2 Reuse first — no duplication

Before adding any new component, hook, or util:

1. Search `components/` for an existing component (UI, form field, domain).
2. Search `lib/utils/` for an existing helper.
3. Search `lib/hooks/` for an existing hook.

If something genuinely doesn't exist, create it in the correct shared location so it can be reused. **Never inline.**

### 8.3 Component member order (enforced)

Inside every React component, declare in this exact order:

1. props destructuring
2. state (`useState`, `useRef`, etc.)
3. derived variables
4. functions / handlers
5. `useEffect` hooks — **immediately before** the return
6. `return`

`useEffect` hooks **must** be placed after all variable declarations and handlers, never interleaved.

### 8.4 Server vs client components

- Default to **server components**. Add `'use client'` only when you need state, effects, browser APIs, or event handlers.
- Fetch data on the server with `apiServer` whenever possible. Pass plain serialisable data to client components.
- Do not import server-only modules (e.g. `apiServer`) from client components.

---

## 9. Code style

- **No semicolons**, single quotes, 110-char print width, 2-space indent, trailing commas (es5).
- `no-console` enforced — only `console.warn` / `console.error` allowed.
- **No `any`.** Prefer precise types or `unknown` + narrowing.
- Small, focused functions. Explicit names. Early returns over nested `if`s.
- No dead code. No commented-out code. No obvious comments.
- Default to **no comments**. Only add a comment when the *why* is non-obvious (hidden constraint, subtle invariant, workaround). Never explain *what* the code does — names should already do that.
- Never reference the current task or PR in code comments.

---

## 10. Scope discipline

- A bug fix does not need surrounding cleanup. A one-shot operation does not need a helper. Three similar lines is better than a premature abstraction.
- Do not add error handling, fallbacks, or validation for scenarios that can't happen. Trust framework guarantees. Validate only at boundaries (user input, external APIs).
- No backwards-compatibility shims, feature flags, or `// removed` comments unless the user explicitly asks.
- **Do not create** Markdown docs (`README.md`, `NOTES.md`, etc.) unless the user explicitly asks.

---

## 11. Testing UI changes

- For any UI change, run `npm run dev` (port 3003) and exercise the feature in a browser before reporting completion.
- Type-check + lint verify code correctness, **not** feature correctness. If you cannot test the UI yourself, say so explicitly — do **not** claim success.
- Test the golden path **and** edge cases. Watch for regressions in adjacent flows.

---

## 12. Risky / destructive operations

Before any of the following, **ask the user for explicit confirmation in the conversation**:

- `git reset --hard`, `git push --force`, `git checkout .`, `git clean -f`, branch deletion
- Removing or downgrading dependencies
- Modifying `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, or other root config files
- Editing settings outside the project (global git config, system files)

User approval for one destructive action does **not** authorise the next one.

---

## 13. Environment

`.env.local`:

- `API_URL` — backend URL (default `http://localhost:7002`)

Never commit `.env*` files. Never log environment variables.

---

## 14. Commands

```bash
npm run dev               # dev server on port 3003
npm run build             # lint + production build
npm run lint              # ESLint
npm run format            # Prettier
npx shadcn@latest add [component]
```

Husky pre-commit runs Prettier + ESLint with **zero-warning tolerance**. Fix issues — do not bypass.

---

## 15. Quick checklist (run before every commit / PR)

- [ ] All new translation keys added to **both** `i18n/it.json` and `i18n/en.json`. No `??` fallback strings. No hardcoded user-facing text.
- [ ] Forms use `react-hook-form` + colocated `<FormProvider>` + existing `*-form-field` wrappers. Validation via Zod.
- [ ] Async calls go through `useAction`. No manual loading `useState`.
- [ ] All currency rendered via `formatCurrency`. No inline `Intl.NumberFormat`.
- [ ] All formatting goes through `lib/utils/`. No inline ad-hoc formatters.
- [ ] All icons imported from `lib/constants/icons.ts`. No direct `lucide-react` imports.
- [ ] No direct `@radix-ui/*` imports. No raw `sessionStorage` / `localStorage`.
- [ ] No `any`. No `console.log`. No commented-out code. No obvious comments.
- [ ] Component member order respected (props → state → derived → handlers → `useEffect` → return).
- [ ] HTTP traffic via `api` / `apiServer`, never raw `fetch` to the backend.
- [ ] Zustand stores in `core/store/` with `ps-` prefixed persist keys and `actions` object.
- [ ] No new Markdown docs unless explicitly requested.
- [ ] Pre-commit hooks (Prettier + ESLint, zero warnings) passed without `--no-verify`.
- [ ] Feature manually tested in the browser on port 3003 (golden path + edge cases).

---

**End of `web/DESIGN.md`.** Any agent reading this file is now bound by these rules for the remainder of the session in `web/`.

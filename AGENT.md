# AGENT.md

Best practice rules for any agent working inside `web/`. These rules are mandatory and mirror the `## Agent Best Practices` section of `CLAUDE.md`. Read this file before writing or modifying frontend code.

## 1. Reuse before creating

Before adding any new component, hook, or utility:

- Search `components/` for an existing component (UI, form field, domain).
- Search `lib/utils/` for an existing helper.
- Search `lib/hooks/` for an existing hook.

Never duplicate existing code. If something genuinely doesn't exist, create it in the correct shared location so it can be reused — not inline in a single component.

## 2. Forms — always react-hook-form + form-field wrappers

- Every form must use `react-hook-form` with a `<FormProvider>` colocated with its `useForm()` call.
- Child fields access the form via `useFormContext()`, never via props.
- Always use the existing wrappers in `components/form/`:
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

If a `*-form-field.tsx` already covers the use case, do NOT build a custom input. If a new field type is truly needed, add it to `components/form/` with the same naming and API.

## 3. Currency — always `formatCurrency`

All monetary values must be rendered through `formatCurrency` from `lib/utils/format.utils.ts`. Never concatenate `€` + number manually, never call `Intl.NumberFormat` inline. For currency inputs, use `currency-form-field.tsx`.

## 4. Formatting in general

Before writing any formatting logic (dates, numbers, strings, pluralization, durations, etc.):

1. Check `lib/utils/` for an existing helper.
2. If missing, add it to the appropriate file in `lib/utils/` and import it.
3. Never inline ad-hoc formatters inside components.

## 5. Async state — `useAction`

Never manage loading state with manual `useState(false)`. Always use `useAction` from `lib/hooks/use-action.ts`, which handles loading, errors, and toasts.

## 6. Icons and external libraries

- Icons only from `lib/constants/icons.ts`. Never import from `lucide-react` (or any icon library) directly in a component.
- Direct imports from `@radix-ui/*` are forbidden — use the shadcn/ui components in `components/ui/`.

## 7. Clean code

- Small, focused functions with explicit names.
- Early returns over nested `if`s.
- No dead code, no commented-out code, no obvious comments.
- No `any`. Prefer precise types or `unknown` + narrowing.
- Component member order: props destructuring → state (`useState`, `useRef`) → derived variables → functions/handlers → `useEffect` (immediately before return) → `return`.
- No semicolons, single quotes, 110 char print width, trailing commas (es5), 2-space indent.
- `no-console` enforced — only `warn`/`error` allowed.

## Key paths

- `components/form/*-form-field.tsx` — form field wrappers
- `components/ui/` — shadcn/ui base components
- `lib/utils/format.utils.ts` — `formatCurrency` and other formatters
- `lib/hooks/use-action.ts` — async state hook
- `lib/constants/icons.ts` — centralized icon exports

#!/usr/bin/env node
/**
 * Bootstraps i18n JSON files for additional locales by translating
 * `web/i18n/it.json` via Google Cloud Translate v2.
 *
 * Usage:
 *   GOOGLE_TRANSLATE_API_KEY=xxxx node scripts/translate-i18n.mjs [--force] [--locales=es,fr,de]
 *
 * Behavior:
 *  - Reads source from i18n/it.json
 *  - For each target locale, writes/updates i18n/<locale>.json
 *  - By default keeps existing keys already present in the target file (skips re-translation)
 *  - With --force re-translates everything
 *  - Preserves `{{placeholder}}` tokens by stripping them out before translation and re-injecting them after
 */

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const I18N_DIR = path.join(ROOT, 'i18n')
const SOURCE_FILE = path.join(I18N_DIR, 'it.json')

const args = process.argv.slice(2)
const force = args.includes('--force')
const localesArg = args.find(a => a.startsWith('--locales='))
const targetLocales = localesArg
  ? localesArg.split('=')[1].split(',').map(s => s.trim()).filter(Boolean)
  : ['en', 'es', 'fr', 'de']

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
if (!apiKey) {
  console.error('GOOGLE_TRANSLATE_API_KEY env var is required')
  process.exit(1)
}

const PLACEHOLDER_RE = /\{\{(\w+)\}\}/g

const stripPlaceholders = text => {
  const tokens = []
  const masked = text.replace(PLACEHOLDER_RE, (_, name) => {
    const idx = tokens.length
    tokens.push(name)
    return `__PH${idx}__`
  })
  return { masked, tokens }
}

const restorePlaceholders = (text, tokens) =>
  text.replace(/__PH(\d+)__/g, (_, idx) => `{{${tokens[Number(idx)]}}}`)

const chunk = (arr, size) => {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

const translateBatch = async (texts, target) => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: texts, source: 'it', target, format: 'text' }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Google Translate failed (${res.status}): ${body}`)
  }
  const data = await res.json()
  return data.data.translations.map(t => t.translatedText)
}

const translateForLocale = async (source, locale, existing) => {
  const keys = Object.keys(source)
  const keysToTranslate = force
    ? keys
    : keys.filter(k => existing[k] === undefined || existing[k] === source[k])

  console.log(`[${locale}] ${keysToTranslate.length}/${keys.length} keys to translate`)

  const tokensByKey = new Map()
  const maskedTexts = keysToTranslate.map(k => {
    const { masked, tokens } = stripPlaceholders(source[k])
    tokensByKey.set(k, tokens)
    return masked
  })

  const translated = {}
  const batches = chunk(
    keysToTranslate.map((k, i) => ({ key: k, text: maskedTexts[i] })),
    100,
  )

  let i = 0
  for (const batch of batches) {
    i++
    const out = await translateBatch(batch.map(b => b.text), locale)
    batch.forEach((b, j) => {
      const restored = restorePlaceholders(out[j], tokensByKey.get(b.key))
      translated[b.key] = restored
    })
    console.log(`[${locale}]   batch ${i}/${batches.length} done`)
  }

  return { ...existing, ...translated }
}

const main = async () => {
  const source = JSON.parse(await readFile(SOURCE_FILE, 'utf-8'))

  for (const locale of targetLocales) {
    const target = path.join(I18N_DIR, `${locale}.json`)
    const existing = existsSync(target)
      ? JSON.parse(await readFile(target, 'utf-8'))
      : {}

    const merged = await translateForLocale(source, locale, existing)

    // Preserve key order from source
    const ordered = {}
    for (const k of Object.keys(source)) {
      ordered[k] = merged[k] ?? source[k]
    }

    await writeFile(target, JSON.stringify(ordered, null, 2) + '\n', 'utf-8')
    console.log(`[${locale}] wrote ${target}`)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

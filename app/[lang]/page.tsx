import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import ClientButton from './components/client-button'
import { SupportedLocale } from '@/lib/configs/locales'

export default async function Home({ params }: PageParamsProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <main className="flex min-h-screen items-center justify-center py-32 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-8 max-w-2xl px-6 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
            {t.welcome_title}
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t.welcome_description}
          </p>
        </div>

        <div className="pt-4">
          <ClientButton />
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              {t.welcome_features_title}
            </h2>
            <ul className="flex flex-col gap-2 text-left text-zinc-700 dark:text-zinc-300">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Next.js 16 with App Router</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>TypeScript for type safety</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Internationalization (i18n)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Tailwind CSS v4</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>ESLint, Prettier & Husky configured</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 items-center">
            <p className="text-zinc-600 dark:text-zinc-400">{t.github_star_text}</p>
            <iframe
              src="https://ghbtns.com/github-btn.html?user=luca1098&repo=nextjs-starter-template&type=star&count=true&size=large"
              width="170"
              height="30"
              title="GitHub"
            ></iframe>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-semibold text-black dark:text-zinc-50">{t.contribute_title}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">{t.contribute_text}</p>
          </div>
        </div>
      </div>
    </main>
  )
}

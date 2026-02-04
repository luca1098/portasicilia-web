import { SupportedLocale } from '@/lib/configs/locales'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type LocaleStore = {
  lang: SupportedLocale
  actions: {
    setLocale(lang: SupportedLocale): void
  }
}

const useLocaleStore = create<LocaleStore>()(
  persist(
    set => ({
      lang: 'it',
      actions: {
        setLocale: (lang: SupportedLocale) => set(() => ({ lang })),
      },
    }),
    {
      name: 'ps-locale',
      partialize: state => ({ lang: state.lang }),
    }
  )
)

export const useLocaleActions = () => useLocaleStore(state => state.actions)
export default useLocaleStore

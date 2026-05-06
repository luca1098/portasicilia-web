import Link from 'next/link'
import { MapPin, Compass } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6">
        <Compass className="size-20 text-muted-foreground/30" strokeWidth={1} />
        <MapPin className="absolute -right-2 -top-1 size-8 text-primary animate-bounce" />
      </div>

      <p className="mb-2 text-sm font-medium tracking-widest text-muted-foreground uppercase">404</p>
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">Questa strada non porta in Sicilia</h1>
      <p className="mb-2 max-w-md text-muted-foreground">
        Forse hai preso una scorciatoia sbagliata tra i vicoli. Succede anche ai siciliani.
      </p>
      <p className="mb-8 max-w-md text-sm text-muted-foreground/80">
        Nel frattempo, torna alla home e lasciati guidare dal profumo degli arancini.
      </p>

      <Button asChild>
        <Link href="/">Torna alla Home</Link>
      </Button>
    </main>
  )
}

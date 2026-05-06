import Link from 'next/link'
import Image from 'next/image'
import './globals.css'

export default function NotFound() {
  return (
    <html lang="it">
      <body className="antialiased flex min-h-screen flex-col bg-background text-foreground">
        <header className="border-b border-border bg-background">
          <div className="mx-auto flex max-w-7xl items-center px-4 py-2 md:px-6">
            <Link href="/it/" className="shrink-0 transition-opacity duration-200 hover:opacity-80">
              <Image src="/logo.png" alt="Porta Sicilia" width={50} height={50} priority />
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <p className="mb-2 text-sm font-medium tracking-widest text-muted-foreground uppercase">404</p>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Questa strada non porta in Sicilia</h1>
          <p className="mb-2 max-w-md text-muted-foreground">
            Forse hai preso una scorciatoia sbagliata tra i vicoli. Succede anche ai siciliani.
          </p>
          <p className="mb-8 max-w-md text-sm text-muted-foreground/80">
            Nel frattempo, torna alla home e lasciati guidare dal profumo degli arancini.
          </p>
          <Link
            href="/it"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all"
          >
            Torna alla Home
          </Link>
        </main>

        <footer className="border-t border-border bg-muted/30 py-6 text-center text-sm text-muted-foreground">
          Porta Sicilia
        </footer>
      </body>
    </html>
  )
}

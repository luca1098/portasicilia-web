import Image from 'next/image'

type ArticleAuthorInfoProps = {
  name: string
  bio?: string | null
  avatar?: string | null
}

export default function ArticleAuthorInfo({ name, bio, avatar }: ArticleAuthorInfoProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-5">
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full object-cover"
          unoptimized
        />
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <p className="font-semibold">{name}</p>
        {bio && <p className="mt-1 text-sm text-muted-foreground">{bio}</p>}
      </div>
    </div>
  )
}

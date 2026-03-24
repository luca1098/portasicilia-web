type ArticleContentProps = {
  content: string
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-a:text-primary prose-img:rounded-xl prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:italic prose-blockquote:text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

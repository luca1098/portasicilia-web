'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapLink from '@tiptap/extension-link'
import TiptapImage from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { useCallback, type MouseEvent } from 'react'
import { cn } from '@/lib/utils/shadcn.utils'

type RichTextEditorProps = {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

function ensureAbsoluteUrl(url: string): string {
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (/^mailto:/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TiptapLink.configure({
        openOnClick: false,
        autolink: false,
        defaultProtocol: 'https',
        HTMLAttributes: { class: 'text-primary underline', target: '_blank', rel: 'noopener noreferrer' },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full' },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? '',
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 ' +
          '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 ' +
          '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 ' +
          '[&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground',
      },
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL (es. https://example.com)', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    const absoluteUrl = ensureAbsoluteUrl(url)
    editor.chain().focus().extendMarkRange('link').setLink({ href: absoluteUrl }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const tb = (e: MouseEvent, command: () => void) => {
    e.preventDefault()
    command()
  }

  return (
    <div className={cn('rounded-lg border border-input bg-background', className)}>
      <div className="flex flex-wrap gap-0.5 border-b border-input px-2 py-1.5">
        <ToolbarButton
          active={editor.isActive('bold')}
          onMouseDown={e => tb(e, () => editor.chain().focus().toggleBold().run())}
          label="B"
          title="Bold"
          className="font-bold"
        />
        <ToolbarButton
          active={editor.isActive('italic')}
          onMouseDown={e => tb(e, () => editor.chain().focus().toggleItalic().run())}
          label="I"
          title="Italic"
          className="italic"
        />
        <ToolbarButton
          active={editor.isActive('underline')}
          onMouseDown={e => tb(e, () => editor.chain().focus().toggleUnderline().run())}
          label="U"
          title="Underline"
          className="underline"
        />

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onMouseDown={e => tb(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          label="H2"
          title="Heading 2"
        />
        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          onMouseDown={e => tb(e, () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
          label="H3"
          title="Heading 3"
        />

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton
          active={editor.isActive('bulletList')}
          onMouseDown={e => tb(e, () => editor.chain().focus().toggleBulletList().run())}
          label="&bull;"
          title="Bullet List"
        />
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onMouseDown={e => tb(e, () => editor.chain().focus().toggleOrderedList().run())}
          label="1."
          title="Ordered List"
        />
        <ToolbarButton
          active={editor.isActive('blockquote')}
          onMouseDown={e => tb(e, () => editor.chain().focus().toggleBlockquote().run())}
          label="&ldquo;"
          title="Blockquote"
        />

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton
          active={editor.isActive('link')}
          onMouseDown={e => {
            e.preventDefault()
            setLink()
          }}
          label="Link"
          title="Link"
        />
        <ToolbarButton
          active={false}
          onMouseDown={e => {
            e.preventDefault()
            addImage()
          }}
          label="Img"
          title="Image"
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

type ToolbarButtonProps = {
  active: boolean
  onMouseDown: (e: MouseEvent<HTMLButtonElement>) => void
  label: string
  title: string
  className?: string
}

function ToolbarButton({ active, onMouseDown, label, title, className }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={onMouseDown}
      className={cn(
        'flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        active && 'bg-accent text-accent-foreground',
        className
      )}
    >
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </button>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { PlusIcon, PencilIcon, Trash2Icon, ImageIcon } from '@/lib/constants/icons'
import type { Tip } from '@/lib/schemas/entities/tips.entity.schema'
import TipFormDialog from './tip-form-dialog'
import TipDeleteDialog from './tip-delete-dialog'

type TipListProps = {
  localityId: string
  tips: Tip[]
}

export default function TipList({ localityId, tips }: TipListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editTip, setEditTip] = useState<Tip | null>(null)
  const [deleteTip, setDeleteTip] = useState<Tip | null>(null)
  const t = useTranslation()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.admin_tip_section_title}</h2>
          <p className="text-sm text-muted-foreground">{t.admin_tip_section_subtitle}</p>
        </div>
        <Button size="default" onClick={() => setFormOpen(true)}>
          <PlusIcon className="size-4" />
          {t.admin_tip_add}
        </Button>
      </div>

      {tips.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.admin_tip_no_results}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tips.map(tip => (
            <div key={tip.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              {tip.cover ? (
                <Image
                  src={tip.cover}
                  alt={tip.title}
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-lg object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ImageIcon className="size-5 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{tip.title}</p>
                <p className="truncate text-sm text-muted-foreground">{tip.description}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => setEditTip(tip)}>
                  <PencilIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTip(tip)}>
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TipFormDialog localityId={localityId} mode="create" open={formOpen} onOpenChange={setFormOpen} />

      {editTip && (
        <TipFormDialog
          localityId={localityId}
          mode="edit"
          tip={editTip}
          open={!!editTip}
          onOpenChange={open => !open && setEditTip(null)}
        />
      )}

      {deleteTip && (
        <TipDeleteDialog
          localityId={localityId}
          tipId={deleteTip.id}
          tipTitle={deleteTip.title}
          open={!!deleteTip}
          onOpenChange={open => !open && setDeleteTip(null)}
        />
      )}
    </div>
  )
}

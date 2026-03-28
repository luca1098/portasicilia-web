'use client'

import { useRouter } from 'next/navigation'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { InputFormField } from '@/components/form/input-form-field'
import { ComboboxFormField } from '@/components/form/combobox-form-field'
import { useTranslation } from '@/lib/context/translation.context'
import {
  SocialVideoFormSchema,
  type SocialVideoFormValues,
} from '@/lib/schemas/forms/social-video.form.schema'
import {
  createSocialVideoAction,
  updateSocialVideoAction,
  searchListingsForVideoAction,
} from '@/lib/actions/social-videos.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon, XIcon, StarIcon } from '@/lib/constants/icons'
import type { SocialVideo, SocialVideoListing } from '@/lib/schemas/entities/social-video.entity.schema'

type SocialVideoFormDialogProps = {
  mode: 'create' | 'edit'
  video?: SocialVideo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SocialVideoFormDialog({
  mode,
  video,
  open,
  onOpenChange,
}: SocialVideoFormDialogProps) {
  const router = useRouter()
  const t = useTranslation()

  const form = useForm<SocialVideoFormValues>({
    resolver: zodResolver(SocialVideoFormSchema),
    defaultValues: {
      url: video?.url ?? '',
      title: video?.title ?? '',
      active: video?.active ?? true,
      featured: video?.featured ?? false,
      listingId: video?.listingId ?? null,
    },
  })

  const { loading, execute } = useAction<SocialVideo>({
    successMessage: mode === 'create' ? t.admin_social_videos_created : t.admin_social_videos_updated,
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
    },
  })

  const activeValue = useWatch({ control: form.control, name: 'active' })
  const listingIdValue = useWatch({ control: form.control, name: 'listingId' })

  const featuredValue = useWatch({ control: form.control, name: 'featured' })

  const onSubmit = async (data: SocialVideoFormValues) => {
    const payload: Record<string, unknown> = {
      url: data.url,
      active: data.active,
      featured: data.featured,
      listingId: data.listingId ?? null,
    }
    if (data.title) payload.title = data.title

    await execute(() =>
      mode === 'create' ? createSocialVideoAction(payload) : updateSocialVideoAction(video?.id ?? '', payload)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t.admin_social_videos_create : t.admin_social_videos_edit}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputFormField<SocialVideoFormValues>
              name="url"
              label={t.admin_social_videos_url_label}
              required
              placeholder="https://youtube.com/shorts/..."
            />

            <InputFormField<SocialVideoFormValues> name="title" label={t.admin_social_videos_title_label} />

            <ComboboxFormField<SocialVideoFormValues, SocialVideoListing>
              name="listingId"
              label={t.admin_social_videos_listing_label}
              onSearch={async query => {
                try {
                  const result = await searchListingsForVideoAction(query)
                  return result.success && result.data ? result.data : []
                } catch {
                  return []
                }
              }}
              defaultOption={video?.listing ?? undefined}
              getValue={o => o.id}
              getLabel={o => `${o.name} (${o.type === 'EXPERIENCE' ? 'Esperienza' : 'Alloggio'})`}
              getKey={o => o.id}
              placeholder={t.admin_social_videos_listing_placeholder}
              emptyMessage={t.admin_social_videos_listing_empty}
            />

            {listingIdValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => form.setValue('listingId', null)}
                className="-mt-2"
              >
                <XIcon className="size-3.5" />
                {t.admin_social_videos_listing_clear}
              </Button>
            )}

            <div className="flex items-center gap-3">
              <Switch
                id="active"
                checked={activeValue}
                onCheckedChange={val => form.setValue('active', val)}
              />
              <Label htmlFor="active">{t.admin_social_videos_active_label}</Label>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={featuredValue}
                  onCheckedChange={val => form.setValue('featured', val)}
                />
                <Label htmlFor="featured" className="flex items-center gap-1.5">
                  <StarIcon className="size-3.5 text-amber-500" />
                  {t.social_video_featured}
                </Label>
              </div>
              <p className="pl-[52px] text-xs text-muted-foreground">{t.social_video_featured_description}</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                {t.admin_common_cancel}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderIcon className="size-4 animate-spin" />}
                {loading ? t.admin_loc_saving : t.admin_loc_save}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

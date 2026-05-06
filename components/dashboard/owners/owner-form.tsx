'use client'

import { createContext, use, useState, type ReactNode } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon, Trash2Icon } from '@/lib/constants/icons'
import { OwnerFormSchema, type OwnerFormValues } from '@/lib/schemas/forms/owner.form.schema'
import { createAdminOwnerAction, updateAdminOwnerAction } from '@/lib/actions/owners.actions'
import type { AdminOwner } from '@/lib/schemas/entities/owner.entity.schema'
import OwnerDeleteDialog from './owner-delete-dialog'

type OwnerFormState = {
  loading: boolean
}

type OwnerFormActions = {
  submit: () => void
}

type OwnerFormMeta = {
  canChangeEmail: boolean
  owner?: AdminOwner
}

type OwnerFormContextValue = {
  state: OwnerFormState
  actions: OwnerFormActions
  meta: OwnerFormMeta
}

const OwnerFormContext = createContext<OwnerFormContextValue | null>(null)

function useOwnerForm() {
  const ctx = use(OwnerFormContext)
  if (!ctx) throw new Error('OwnerForm.* must be used within an OwnerForm provider')
  return ctx
}

const emptyValues: OwnerFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  businessName: '',
  vatNumber: '',
  notes: '',
}

function ownerToValues(owner: AdminOwner): OwnerFormValues {
  return {
    email: owner.email,
    firstName: owner.firstName,
    lastName: owner.lastName,
    phone: owner.phone ?? '',
    businessName: owner.businessName ?? '',
    vatNumber: owner.vatNumber ?? '',
    notes: owner.notes ?? '',
  }
}

function serializeBody(values: OwnerFormValues) {
  return {
    ...values,
    phone: values.phone || undefined,
    businessName: values.businessName || undefined,
    vatNumber: values.vatNumber || undefined,
    notes: values.notes || undefined,
  }
}

type ProviderProps = {
  defaultValues: OwnerFormValues
  loading: boolean
  meta: OwnerFormMeta
  onSubmit: (values: OwnerFormValues) => Promise<void> | void
  children: ReactNode
}

function Provider({ defaultValues, loading, meta, onSubmit, children }: ProviderProps) {
  const form = useForm<OwnerFormValues>({
    resolver: zodResolver(OwnerFormSchema),
    defaultValues,
  })

  const submit = form.handleSubmit(async values => {
    await onSubmit(values)
  })

  return (
    <OwnerFormContext value={{ state: { loading }, actions: { submit }, meta }}>
      <FormProvider {...form}>{children}</FormProvider>
    </OwnerFormContext>
  )
}

function CreateProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()

  const { loading, execute } = useAction<AdminOwner>({
    successMessage: t.admin_owners_create_success,
    onSuccess: data => {
      if (data?.id) {
        router.push(`/${lang}/dashboard/admin/owners/${data.id}`)
      } else {
        router.push(`/${lang}/dashboard/admin/owners`)
      }
    },
  })

  return (
    <Provider
      defaultValues={emptyValues}
      loading={loading}
      meta={{ canChangeEmail: true }}
      onSubmit={async values => {
        await execute(() => createAdminOwnerAction(serializeBody(values)))
      }}
    >
      {children}
    </Provider>
  )
}

function EditProvider({ owner, children }: { owner: AdminOwner; children: ReactNode }) {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()

  const { loading, execute } = useAction<AdminOwner>({
    successMessage: t.admin_owners_update_success,
    onSuccess: () => {
      router.push(`/${lang}/dashboard/admin/owners`)
    },
  })

  return (
    <Provider
      defaultValues={ownerToValues(owner)}
      loading={loading}
      meta={{ canChangeEmail: false, owner }}
      onSubmit={async values => {
        await execute(() => updateAdminOwnerAction(owner.id, serializeBody(values)))
      }}
    >
      {children}
    </Provider>
  )
}

function Form({ children }: { children: ReactNode }) {
  const {
    actions: { submit },
  } = useOwnerForm()
  return (
    <form onSubmit={submit} className="space-y-6">
      {children}
    </form>
  )
}

function PersonalSection() {
  const t = useTranslation()
  const { meta } = useOwnerForm()
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {t.admin_owners_section_personal}
      </h2>

      <InputFormField<OwnerFormValues>
        name="email"
        label={t.admin_owners_field_email}
        type="email"
        required
        disabled={!meta.canChangeEmail}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputFormField<OwnerFormValues> name="firstName" label={t.admin_owners_field_first_name} required />
        <InputFormField<OwnerFormValues> name="lastName" label={t.admin_owners_field_last_name} required />
      </div>

      <InputFormField<OwnerFormValues> name="phone" label={t.admin_owners_field_phone} type="tel" />
    </div>
  )
}

function BusinessSection() {
  const t = useTranslation()
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {t.admin_owners_section_business}
      </h2>

      <InputFormField<OwnerFormValues> name="businessName" label={t.admin_owners_field_business_name} />
      <InputFormField<OwnerFormValues> name="vatNumber" label={t.admin_owners_field_vat_number} />
    </div>
  )
}

function NotesSection() {
  const t = useTranslation()
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {t.admin_owners_section_notes}
      </h2>

      <TextareaFormField<OwnerFormValues>
        name="notes"
        label={t.admin_owners_field_notes}
        maxLength={2000}
        rows={4}
      />
    </div>
  )
}

function SubmitButton() {
  const t = useTranslation()
  const {
    state: { loading },
  } = useOwnerForm()
  return (
    <div className="flex justify-end">
      <Button type="submit" disabled={loading}>
        {loading && <LoaderIcon className="size-4 animate-spin" />}
        {loading ? t.admin_owners_saving : t.admin_owners_save}
      </Button>
    </div>
  )
}

function DangerZone() {
  const t = useTranslation()
  const { meta } = useOwnerForm()
  const owner = meta.owner
  const [open, setOpen] = useState(false)

  if (!owner) return null

  return (
    <>
      <div className="rounded-xl border border-destructive/30 bg-card p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-destructive uppercase tracking-wide">
            {t.admin_owners_danger_zone_title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.admin_owners_danger_zone_description}</p>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
          <Trash2Icon className="size-4" />
          {t.admin_owners_delete}
        </Button>
      </div>

      <OwnerDeleteDialog
        ownerId={owner.id}
        ownerName={`${owner.firstName} ${owner.lastName}`}
        ownerEmail={owner.email}
        open={open}
        onOpenChange={setOpen}
        redirectOnSuccess
      />
    </>
  )
}

export const OwnerForm = {
  CreateProvider,
  EditProvider,
  Form,
  PersonalSection,
  BusinessSection,
  NotesSection,
  SubmitButton,
  DangerZone,
}

export function CreateOwnerForm() {
  return (
    <OwnerForm.CreateProvider>
      <OwnerForm.Form>
        <OwnerForm.PersonalSection />
        <OwnerForm.BusinessSection />
        <OwnerForm.NotesSection />
        <OwnerForm.SubmitButton />
      </OwnerForm.Form>
    </OwnerForm.CreateProvider>
  )
}

export function EditOwnerForm({ owner }: { owner: AdminOwner }) {
  return (
    <OwnerForm.EditProvider owner={owner}>
      <OwnerForm.Form>
        <OwnerForm.PersonalSection />
        <OwnerForm.BusinessSection />
        <OwnerForm.NotesSection />
        <OwnerForm.SubmitButton />
      </OwnerForm.Form>
      <OwnerForm.DangerZone />
    </OwnerForm.EditProvider>
  )
}

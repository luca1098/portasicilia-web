'use client'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckboxFormField, InputFormField, SelectFormField } from '@/components/form'
import { Button } from '@/components/ui/button'
import { PasswordFormField } from '@/components/form/password-form-field'

const FormSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  select: z.string().min(1),
  check: z.boolean(),
})

type FormProps = z.infer<typeof FormSchema>

const TestForm = () => {
  const methods = useForm<FormProps>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit: SubmitHandler<FormProps> = value => {
    // eslint-disable-next-line no-console
    console.log({ value })
  }

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-4 w-[400px]" onSubmit={methods.handleSubmit(onSubmit)}>
        <InputFormField name="name" placeholder="name" label="Nome" />
        <InputFormField name="email" placeholder="Email" label="Email" />
        <PasswordFormField name="password" placeholder="password" label="password" required />
        <SelectFormField
          getLabel={item => item.pippo}
          getValue={i => i.value}
          options={[{ pippo: 'test', value: 'test' }]}
          label="Seleziona"
          name={'select'}
        />
        <CheckboxFormField name="check" label="Checkbox" />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  )
}

export default TestForm

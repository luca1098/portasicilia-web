import { Controller, ControllerProps, useFormContext } from 'react-hook-form'

export type FormFieldProps = {
  name: string
  renderField: ControllerProps['render']
  controllerProps?: Omit<ControllerProps, 'render' | 'name'>
}

const FormField = ({ name, renderField, controllerProps }: FormFieldProps) => {
  const { control, formState } = useFormContext()
  const defaultValue = (formState?.defaultValues || {})[name]
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => {
        return renderField({
          field,
          fieldState,
          formState,
        })
      }}
      {...controllerProps}
      defaultValue={defaultValue}
    />
  )
}

export { FormField }

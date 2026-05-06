import { z, ZodType } from 'zod'

const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
})

export const apiResponseSchema = <T extends ZodType>(dataSchema: T) =>
  z.object({
    errors: z.array(ApiErrorSchema),
    data: dataSchema,
  })

export type ApiError = z.infer<typeof ApiErrorSchema>
export type ApiResponse<T> = { errors: ApiError[]; data: T }

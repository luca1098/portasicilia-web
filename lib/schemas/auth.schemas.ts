import { z } from 'zod'
import { UserRoleSchemas } from './entities/user.entity.schema'

export const UserLanguageSchemas = z.enum(['IT', 'EN', 'ES', 'FR', 'DE'])
export type UserLanguage = z.infer<typeof UserLanguageSchemas>

const _AuthResponseSchemas = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    role: UserRoleSchemas,
    avatar: z.string().nullable(),
    lang: UserLanguageSchemas.optional(),
  }),
})

export type AuthResponse = z.infer<typeof _AuthResponseSchemas>

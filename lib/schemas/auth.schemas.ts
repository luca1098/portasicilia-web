import { z } from 'zod'
import { UserRoleSchemas } from './entities/user.entity.schema'

const _AuthResponseSchemas = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    role: UserRoleSchemas,
    avatar: z.string().nullable(),
  }),
})

export type AuthResponse = z.infer<typeof _AuthResponseSchemas>

import { z } from 'zod'

export const UserEntitySchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string(),
})

export const UserRoleSchemas = z.union([z.literal('ADMIN'), z.literal('USER'), z.literal('OWNER')])

export type UserRole = z.infer<typeof UserRoleSchemas>

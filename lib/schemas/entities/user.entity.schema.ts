import { z } from 'zod'

export const UserRoleSchemas = z.union([z.literal('ADMIN'), z.literal('USER'), z.literal('OWNER')])

export type UserRole = z.infer<typeof UserRoleSchemas>

import { z } from 'zod'
import { UserEntitySchema } from './user.entity.schema'

export const OwnerSchema = UserEntitySchema.pick({
  lastName: true,
  firstName: true,
  id: true,
  email: true,
  avatar: true,
})

export type Owner = z.infer<typeof OwnerSchema>

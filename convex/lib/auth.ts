import { getAuthUserId } from '@convex-dev/auth/server'
import type { GenericMutationCtx, GenericQueryCtx } from 'convex/server'
import type { DataModel, Doc } from '../_generated/dataModel'

type Ctx = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>

export async function optionalUser(ctx: Ctx): Promise<Doc<'users'> | null> {
  const userId = await getAuthUserId(ctx)
  if (!userId) return null
  return await ctx.db.get(userId)
}

export async function requireUser(ctx: Ctx): Promise<Doc<'users'>> {
  const user = await optionalUser(ctx)
  if (!user) throw new Error('Authentication required')
  return user
}

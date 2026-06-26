import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { optionalUser, requireUser } from './lib/auth'

const profileReturn = v.union(
  v.object({
    user: v.object({
      _id: v.id('users'),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      image: v.optional(v.string()),
    }),
    profile: v.union(
      v.object({
        _id: v.id('userProfiles'),
        _creationTime: v.number(),
        userId: v.id('users'),
        displayName: v.optional(v.string()),
        bio: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
      }),
      v.null(),
    ),
  }),
  v.null(),
)

export const getMine = query({
  args: {},
  returns: profileReturn,
  handler: async (ctx) => {
    const user = await optionalUser(ctx)
    if (!user) return null

    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first()

    return { user, profile }
  },
})

export const update = mutation({
  args: {
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  returns: v.id('userProfiles'),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const now = Date.now()
    const existing = await ctx.db
      .query('userProfiles')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first()

    const displayName = args.displayName === undefined ? existing?.displayName : args.displayName.trim() || undefined
    const bio = args.bio === undefined ? existing?.bio : args.bio.trim() || undefined

    if (existing) {
      await ctx.db.patch(existing._id, {
        displayName,
        bio,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert('userProfiles', {
      userId: user._id,
      displayName,
      bio,
      createdAt: now,
      updatedAt: now,
    })
  },
})

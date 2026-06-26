import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

const contentChannel = v.union(
  v.literal('instagram'),
  v.literal('tiktok'),
  v.literal('blog'),
  v.literal('newsletter'),
  v.literal('general'),
)

const jobStatus = v.union(
  v.literal('draft'),
  v.literal('queued'),
  v.literal('processing'),
  v.literal('completed'),
  v.literal('failed'),
  v.literal('cancelled'),
)

export default defineSchema({
  ...authTables,

  userProfiles: defineTable({
    userId: v.id('users'),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),

  pets: defineTable({
    ownerUserId: v.id('users'),
    name: v.string(),
    species: v.optional(v.string()),
    breed: v.optional(v.string()),
    bio: v.optional(v.string()),
    traits: v.optional(v.array(v.string())),
    avatarAssetId: v.optional(v.id('_storage')),
    createdAt: v.number(),
    updatedAt: v.number(),
    archivedAt: v.optional(v.number()),
  })
    .index('by_owner', ['ownerUserId'])
    .index('by_owner_and_created', ['ownerUserId', 'createdAt']),

  contentIdeas: defineTable({
    ownerUserId: v.id('users'),
    petId: v.id('pets'),
    title: v.optional(v.string()),
    prompt: v.string(),
    channel: contentChannel,
    mood: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner', ['ownerUserId'])
    .index('by_pet', ['petId'])
    .index('by_owner_and_created', ['ownerUserId', 'createdAt']),

  generationJobs: defineTable({
    ownerUserId: v.id('users'),
    petId: v.id('pets'),
    contentIdeaId: v.optional(v.id('contentIdeas')),
    status: jobStatus,
    outputKind: v.union(v.literal('social_post'), v.literal('blog_post')),
    inputSnapshot: v.optional(v.any()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner', ['ownerUserId'])
    .index('by_pet', ['petId'])
    .index('by_status', ['status'])
    .index('by_owner_and_created', ['ownerUserId', 'createdAt']),
})

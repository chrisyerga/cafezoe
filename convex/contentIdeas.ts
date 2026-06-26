import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import { optionalUser, requireUser } from './lib/auth'

const contentChannel = v.union(
  v.literal('instagram'),
  v.literal('tiktok'),
  v.literal('blog'),
  v.literal('newsletter'),
  v.literal('general'),
)

const contentIdeaReturn = v.object({
  _id: v.id('contentIdeas'),
  _creationTime: v.number(),
  petId: v.id('pets'),
  title: v.optional(v.string()),
  prompt: v.string(),
  channel: contentChannel,
  mood: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})

function cleanOptionalText(value: string | undefined): string | undefined {
  if (value === undefined) return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

function contentIdeaView(idea: Doc<'contentIdeas'>) {
  return {
    _id: idea._id,
    _creationTime: idea._creationTime,
    petId: idea.petId,
    title: idea.title,
    prompt: idea.prompt,
    channel: idea.channel,
    mood: idea.mood,
    createdAt: idea.createdAt,
    updatedAt: idea.updatedAt,
  }
}

export const listForPet = query({
  args: {
    petId: v.id('pets'),
  },
  returns: v.array(contentIdeaReturn),
  handler: async (ctx, args) => {
    const user = await optionalUser(ctx)
    if (!user) return []

    const pet = await ctx.db.get(args.petId)
    if (!pet || pet.ownerUserId !== user._id || pet.archivedAt !== undefined) return []

    const ideas = await ctx.db
      .query('contentIdeas')
      .withIndex('by_pet', (q) => q.eq('petId', args.petId))
      .order('desc')
      .collect()

    return ideas.map(contentIdeaView)
  },
})

export const create = mutation({
  args: {
    petId: v.id('pets'),
    title: v.optional(v.string()),
    prompt: v.string(),
    channel: v.optional(contentChannel),
    mood: v.optional(v.string()),
  },
  returns: v.id('contentIdeas'),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const pet = await ctx.db.get(args.petId)
    if (!pet || pet.ownerUserId !== user._id || pet.archivedAt !== undefined) throw new Error('Pet not found')

    const prompt = args.prompt.trim()
    if (!prompt) throw new Error('Prompt is required')

    const now = Date.now()
    return await ctx.db.insert('contentIdeas', {
      ownerUserId: user._id,
      petId: args.petId,
      title: cleanOptionalText(args.title),
      prompt,
      channel: args.channel ?? 'general',
      mood: cleanOptionalText(args.mood),
      createdAt: now,
      updatedAt: now,
    })
  },
})

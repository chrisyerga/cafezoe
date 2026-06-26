import { buildGenerationPlan } from '@lindale/generation-core'
import { buildPetBlogPostRequest, buildPetSocialPostRequest } from '@lindale/generation-cafezoe'
import { query } from './_generated/server'
import { v } from 'convex/values'
import { requireUser } from './lib/auth'

const contentChannel = v.union(
  v.literal('instagram'),
  v.literal('tiktok'),
  v.literal('blog'),
  v.literal('newsletter'),
  v.literal('general'),
)

export const previewForPet = query({
  args: {
    petId: v.id('pets'),
    prompt: v.string(),
    title: v.optional(v.string()),
    channel: v.optional(contentChannel),
    outputKind: v.optional(v.union(v.literal('social_post'), v.literal('blog_post'))),
  },
  returns: v.object({
    outputKind: v.union(v.literal('social_post'), v.literal('blog_post')),
    systemPrompt: v.string(),
    userPrompt: v.string(),
    imagePrompts: v.optional(v.array(v.string())),
  }),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const pet = await ctx.db.get(args.petId)
    if (!pet || pet.ownerUserId !== user._id || pet.archivedAt !== undefined) throw new Error('Pet not found')

    const prompt = args.prompt.trim()
    if (!prompt) throw new Error('Prompt is required')

    const idea = {
      petId: pet._id,
      title: args.title,
      prompt,
      channel: args.channel ?? 'general',
    }
    const outputKind = args.outputKind ?? (idea.channel === 'blog' ? 'blog_post' : 'social_post')
    const request =
      outputKind === 'blog_post'
        ? buildPetBlogPostRequest({ pet, idea })
        : buildPetSocialPostRequest({ pet, idea })
    const plan = buildGenerationPlan(request, {
      models: {
        text: {
          provider: 'openai',
          model: 'placeholder-text-model',
        },
      },
    })

    return {
      outputKind,
      systemPrompt: plan.prompts.system,
      userPrompt: plan.prompts.user,
      imagePrompts: plan.prompts.image,
    }
  },
})

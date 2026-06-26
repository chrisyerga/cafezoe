import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import { optionalUser, requireUser } from './lib/auth'

const petReturn = v.object({
  _id: v.id('pets'),
  _creationTime: v.number(),
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

function cleanOptionalText(value: string | undefined): string | undefined {
  if (value === undefined) return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

function activePetView(pet: Doc<'pets'>) {
  return {
    _id: pet._id,
    _creationTime: pet._creationTime,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    bio: pet.bio,
    traits: pet.traits,
    avatarAssetId: pet.avatarAssetId,
    createdAt: pet.createdAt,
    updatedAt: pet.updatedAt,
    archivedAt: pet.archivedAt,
  }
}

export const listMine = query({
  args: {},
  returns: v.array(petReturn),
  handler: async (ctx) => {
    const user = await optionalUser(ctx)
    if (!user) return []

    const pets = await ctx.db
      .query('pets')
      .withIndex('by_owner_and_created', (q) => q.eq('ownerUserId', user._id))
      .order('desc')
      .collect()

    return pets.filter((pet) => pet.archivedAt === undefined).map(activePetView)
  },
})

export const getMine = query({
  args: {
    petId: v.id('pets'),
  },
  returns: v.union(petReturn, v.null()),
  handler: async (ctx, args) => {
    const user = await optionalUser(ctx)
    if (!user) return null

    const pet = await ctx.db.get(args.petId)
    if (!pet || pet.ownerUserId !== user._id || pet.archivedAt !== undefined) return null
    return activePetView(pet)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    species: v.optional(v.string()),
    breed: v.optional(v.string()),
    bio: v.optional(v.string()),
    traits: v.optional(v.array(v.string())),
  },
  returns: v.id('pets'),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const name = args.name.trim()
    if (!name) throw new Error('Pet name is required')

    const now = Date.now()
    return await ctx.db.insert('pets', {
      ownerUserId: user._id,
      name,
      species: cleanOptionalText(args.species),
      breed: cleanOptionalText(args.breed),
      bio: cleanOptionalText(args.bio),
      traits: args.traits?.map((trait) => trait.trim()).filter(Boolean),
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    petId: v.id('pets'),
    name: v.optional(v.string()),
    species: v.optional(v.string()),
    breed: v.optional(v.string()),
    bio: v.optional(v.string()),
    traits: v.optional(v.array(v.string())),
  },
  returns: v.id('pets'),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const pet = await ctx.db.get(args.petId)
    if (!pet || pet.archivedAt !== undefined) throw new Error('Pet not found')
    if (pet.ownerUserId !== user._id) throw new Error('Not allowed')

    const patch: Partial<Doc<'pets'>> = {
      updatedAt: Date.now(),
    }

    if (args.name !== undefined) {
      const name = args.name.trim()
      if (!name) throw new Error('Pet name is required')
      patch.name = name
    }
    if (args.species !== undefined) patch.species = cleanOptionalText(args.species)
    if (args.breed !== undefined) patch.breed = cleanOptionalText(args.breed)
    if (args.bio !== undefined) patch.bio = cleanOptionalText(args.bio)
    if (args.traits !== undefined) patch.traits = args.traits.map((trait) => trait.trim()).filter(Boolean)

    await ctx.db.patch(args.petId, patch)
    return args.petId
  },
})

export const archive = mutation({
  args: {
    petId: v.id('pets'),
  },
  returns: v.id('pets'),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx)
    const pet = await ctx.db.get(args.petId)
    if (!pet || pet.archivedAt !== undefined) throw new Error('Pet not found')
    if (pet.ownerUserId !== user._id) throw new Error('Not allowed')

    await ctx.db.patch(args.petId, {
      archivedAt: Date.now(),
      updatedAt: Date.now(),
    })
    return args.petId
  },
})

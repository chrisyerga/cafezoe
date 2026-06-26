'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { splitTraits } from '@lindale/shared'
import { api } from '#convex/_generated/api'
import type { Id } from '#convex/_generated/dataModel'

export const Route = createFileRoute('/app/pets/$petId')({
  component: PetDetailPage,
})

function PetDetailPage() {
  const { petId } = Route.useParams()
  const typedPetId = petId as Id<'pets'>
  const pet = useQuery(api.pets.getMine, { petId: typedPetId })
  const updatePet = useMutation(api.pets.update)
  const archivePet = useMutation(api.pets.archive)
  const [prompt, setPrompt] = useState('Write a short Instagram caption about today’s tiny victory.')
  const [saved, setSaved] = useState(false)
  const preview = useQuery(
    api.generationPreviews.previewForPet,
    pet && prompt.trim()
      ? {
          petId: typedPetId,
          prompt,
          channel: 'instagram',
          outputKind: 'social_post',
        }
      : 'skip',
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await updatePet({
      petId: typedPetId,
      name: String(form.get('name') ?? ''),
      species: String(form.get('species') ?? ''),
      breed: String(form.get('breed') ?? ''),
      bio: String(form.get('bio') ?? ''),
      traits: splitTraits(String(form.get('traits') ?? '')),
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  if (pet === undefined) return <section className="content-panel">Loading pet...</section>
  if (pet === null) return <section className="content-panel">Pet not found.</section>

  return (
    <section className="pet-detail-grid">
      <div className="content-panel">
        <p className="eyebrow">Pet profile</p>
        <h1>{pet.name}</h1>
        <form className="stack-form" onSubmit={(event) => void handleSubmit(event)}>
          <label>
            Name
            <input name="name" defaultValue={pet.name} required />
          </label>
          <label>
            Species
            <input name="species" defaultValue={pet.species} />
          </label>
          <label>
            Breed
            <input name="breed" defaultValue={pet.breed} />
          </label>
          <label>
            Traits
            <input name="traits" defaultValue={pet.traits?.join(', ')} />
          </label>
          <label>
            Bio
            <textarea name="bio" rows={5} defaultValue={pet.bio} />
          </label>
          <div className="inline-actions">
            <button className="button primary" type="submit">
              Save changes
            </button>
            <button className="button ghost" type="button" onClick={() => void archivePet({ petId: typedPetId })}>
              Archive
            </button>
          </div>
          {saved ? <p className="success-note">Saved.</p> : null}
        </form>
      </div>
      <aside className="content-panel prompt-panel">
        <p className="eyebrow">Generation preview</p>
        <h2>Prompt shape</h2>
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={4} />
        <pre>{preview?.userPrompt ?? 'Add a prompt to preview the shared generation request.'}</pre>
      </aside>
    </section>
  )
}

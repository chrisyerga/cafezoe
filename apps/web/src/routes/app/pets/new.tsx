'use client'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { splitTraits } from '@lindale/shared'
import { api } from '#convex/_generated/api'

export const Route = createFileRoute('/app/pets/new')({
  component: NewPetPage,
})

function NewPetPage() {
  const createPet = useMutation(api.pets.create)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const form = new FormData(event.currentTarget)
    try {
      const petId = await createPet({
        name: String(form.get('name') ?? ''),
        species: String(form.get('species') ?? ''),
        breed: String(form.get('breed') ?? ''),
        bio: String(form.get('bio') ?? ''),
        traits: splitTraits(String(form.get('traits') ?? '')),
      })
      await navigate({ to: '/app/pets/$petId', params: { petId } })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create pet')
    }
  }

  return (
    <section className="content-panel narrow">
      <p className="eyebrow">New regular</p>
      <h1>Add a pet</h1>
      <form className="stack-form" onSubmit={(event) => void handleSubmit(event)}>
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Species
          <input name="species" placeholder="cat, dog, rabbit..." />
        </label>
        <label>
          Breed
          <input name="breed" />
        </label>
        <label>
          Traits
          <input name="traits" placeholder="dramatic, sunbeam expert, snack detective" />
        </label>
        <label>
          Bio
          <textarea name="bio" rows={5} placeholder="A few details CafeZoe should remember." />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="button primary" type="submit">
          Save pet
        </button>
      </form>
    </section>
  )
}

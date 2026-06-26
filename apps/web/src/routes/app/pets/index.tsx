'use client'

import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '#convex/_generated/api'

export const Route = createFileRoute('/app/pets/')({
  component: PetsPage,
})

function PetsPage() {
  const pets = useQuery(api.pets.listMine)

  return (
    <section className="content-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Roster</p>
          <h1>Your pets</h1>
        </div>
        <Link to="/app/pets/new" className="button primary">
          Add pet
        </Link>
      </div>
      {pets === undefined ? <p className="muted">Loading pets...</p> : null}
      {pets?.length === 0 ? (
        <div className="empty-card">
          <h2>No pets yet.</h2>
          <p>Add one pet to start shaping the CafeZoe content voice.</p>
        </div>
      ) : null}
      <div className="pet-grid">
        {pets?.map((pet) => (
          <Link key={pet._id} to="/app/pets/$petId" params={{ petId: pet._id }} className="pet-card">
            <span className="pet-avatar">{pet.name.slice(0, 1).toUpperCase()}</span>
            <h2>{pet.name}</h2>
            <p>{[pet.species, pet.breed].filter(Boolean).join(' · ') || 'Personality pending'}</p>
            <small>{pet.traits?.join(', ') || 'Add traits to sharpen the prompt.'}</small>
          </Link>
        ))}
      </div>
    </section>
  )
}

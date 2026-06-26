import { useMutation, useQuery } from 'convex/react'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { splitTraits } from '@lindale/shared'
import { api } from '../../src/convex'
import type { Id } from '../../src/convex'
import { colors, shadow } from '../../src/theme'

export default function PetDetailScreen() {
  const params = useLocalSearchParams<{ petId: string }>()
  const petId = params.petId as Id<'pets'>
  const pet = useQuery(api.pets.getMine, petId ? { petId } : 'skip')
  const updatePet = useMutation(api.pets.update)
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [traits, setTraits] = useState('')
  const [bio, setBio] = useState('')
  const [prompt, setPrompt] = useState('Write a cozy caption about today’s tiny victory.')
  const preview = useQuery(
    api.generationPreviews.previewForPet,
    pet && prompt.trim()
      ? {
          petId,
          prompt,
          channel: 'instagram',
          outputKind: 'social_post',
        }
      : 'skip',
  )

  useEffect(() => {
    if (!pet) return
    setName(pet.name)
    setSpecies(pet.species ?? '')
    setBreed(pet.breed ?? '')
    setTraits(pet.traits?.join(', ') ?? '')
    setBio(pet.bio ?? '')
  }, [pet])

  async function save() {
    await updatePet({
      petId,
      name,
      species,
      breed,
      bio,
      traits: splitTraits(traits),
    })
  }

  if (pet === undefined) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loading}>Loading pet...</Text>
      </SafeAreaView>
    )
  }

  if (pet === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loading}>Pet not found.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.panel}>
          <Text style={styles.eyebrow}>Pet profile</Text>
          <Text style={styles.title}>{pet.name}</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
          <TextInput style={styles.input} value={species} onChangeText={setSpecies} placeholder="Species" />
          <TextInput style={styles.input} value={breed} onChangeText={setBreed} placeholder="Breed" />
          <TextInput style={styles.input} value={traits} onChangeText={setTraits} placeholder="Traits" />
          <TextInput style={[styles.input, styles.textarea]} value={bio} onChangeText={setBio} multiline />
          <Pressable style={styles.primaryButton} onPress={() => void save()}>
            <Text style={styles.primaryButtonText}>Save changes</Text>
          </Pressable>
        </View>

        <View style={styles.panel}>
          <Text style={styles.eyebrow}>Generation preview</Text>
          <Text style={styles.sectionTitle}>Prompt shape</Text>
          <TextInput style={[styles.input, styles.textarea]} value={prompt} onChangeText={setPrompt} multiline />
          <Text style={styles.promptPreview}>{preview?.userPrompt ?? 'Preview will appear here.'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 44,
  },
  panel: {
    ...shadow,
    borderColor: colors.line,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: colors.paper,
    gap: 14,
    padding: 22,
  },
  eyebrow: {
    color: colors.tomato,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontFamily: 'Georgia',
    fontSize: 38,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '800',
  },
  input: {
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: '#fffdf7',
    color: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textarea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: colors.tomato,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '900',
  },
  promptPreview: {
    borderRadius: 18,
    backgroundColor: colors.ink,
    color: colors.paper,
    fontSize: 12,
    lineHeight: 18,
    padding: 16,
  },
  loading: {
    color: colors.muted,
    padding: 24,
  },
})

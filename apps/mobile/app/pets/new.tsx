import { useMutation } from 'convex/react'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput } from 'react-native'
import { splitTraits } from '@lindale/shared'
import { api } from '../../src/convex'
import { colors, shadow } from '../../src/theme'

export default function NewPetScreen() {
  const router = useRouter()
  const createPet = useMutation(api.pets.create)
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [traits, setTraits] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setError(null)
    try {
      const petId = await createPet({
        name,
        species,
        breed,
        bio,
        traits: splitTraits(traits),
      })
      router.replace(`/pets/${petId}`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create pet')
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>New regular</Text>
        <Text style={styles.title}>Add a pet.</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
        <TextInput style={styles.input} value={species} onChangeText={setSpecies} placeholder="Species" />
        <TextInput style={styles.input} value={breed} onChangeText={setBreed} placeholder="Breed" />
        <TextInput style={styles.input} value={traits} onChangeText={setTraits} placeholder="Traits, comma separated" />
        <TextInput
          style={[styles.input, styles.textarea]}
          value={bio}
          onChangeText={setBio}
          placeholder="A few details CafeZoe should remember"
          multiline
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.primaryButton} onPress={() => void save()}>
          <Text style={styles.primaryButtonText}>Save pet</Text>
        </Pressable>
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
    ...shadow,
    gap: 14,
    margin: 20,
    borderColor: colors.line,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: colors.paper,
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    color: '#a4261d',
    fontWeight: '700',
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
})

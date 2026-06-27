import { useAuthActions, useConvexAuth } from '@convex-dev/auth/react'
import { useQuery } from 'convex/react'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { signInWithPassword } from '../src/auth'
import { PASSWORD_MIN_LENGTH } from '@lindale/shared'
import { api } from '../src/convex'
import { colors, shadow } from '../src/theme'

function AuthPanel() {
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    try {
      await signInWithPassword(signIn, { email: email.trim(), password })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign-in failed')
    }
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.eyebrow}>Cafe key</Text>
      <Text style={styles.title}>Sign in to CafeZoe.</Text>
      <Text style={styles.body}>
        This starter uses Convex password auth. New accounts need a password of at least {PASSWORD_MIN_LENGTH}{' '}
        characters.
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.primaryButton} onPress={() => void submit()}>
        <Text style={styles.primaryButtonText}>Continue</Text>
      </Pressable>
    </View>
  )
}

function PetList() {
  const pets = useQuery(api.pets.listMine)
  const { signOut } = useAuthActions()

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Studio desk</Text>
        <Text style={styles.title}>Your pet roster starts here.</Text>
        <Text style={styles.body}>Add pets, record their traits, and preview the future generation prompt shape.</Text>
        <View style={styles.actionRow}>
          <Link href="/pets/new" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Add pet</Text>
            </Pressable>
          </Link>
          <Pressable style={styles.secondaryButton} onPress={() => void signOut()}>
            <Text style={styles.secondaryButtonText}>Sign out</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Pets</Text>
        {pets === undefined ? <Text style={styles.body}>Loading...</Text> : null}
        {pets?.length === 0 ? <Text style={styles.body}>No pets yet. Add one to begin.</Text> : null}
        {pets?.map((pet) => (
          <Link key={pet._id} href={`/pets/${pet._id}`} asChild>
            <Pressable style={styles.petRow}>
              <View style={styles.petAvatar}>
                <Text style={styles.petAvatarText}>{pet.name.slice(0, 1).toUpperCase()}</Text>
              </View>
              <View style={styles.petText}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petMeta}>{[pet.species, pet.breed].filter(Boolean).join(' · ') || 'Details pending'}</Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  )
}

export default function IndexScreen() {
  const { isLoading, isAuthenticated } = useConvexAuth()

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {isLoading ? (
        <View style={styles.content}>
          <Text style={styles.body}>Checking your cafe key...</Text>
        </View>
      ) : isAuthenticated ? (
        <PetList />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <AuthPanel />
        </ScrollView>
      )}
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
  hero: {
    ...shadow,
    borderRadius: 34,
    backgroundColor: colors.ink,
    padding: 26,
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
    letterSpacing: -2.4,
    lineHeight: 39,
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
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
  error: {
    color: '#a4261d',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: colors.tomato,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '900',
  },
  secondaryButton: {
    borderColor: '#ffffff55',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  secondaryButtonText: {
    color: colors.paper,
    fontWeight: '900',
  },
  petRow: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  petAvatar: {
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderColor: colors.ink,
    borderRadius: 18,
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  petAvatarText: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  petText: {
    flex: 1,
  },
  petName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  petMeta: {
    color: colors.muted,
    marginTop: 3,
  },
})

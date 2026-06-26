import type {
  AudioArtifact,
  GenerationPlan,
  ImageArtifact,
  ProviderName,
  ProviderResult,
  TextArtifact,
} from './types'

export type ProviderCallContext = {
  jobId?: string
  provider: ProviderName
  signal?: AbortSignal
  metadata?: Record<string, unknown>
}

export type TextGenerationProvider = {
  provider: ProviderName
  generateText: (plan: GenerationPlan, context?: ProviderCallContext) => Promise<ProviderResult<TextArtifact>>
  streamText?: (
    plan: GenerationPlan,
    onChunk: (chunk: string) => Promise<void>,
    context?: ProviderCallContext,
  ) => Promise<ProviderResult<TextArtifact>>
}

export type ImageGenerationProvider = {
  provider: ProviderName
  generateImage: (
    prompt: string,
    plan: GenerationPlan,
    context?: ProviderCallContext,
  ) => Promise<ProviderResult<ImageArtifact>>
}

export type AudioGenerationProvider = {
  provider: ProviderName
  generateAudio: (
    text: string,
    plan: GenerationPlan,
    context?: ProviderCallContext,
  ) => Promise<ProviderResult<AudioArtifact>>
}

export type GenerationProviders = {
  text?: TextGenerationProvider
  image?: ImageGenerationProvider
  audio?: AudioGenerationProvider
}

export function requireTextProvider(providers: GenerationProviders): TextGenerationProvider {
  if (!providers.text) throw new Error('A text generation provider is required for this output spec.')
  return providers.text
}

export function requireImageProvider(providers: GenerationProviders): ImageGenerationProvider {
  if (!providers.image) throw new Error('An image generation provider is required for this output spec.')
  return providers.image
}

export function requireAudioProvider(providers: GenerationProviders): AudioGenerationProvider {
  if (!providers.audio) throw new Error('An audio generation provider is required for this output spec.')
  return providers.audio
}

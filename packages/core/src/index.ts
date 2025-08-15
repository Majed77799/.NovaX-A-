export type TranslateRequest = { text: string; targetLang: string };
export type TranslateResponse = { translatedText: string; provider: string; mock: boolean };

export type VoiceRequest = { text: string; voice?: string };
export type VoiceResponse = { audioBase64: string; provider: string; mock: boolean };

export type ImageRequest = { prompt: string; size?: '256x256' | '512x512' | '1024x1024' };
export type ImageResponse = { imageBase64: string; provider: string; mock: boolean };

export type Template = { id: string; name: string; content: string };

export type ApiError = { message: string; code?: string };

export const toDataUrl = (mime: string, base64: string) => `data:${mime};base64,${base64}`;

export const isMockEnabled = (env: NodeJS.ProcessEnv) => {
  return env.MOCK_MODE === 'true' ||
    (!env.OPENAI_API_KEY && !env.GOOGLE_TRANSLATE_API_KEY && !env.VOICE_PROVIDER_KEY && !env.IMAGE_PROVIDER_KEY);
};
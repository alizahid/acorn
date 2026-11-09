import { create } from 'zustand'

export type SpeechStatus = 'idle' | 'speaking' | 'paused' | 'error'

export type SpeechPayload = {
  boundary?: [number, number]
  status: SpeechStatus
  text?: string
}

export type State = SpeechPayload

export const useSpeech = create<State>()(() => ({
  status: 'idle',
}))

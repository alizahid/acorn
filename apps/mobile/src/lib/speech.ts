// biome-ignore lint/performance/noNamespaceImport: go away
import * as Speech from 'expo-speech'
import { type NativeBoundaryEvent } from 'expo-speech/build/Speech.types'

import { useSpeech } from '~/stores/speech'

export const speech = {
  async pause() {
    await Speech.pause()

    useSpeech.setState({
      status: 'paused',
    })
  },
  async resume() {
    await Speech.resume()

    useSpeech.setState({
      status: 'speaking',
    })
  },
  speak(text: string) {
    useSpeech.setState({
      text,
    })

    Speech.speak(text, {
      onBoundary(event: NativeBoundaryEvent) {
        useSpeech.setState({
          boundary: [event.charIndex, event.charIndex + event.charLength],
        })
      },
      onDone() {
        useSpeech.setState({
          boundary: undefined,
          status: 'idle',
          text: undefined,
        })
      },
      onError() {
        useSpeech.setState({
          status: 'error',
        })
      },
      onStart() {
        useSpeech.setState({
          status: 'speaking',
        })
      },
      onStopped() {
        useSpeech.setState({
          status: 'idle',
        })
      },
    })
  },
}

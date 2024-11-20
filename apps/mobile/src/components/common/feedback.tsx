import * as Haptics from 'expo-haptics'
import { useEffect } from 'react'
import SoundPlayer from 'react-native-sound-player'

import { type Feedback, feedback } from '~/lib/feedback'
import { usePreferences } from '~/stores/preferences'

export function Feedback() {
  const { feedbackHaptics, feedbackSounds } = usePreferences()

  useEffect(() => {
    function handler(type: keyof Feedback) {
      if (feedbackSounds) {
        SoundPlayer.playSoundFile(sounds[type], 'caf')
      }

      if (feedbackHaptics) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
      }
    }

    feedback.on('*', handler)

    return () => {
      feedback.off('*', handler)
    }
  }, [feedbackHaptics, feedbackSounds])

  return null
}

const sounds: Record<keyof Feedback, string> = {
  down: 'error_06',
  refresh: 'woosh_09',
  save: 'woosh_04',
  soft: 'pop_10',
  undo: 'click_01',
  up: 'pop_06',
} as const

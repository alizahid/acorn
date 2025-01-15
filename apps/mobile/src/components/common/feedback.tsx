/* eslint-disable camelcase -- go away */

import * as Haptics from 'expo-haptics'
import { useEffect } from 'react'
import SoundPlayer from 'react-native-sound-player'

import click_01 from '~/assets/sounds/click_01.caf'
import error_06 from '~/assets/sounds/error_06.caf'
import pop_06 from '~/assets/sounds/pop_06.caf'
import pop_10 from '~/assets/sounds/pop_10.caf'
import woosh_04 from '~/assets/sounds/woosh_04.caf'
import woosh_09 from '~/assets/sounds/woosh_09.caf'
import { type Feedback, feedback } from '~/lib/feedback'
import { usePreferences } from '~/stores/preferences'

export function Feedback() {
  const { feedbackHaptics, feedbackSounds, hapticsLoud } = usePreferences()

  useEffect(() => {
    SoundPlayer.setMixAudio(true)

    function handler(type: keyof Feedback) {
      if (feedbackSounds) {
        SoundPlayer.playAsset(assets[type])
      }

      if (feedbackHaptics) {
        void Haptics.impactAsync(
          type === 'soft'
            ? hapticsLoud
              ? Haptics.ImpactFeedbackStyle.Rigid
              : Haptics.ImpactFeedbackStyle.Soft
            : hapticsLoud
              ? Haptics.ImpactFeedbackStyle.Heavy
              : Haptics.ImpactFeedbackStyle.Light,
        )
      }
    }

    feedback.on('*', handler)

    return () => {
      feedback.off('*', handler)
    }
  }, [feedbackHaptics, feedbackSounds, hapticsLoud])

  return null
}

const assets: Record<keyof Feedback, number> = {
  down: error_06,
  refresh: woosh_09,
  save: woosh_04,
  soft: pop_10,
  undo: click_01,
  up: pop_06,
} as const

/* eslint-disable camelcase -- go away */

import * as Haptics from 'expo-haptics'
import SoundPlayer from 'react-native-sound-player'

import click_01 from '~/assets/sounds/click_01.caf'
import error_06 from '~/assets/sounds/error_06.caf'
import pop_06 from '~/assets/sounds/pop_06.caf'
import pop_10 from '~/assets/sounds/pop_10.caf'
import woosh_04 from '~/assets/sounds/woosh_04.caf'
import woosh_09 from '~/assets/sounds/woosh_09.caf'
import { usePreferences } from '~/stores/preferences'

export type Feedback = {
  down: undefined
  refresh: undefined
  save: undefined
  soft: undefined
  undo: undefined
  up: undefined
}

SoundPlayer.setMixAudio(true)

export function triggerFeedback(type: keyof Feedback) {
  triggerSound(type)
  triggerFeedback(type)
}

export function triggerSound(type: keyof Feedback) {
  const { feedbackSounds } = usePreferences.getState()

  if (feedbackSounds) {
    SoundPlayer.playAsset(assets[type])
  }
}

export function triggerHaptic(type: keyof Feedback) {
  const { feedbackHaptics, hapticsLoud } = usePreferences.getState()

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

const assets: Record<keyof Feedback, number> = {
  down: error_06,
  refresh: woosh_09,
  save: woosh_04,
  soft: pop_10,
  undo: click_01,
  up: pop_06,
} as const

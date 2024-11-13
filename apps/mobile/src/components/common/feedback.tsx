/* eslint-disable camelcase -- go away */

import { type AudioPlayer, useAudioPlayer } from 'expo-audio'
import * as Haptics from 'expo-haptics'
import { useEffect, useMemo } from 'react'

import click_01 from '~/assets/sounds/click_01.caf'
import error_06 from '~/assets/sounds/error_06.caf'
import pop_06 from '~/assets/sounds/pop_06.caf'
import woosh_04 from '~/assets/sounds/woosh_04.caf'
import woosh_09 from '~/assets/sounds/woosh_09.caf'
import { type Feedback, feedback } from '~/lib/feedback'
import { usePreferences } from '~/stores/preferences'

export function Feedback() {
  const { feedbackHaptics, feedbackSounds } = usePreferences()

  const down = useAudioPlayer(error_06)
  const refresh = useAudioPlayer(woosh_09)
  const save = useAudioPlayer(woosh_04)
  const undo = useAudioPlayer(click_01)
  const up = useAudioPlayer(pop_06)

  const sounds = useMemo<Record<keyof Feedback, AudioPlayer>>(
    () => ({
      down,
      refresh,
      save,
      undo,
      up,
    }),
    [down, refresh, save, undo, up],
  )

  const haptics = useMemo<Record<keyof Feedback, () => Promise<void>>>(
    () => ({
      down: () =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
      refresh: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
      save: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      undo: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
      up: () =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    }),
    [],
  )

  useEffect(() => {
    function handler(type: keyof Feedback) {
      if (feedbackSounds) {
        sounds[type].play()

        setTimeout(() => {
          void sounds[type].seekTo(-1)
        }, 1_000)
      }

      if (feedbackHaptics) {
        void haptics[type]()
      }
    }

    feedback.on('*', handler)

    return () => {
      feedback.off('*', handler)
    }
  }, [feedbackHaptics, feedbackSounds, haptics, sounds])

  return null
}

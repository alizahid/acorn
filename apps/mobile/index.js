import 'expo-dev-client'
import 'expo-router/entry'
import '@formatjs/intl-getcanonicallocales/polyfill-force' // 1
import '@formatjs/intl-locale/polyfill-force' // 2
import '@formatjs/intl-pluralrules/polyfill-force' // 3
import '@formatjs/intl-pluralrules/locale-data/en' // 4
import '@formatjs/intl-numberformat/polyfill-force' // 5
import '@formatjs/intl-numberformat/locale-data/en' // 6
import '@formatjs/intl-relativetimeformat/polyfill-force' // 7
import '@formatjs/intl-relativetimeformat/locale-data/en' // 8

import '~/styles/uni'

import SoundPlayer from 'react-native-sound-player'

SoundPlayer.setMixAudio(true)

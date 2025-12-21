import 'expo-dev-client'
import 'expo-router/entry'
import '@formatjs/intl-getcanonicallocales/polyfill-force.js' // 1
import '@formatjs/intl-locale/polyfill-force.js' // 2
import '@formatjs/intl-pluralrules/polyfill-force.js' // 3
import '@formatjs/intl-pluralrules/locale-data/en.js' // 4
import '@formatjs/intl-numberformat/polyfill-force.js' // 5
import '@formatjs/intl-numberformat/locale-data/en.js' // 6
import '@formatjs/intl-relativetimeformat/polyfill-force.js' // 7
import '@formatjs/intl-relativetimeformat/locale-data/en.js' // 8

import '~/styles/uni'

import SoundPlayer from 'react-native-sound-player'

SoundPlayer.setMixAudio(true)

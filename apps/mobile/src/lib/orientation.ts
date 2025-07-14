// biome-ignore lint/performance/noNamespaceImport: go away
import * as ScreenOrientation from 'expo-screen-orientation'

export function lockOrientation() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
}

export function unlockOrientation() {
  ScreenOrientation.unlockAsync()
}

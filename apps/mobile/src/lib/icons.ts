import { osVersion } from 'expo-device'
import { type SFSymbol } from 'expo-symbols'
import semver from 'semver'

const version = semver.coerce(osVersion) ?? '0'

export const symbolVersion = semver.gte(version, '18.0.0')
  ? 6
  : semver.gte(version, '17.0.0')
    ? 5
    : semver.gte(version, '16.0.0')
      ? 4
      : 3

type Name =
  | 'upvote'
  | 'upvote.fill'
  | 'downvote'
  | 'downvote.fill'
  | 'plus10'
  | 'minus10'

export function getIcon(name: Name): SFSymbol

export function getIcon(
  name: 'downvote',
): 'arrowshape.down' | 'arrowtriangle.down'

export function getIcon(
  name: 'downvote.fill',
): 'arrowshape.down.fill' | 'arrowtriangle.down.fill'

export function getIcon(name: 'upvote'): 'arrowshape.up' | 'arrowtriangle.up'

export function getIcon(
  name: 'upvote.fill',
): 'arrowshape.up.fill' | 'arrowtriangle.up.fill'

export function getIcon(
  name: 'minus10',
): '10.arrow.trianglehead.counterclockwise' | 'gobackward.10'

export function getIcon(
  name: 'plus10',
): '10.arrow.trianglehead.clockwise' | 'goforward.10'

export function getIcon(name: Name) {
  if (symbolVersion > 4) {
    if (name === 'downvote') {
      return 'arrowshape.down'
    }

    if (name === 'downvote.fill') {
      return 'arrowshape.down.fill'
    }

    if (name === 'upvote') {
      return 'arrowshape.up'
    }

    if (name === 'upvote.fill') {
      return 'arrowshape.up.fill'
    }

    if (name === 'minus10') {
      return '10.arrow.trianglehead.counterclockwise'
    }

    if (name === 'plus10') {
      return '10.arrow.trianglehead.clockwise'
    }

    return 'questionmark'
  }

  if (name === 'downvote') {
    return 'arrowtriangle.down'
  }

  if (name === 'downvote.fill') {
    return 'arrowtriangle.down.fill'
  }

  if (name === 'upvote') {
    return 'arrowtriangle.up'
  }

  if (name === 'upvote.fill') {
    return 'arrowtriangle.up.fill'
  }

  if (name === 'minus10') {
    return 'gobackward.10'
  }

  if (name === 'plus10') {
    return 'goforward.10'
  }

  return 'questionmark'
}

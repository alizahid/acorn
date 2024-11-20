import mitt from 'mitt'

export type Feedback = {
  down: undefined
  refresh: undefined
  save: undefined
  soft: undefined
  undo: undefined
  up: undefined
}

export const feedback = mitt<Feedback>()

export function triggerFeedback(type: keyof Feedback) {
  feedback.emit(type)
}

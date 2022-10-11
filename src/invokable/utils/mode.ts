import { config, RuntimeOptions } from 'firebase-functions'
import { InvokableRuntimeModes } from '../type'

export const getMode = () => {
  return config().invokable.mode ?? ''
}

export const getRunOptions = (
  modes: InvokableRuntimeModes = {},
): RuntimeOptions => {
  // passing nothing to replace old options does not reset it.
  // E.g. if previously, `minInstances: 1` was passed in performance mode,
  // a subsequent normal mode deployment won't reset minInstances to zero
  // automatically unless an explicit zero is passed.
  const resets: RuntimeOptions = {
    minInstances: 0,
  }

  return {
    ...resets,
    ...modes.default,
    ...modes[getMode() as keyof InvokableRuntimeModes],
  }
}

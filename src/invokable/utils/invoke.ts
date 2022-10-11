import { https } from 'firebase-functions'

import { Log } from '../../Log'
import { AuthenticatedContext, InvokableAction } from '../type'

export const invoke = async <Body, Response = void>(
  action: InvokableAction<Body, Response>,
  body: Body,
  context: AuthenticatedContext,
) => {
  try {
    const response = await action(body, context)
    return response
  } catch (error) {
    Log.error(error)
    throw new https.HttpsError('unknown', (error as any)?.message || '')
  }
}

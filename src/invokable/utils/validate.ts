import { https } from 'firebase-functions'

import { Log } from '../../Log'
import { BodyValidationSchema } from '../type'

export const validate = async (
  body: any,
  validationSchema?: BodyValidationSchema,
) => {
  try {
    if (validationSchema) {
      await validationSchema.validate(body)
    }
  } catch (error) {
    Log.error(error)
    throw new https.HttpsError(
      'failed-precondition',
      (error as any)?.message || '',
    )
  }
}

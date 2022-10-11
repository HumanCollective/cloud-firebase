import * as Yup from 'yup'

export type AuthenticatedContext = {
  auth: { uid: string }
}

export type InvokableAction<Body, Response> = (
  body: Body,
  context: AuthenticatedContext,
) => Response | Promise<Response>

export type BodyValidationSchema = Yup.AnyObjectSchema

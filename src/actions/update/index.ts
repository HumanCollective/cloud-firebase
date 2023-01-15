import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreUpdateOptions<T, A = Record<string, any>> {
  // The collection path to add the document to.
  // This can be a string or a function that returns a string based on the parts
  // passed into the action.
  // (see the advanced example in src/actions/add/index.ts)
  collectionPath: string | ((args: A & { data: Partial<T> }) => string)
  debugName?: string
}

export const firestoreUpdate = <T, A = Record<string, any>>({
  collectionPath,
  debugName = 'document',
}: FirstoreUpdateOptions<T, A>) => async (
  id: string,
  updates: Partial<T>,
  args?: A,
) => {
  try {
    Log.breadcrumb(`updating ${debugName} with id "${id}"`)

    const dateUpdated = firestore.Timestamp.now()
    const data = { ...updates, dateUpdated }
    const ref = await firestore()
      .collection(
        typeof collectionPath === 'string'
          ? collectionPath
          : collectionPath({ ...(args as A), data }),
      )
      .doc(id)
      .update(data)

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

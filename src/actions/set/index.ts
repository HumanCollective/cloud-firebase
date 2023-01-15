import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreSetOptions<Args = undefined> {
  // The collection path to add the document to.
  // This can be a string or a function that returns a string based on the parts
  // passed into the action.
  // (see the advanced example in src/actions/add/index.ts)
  collectionPath: string | ((args: Args) => string)
  debugName?: string
}

export const firestoreSet = <T, A = undefined>({
  collectionPath,
  debugName = 'document',
}: FirstoreSetOptions<A>) => async (id: string, item: Partial<T>, args: A) => {
  try {
    Log.breadcrumb(`setting ${debugName} with id "${id}"`)

    const dateCreated = firestore.Timestamp.now()
    const data = { ...item, dateCreated }
    const ref = await firestore()
      .collection(
        typeof collectionPath === 'string'
          ? collectionPath
          : collectionPath(args),
      )
      .doc(id)
      .set(data)

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

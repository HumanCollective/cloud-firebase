import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreMergeOptions<Args = undefined> {
  // The collection path to add the document to.
  // This can be a string or a function that returns a string based on the parts
  // passed into the action.
  // (see the advanced example in src/actions/add/index.ts)
  collectionPath: string | ((args: Args) => string)
  debugName?: string
}

export const firestoreMerge = <T, A = undefined>({
  collectionPath,
  debugName = 'document',
}: FirstoreMergeOptions<A>) => async (
  id: string,
  item: Partial<T>,
  args?: A,
) => {
  try {
    Log.breadcrumb(`merging ${debugName} with id "${id}"`)

    const dateCreated = firestore.Timestamp.now()
    const data = { ...item, dateCreated }
    const ref = await firestore()
      .collection(
        typeof collectionPath === 'string'
          ? collectionPath
          : collectionPath(args ?? ({} as A)),
      )
      .doc(id)
      .set(data, { merge: true })

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreMergeOptions<T, A = Record<string, any>> {
  // The collection path to add the document to.
  // This can be a string or a function that returns a string based on the parts
  // passed into the action.
  // (see the advanced example in src/actions/add/index.ts)
  collectionPath: string | ((args: A & { data: Partial<T> }) => string)
  debugName?: string
}

export const firestoreMerge = <T, A = Record<string, any>>({
  collectionPath,
  debugName = 'document',
}: FirstoreMergeOptions<T, A>) => async (
  id: string,
  item: Partial<T>,
  args?: A,
) => {
  try {
    Log.breadcrumb(`merging ${debugName} with id "${id}"`)

    const dateCreated = firestore.Timestamp.now()
    const data = { ...item, dateCreated } as Partial<T>
    const ref = await firestore()
      .collection(
        typeof collectionPath === 'string'
          ? collectionPath
          : collectionPath({ ...(args as A), data }),
      )
      .doc(id)
      .set(data, { merge: true })

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

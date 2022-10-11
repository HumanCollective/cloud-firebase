import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreMergeOptions {
  collectionPath: string
  debugName?: string
}

export const firestoreMerge = <T>({
  collectionPath,
  debugName = 'document',
}: FirstoreMergeOptions) => async (id: string, item: Partial<T>) => {
  try {
    Log.breadcrumb(`merging ${debugName} with id "${id}"`)

    const dateCreated = firestore.Timestamp.now()
    const data = { ...item, dateCreated }
    const ref = await firestore()
      .collection(collectionPath)
      .doc(id)
      .set(data, { merge: true })

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

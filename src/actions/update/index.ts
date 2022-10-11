import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreUpdateOptions {
  collectionPath: string
  debugName?: string
}

export const firestoreUpdate = <T>({
  collectionPath,
  debugName = 'document',
}: FirstoreUpdateOptions) => async (id: string, updates: Partial<T>) => {
  try {
    Log.breadcrumb(`updating ${debugName} with id "${id}"`)

    const dateUpdated = firestore.Timestamp.now()
    const data = { ...updates, dateUpdated }
    const ref = await firestore()
      .collection(collectionPath)
      .doc(id)
      .update(data)

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

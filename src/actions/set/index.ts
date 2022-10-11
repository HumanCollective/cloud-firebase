import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreSetOptions {
  collectionPath: string
  debugName?: string
}

export const firestoreSet = <T>({
  collectionPath,
  debugName = 'document',
}: FirstoreSetOptions) => async (id: string, item: Partial<T>) => {
  try {
    Log.breadcrumb(`setting ${debugName} with id "${id}"`)

    const dateCreated = firestore.Timestamp.now()
    const data = { ...item, dateCreated }
    const ref = await firestore()
      .collection(collectionPath)
      .doc(id)
      .set(data)

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

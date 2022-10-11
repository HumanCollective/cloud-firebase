import 'firebase-admin'
import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreDeleteOptions {
  collectionPath: string
  debugName?: string
}

export const firestoreDelete = ({
  collectionPath,
  debugName = 'document',
}: FirstoreDeleteOptions) => async (id: string) => {
  try {
    Log.breadcrumb(`deleting ${debugName} with id "${id}"`)

    const ref = await firestore()
      .collection(collectionPath)
      .doc(id)
      .delete()

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

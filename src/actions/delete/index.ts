import 'firebase-admin'
import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreDeleteOptions {
  collectionPath: string
  debugName?: string
}

/**
 * Utility for deletion of a firestore document
 * @param recursive Recursively delete all documents and subcollections at and under the specified level. If false, the document will not be deleted if it contains nested documents
 */
export const firestoreDelete = (
  { collectionPath, debugName = 'document' }: FirstoreDeleteOptions,
  recursive: boolean = false,
) => async (id: string) => {
  try {
    Log.breadcrumb(`deleting ${debugName} with id "${id}"`)

    const ref = await firestore()
      .collection(collectionPath)
      .doc(id)

    if (recursive) {
      await firestore().recursiveDelete(ref)
    } else {
      await ref.delete()
    }

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

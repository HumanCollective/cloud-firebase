import 'firebase-admin'
import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreDeleteOptions<A = Record<string, any>> {
  // The collection path to add the document to.
  // This can be a string or a function that returns a string based on the parts
  // passed into the action.
  // (see the advanced example in src/actions/add/index.ts)
  collectionPath: string | ((args: A) => string)
  debugName?: string
  recursive?: boolean
}

/**
 * Utility for deletion of a firestore document
 * @param recursive Recursively delete all documents and subcollections at and under the specified level. If false, the document will not be deleted if it contains nested documents
 */
export const firestoreDelete = <A = Record<string, any>>({
  collectionPath,
  debugName = 'document',
  recursive = false,
}: FirstoreDeleteOptions<A>) => async (id: string, args?: A) => {
  try {
    Log.breadcrumb(`deleting ${debugName} with id "${id}"`)

    const ref = await firestore()
      .collection(
        typeof collectionPath === 'string'
          ? collectionPath
          : collectionPath({ ...(args as A) }),
      )
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

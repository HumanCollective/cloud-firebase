import { firestore } from 'firebase-admin'
import { WithId } from '../../type'
import { Log } from '../../Log'
import { readSnapshot } from '../readSnapshot'

interface FirstoreGetOptions {
  collectionPath: string
  debugName?: string
}

export const firestoreGet = <T>({
  collectionPath,
  debugName = 'document',
}: FirstoreGetOptions) => async (id: string) => {
  try {
    Log.breadcrumb(`getting ${debugName} with id "${id}"`)

    const doc = await firestore()
      .collection(collectionPath)
      .doc(id)
      .get()

    return doc.exists ? readSnapshot<WithId<T>>(doc) : undefined
  } catch (error) {
    Log.error(error)
    throw error
  }
}

import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreCreateOptions {
  collectionPath: string
  debugName?: string
}

export const firestoreAdd = <T>({
  collectionPath,
  debugName = 'document',
}: FirstoreCreateOptions) => async (item: T) => {
  try {
    Log.breadcrumb(`creating ${debugName}`)

    const dateCreated = firestore.Timestamp.now()
    const data = { ...item, dateCreated }
    const ref = await firestore()
      .collection(collectionPath)
      .add(data)

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

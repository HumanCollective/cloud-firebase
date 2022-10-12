import { captureException, addBreadcrumb } from '@sentry/node'
import { firestore } from 'firebase-admin'

interface FirestoreExistsOrHasChildrenOptions {
  collectionPath: string
  debugName?: string
}

export const firestoreExistsOrHasChildren = ({
  collectionPath,
  debugName = 'document',
}: FirestoreExistsOrHasChildrenOptions) => async (id: string) => {
  try {
    addBreadcrumb({
      category: 'firebase',
      message: `checking existence of ${debugName} with id "${id}"`,
      level: 'info',
    })

    const ref = await firestore()
      .collection(collectionPath)
      .doc(id)
      .get()

    // check if the document exists
    if (ref.exists) return true

    /* 
                
                some document ids appear in italics on firestore. This means the document does not actually exist but has sub collections. This happens when you create sub collection to an empty document. 
                
                E.g. in user-attendance/{uid}/user-attendance shows, user-attendance/{uid} does not actually exist, but user-attendance/{uid}/user-attendance was created. So, the uid in user-attendance/{uid} will show up in italics.

                For such documents, doc.exists returns false. https://stackoverflow.com/a/48069564/4380666 

                However, we want to make sure we identify such documents as well. So if a document has subcollections, in our terminology, it exists as well (as opposed to firestore which says it doesn't)
                */
    const hasSubCollections = (await ref.ref.listCollections()).length > 0
    return hasSubCollections
  } catch (error) {
    captureException(error)
    throw error
  }
}

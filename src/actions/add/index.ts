import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreCreateOptions<A = undefined> {
  // The collection path to add the document to.
  // This can be a string or a function that returns a string based on the parts
  // passed into the action.
  collectionPath: string | ((args: A) => string)
  debugName?: string
}

export const firestoreAdd = <T, A = undefined>({
  collectionPath,
  debugName = 'document',
}: FirstoreCreateOptions<A>) => async (item: T, args: A) => {
  try {
    Log.breadcrumb(`creating ${debugName}`)

    const dateCreated = firestore.Timestamp.now()
    const data = { ...item, dateCreated }
    const ref = await firestore()
      .collection(
        typeof collectionPath === 'string'
          ? collectionPath
          : collectionPath(args),
      )
      .add(data)

    return ref
  } catch (error) {
    Log.error(error)
    throw error
  }
}

// SIMPLE EXAMPLE

// For example, you can use this to create a function that adds a post to a
// collection of posts:
// const addPost = firestoreAdd<Post>({ collectionPath: 'posts' })

// which you can then use like this:
// const post = await addPost({ title: 'My post' })

// ADVANCED EXAMPLE

// Or you could use it to create a function that adds a post to a collection of
// posts for a specific user:
// const addPostForUser = firestoreAdd<Post, { userId: string }>({
//   collectionPath: (args) => `users/${args.userId}/posts`,
// })
// which you can then use like this:
// const post = await addPostForUser({ title: 'My post' }, { userId: '123' })

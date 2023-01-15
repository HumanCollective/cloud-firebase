import { firestore } from 'firebase-admin'
import { Log } from '../../Log'

interface FirstoreCreateOptions<T, A = Record<string, any>> {
  // The collection path to add the document to.
  // This can be a string or a function that returns a string based on the parts
  // passed into the action.
  collectionPath: string | ((args: A & { data: T }) => string)
  debugName?: string
  addMetadata?: boolean
}

export const firestoreAdd = <T, A = Record<string, any>>({
  collectionPath,
  debugName = 'document',
  addMetadata,
}: FirstoreCreateOptions<T, A>) => async (item: T, args?: A) => {
  try {
    Log.breadcrumb(`creating ${debugName}`)

    const data = {
      ...item,
      ...(addMetadata && {
        'metadata.timeCreated': firestore.Timestamp.now(),
      }),
    }

    const ref = await firestore()
      .collection(
        typeof collectionPath === 'string'
          ? collectionPath
          : collectionPath({ ...(args as A), data }),
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

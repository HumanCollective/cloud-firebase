import { v4 as uuid } from 'uuid'
import { createHash } from 'crypto'

import { firestoreGet, firestoreSet } from '../actions'
import { FIRESTORE_CONFIG_KEYS } from '../config'

interface ApiKey {
  uid: string
}

export const getKey = firestoreGet<ApiKey>(FIRESTORE_CONFIG_KEYS)
export const setKey = firestoreSet<ApiKey>(FIRESTORE_CONFIG_KEYS)

export const generateKey = (forUid: string) => {
  const apiKey = uuid()
  const hashed = createHash('md5')
    .update(apiKey)
    .digest('hex')
  setKey(hashed, { uid: forUid })

  return apiKey
}

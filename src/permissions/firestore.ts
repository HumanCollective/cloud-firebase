import { firestoreGet, firestoreSet, firestoreMerge } from '../actions'
import { FIRESTORE_CONFIG_PERMISSIONS } from '../config'
import { UserPermissions } from './type'

export const getUserPermissions = firestoreGet<UserPermissions>(
  FIRESTORE_CONFIG_PERMISSIONS,
)
export const setUserPermissions = firestoreSet<UserPermissions>(
  FIRESTORE_CONFIG_PERMISSIONS,
)
export const mergeUserPermissions = firestoreMerge<UserPermissions>(
  FIRESTORE_CONFIG_PERMISSIONS,
)

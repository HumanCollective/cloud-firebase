import { firestoreGet, firestoreSet, firestoreUpdate } from '../actions'
import { COLLECTION_CONFIG_PERMISSIONS } from '../config'
import { MetricConfig } from './types'

export const getMetricConfig = firestoreGet<MetricConfig>(
  COLLECTION_CONFIG_PERMISSIONS,
)
export const setMetricConfig = firestoreSet<MetricConfig>(
  COLLECTION_CONFIG_PERMISSIONS,
)
export const updateMetricConfig = firestoreUpdate<MetricConfig>(
  COLLECTION_CONFIG_PERMISSIONS,
)

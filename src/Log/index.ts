import { captureException, captureMessage, addBreadcrumb } from '@sentry/node'

const isProduction = process.env.NODE_ENV === 'production'

export const Log = {
  breadcrumb: (message: string) => {
    console.info(message)
    if (isProduction) {
      addBreadcrumb({ category: 'firebase', level: 'info', message })
    }
  },
  error: (err: any) => {
    console.error(err)
    if (isProduction) {
      captureException(err)
    }
  },
  warn: (message: string, ...payload: any[]) => {
    console.warn(message, ...payload)
    if (isProduction) {
      captureMessage(message, 'warning')
    }
  },
  debug: (message: string, ...payload: any[]) => {
    console.debug(message, ...payload)
    if (isProduction) {
      captureMessage(message, 'debug')
    }
  },
  print: (message: string, ...payload: any[]) => {
    console.log(message, ...payload)
  },
}

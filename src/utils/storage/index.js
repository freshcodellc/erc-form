import storageFactory from './storageFactory'

const defaultStorageFactory = { setItem: () => null, getItem: () => null }

export const localStore =
  typeof window !== 'undefined'
    ? storageFactory(localStorage)
    : defaultStorageFactory
export const sessionStore =
  typeof window !== 'undefined'
    ? storageFactory(sessionStorage)
    : defaultStorageFactory

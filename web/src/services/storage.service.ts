export const StorageService = {
  getAccessToken(): string | undefined {
    return _storage.getItem<string>('access_token')
  },

  setAccessToken(token: string): void {
    _storage.setItem('access_token', token)
  },

  getRefreshToken(): string | undefined {
    return _storage.getItem<string>('refresh_token')
  },

  setRefreshToken(token: string): void {
    _storage.setItem('refresh_token', token)
  },

  removeAuthTokens(): void {
    this.remove('access_token')
    this.remove('refresh_token')
  },

  get<T = unknown>(key: string, fromSessionStorage = false): T | undefined {
    return _storage.getItem<T>(key, fromSessionStorage)
  },

  set<T>(key: string, value: T, saveToSessionStorage = false): void {
    _storage.setItem(key, value, saveToSessionStorage)
  },

  has(key: string, fromSessionStorage = false): boolean {
    return _storage.getItem(key, fromSessionStorage) !== undefined
  },

  remove(key: string, fromSessionStorage = false): void {
    _storage.removeItem(key, fromSessionStorage)
  },

  logout(): void {
    this.removeAuthTokens()
  },
}

const _storage = {
  getItem<T = unknown>(key: string, fromSessionStorage = false): T | undefined {
    const _key = generateKey(key)
    const storage = selectStorage(fromSessionStorage)

    const val = storage.getItem(_key)

    if (val === null) return undefined

    try {
      return JSON.parse(val) as T
    } catch (error) {
      console.error('Failed to parse JSON:', error)
      return val as T // Return the value directly if it's not JSON.
    }
  },

  setItem<T>(key: string, value: T, saveToSessionStorage = false): void {
    const _key = generateKey(key)
    const storage = selectStorage(saveToSessionStorage)

    if (value === undefined || value === null) {
      storage.removeItem(_key)
      return
    }

    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : (value as string)
    storage.setItem(_key, valueToStore)
  },

  removeItem(key: string, fromSessionStorage = false): void {
    const _key = generateKey(key)
    const storage = selectStorage(fromSessionStorage)
    storage.removeItem(_key)
  },
}

function selectStorage(isSessionStore: boolean): Storage {
  return isSessionStore ? sessionStorage : localStorage
}

function generateKey(key: string): string {
  return `__personal-finance-app__.${key}`
}

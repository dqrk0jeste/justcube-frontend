export const API = 'http://localhost:3500'

export function createAuthHeader(key: string) {
  return 'Bearer ' + key
}
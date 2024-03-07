import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { SessionUser } from '../utils/types'

export const useSessionStore = defineStore('session', () => {
  const user = ref<SessionUser>({
    isGuest: true,
  })

  return { user }
})

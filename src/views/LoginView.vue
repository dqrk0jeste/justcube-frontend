<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ofetch } from 'ofetch'

import { useSessionStore } from '@/stores/session'
import { API } from '@/utils/api'

import type { User } from '@/utils/types'

const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')

const { error, isFetching, loginUser } = useLogin()

function useLogin() {
  const isFetching = ref<boolean>(false)
  const error = ref<any>(null)

  async function loginUser() {
    type LoginResponse = {
      access_token: string,
      refresh_token: string,
      user: User,
    }

    try {
      isFetching.value = true
      const data = await ofetch<LoginResponse>(API + '/users/login', {
        method: 'POST',
        body: {
          username: username.value,
          password: password.value,
        },
      })

      const sessionStore = useSessionStore()
      sessionStore.user = {
        isGuest: false,
        userInfo: data.user,
        accessToken: data.access_token,
      }
      // TODO: add auto refreshing of the access token using the refresh token
      router.push('/')
    } catch (e: any) {
      error.value = e
      setTimeout(() => {
        error.value = null
      }, 2000)
    } finally {
      isFetching.value = false
    }
  }
  return {
    error,
    isFetching,
    loginUser,
  }
}
</script>

<template>
  <div class="this h-full w-full overflow-y-auto grid place-items-center">
    <form @submit.prevent="loginUser()" class="max-w-[300px] w-full">
      <h1 class="text-3xl mb-5 text-center">welcome back</h1>
      <div>
        <label for="username" class="hidden">username</label>
        <input
          v-model="username"
          type="text"
          id="username"
          placeholder="username"
          class="outline-none rounded-full text-lg text-black px-5 py-3 w-full"
          required
          autocomplete="true"
        >
      </div>
      <div class="mt-5">
        <label for="password" class="hidden">password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="password"
          class="outline-none rounded-full text-lg text-black px-5 py-3 w-full"
          required
          autocomplete="true"
        >
        <p class="mt-1 mr-3 text-right text-md text-gray-200">
          <RouterLink to="/login">forgot password?</RouterLink>
        </p>
      </div>
      <button
        type="submit"
        class="w-full h-[52px] mt-3 rounded-full text-lg font-bold transition-color"
        :class="error ? 'bg-red-400' : 'bg-blue-200 hover:bg-blue-300'"
        :disabled="error"
      >
        <box-icon v-if="isFetching" name="loader-circle" animation="spin"></box-icon>
        <span v-else class="text-black">login</span>
      </button>
      <p class="mt-2 text-center text-md text-gray-200">don't have an account?
        <RouterLink to="/signup" class="text-blue-200">sign up</RouterLink>
      </p>
    </form>
  </div>
</template>

<style scoped>
.this::-webkit-scrollbar {
  width: 5px;
}

.this::-webkit-scrollbar-track {
  background-color: transparent;
  margin-top: 20px;
  margin-bottom: 20px;
}

.this::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 5px;
}
</style>
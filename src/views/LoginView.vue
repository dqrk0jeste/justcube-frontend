<script setup lang="ts">
  import { ref } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { useTitle } from '@vueuse/core'
  import { ofetch } from 'ofetch'
  import { useSessionStore } from '@/stores/session'
  import { API } from '@/utils/api'
  import type { User } from '@/utils/types'

  const title = useTitle()
  title.value = "let's cube | login"

  const router = useRouter()

  const username = ref<string>('')
  const password = ref<string>('')

  async function loginUser() {
    type LoginResponse = {
      access_token: string,
      user: User,
    }

    try {
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
      router.push('/')
    } catch(e: any) {
      console.log(e)
    }
  }
</script>

<template>
  <div class="this h-full w-full overflow-y-auto grid place-items-center">
    <form @submit.prevent="loginUser()" class="max-w-[300px] w-full">
      <h1 class="text-3xl mb-5 text-center">welcome back</h1>
      <div>
        <label for="username" class="hidden">username</label>
        <input v-model="username" type="text" id="username" placeholder="username" class="outline-none rounded-full text-lg text-black px-5 py-3 w-full" required>
      </div>
      <div class="mt-5">
        <label for="password" class="hidden">password</label>
        <input v-model="password" type="password" id="password" placeholder="password" class="outline-none rounded-full text-lg text-black px-5 py-3 w-full" required>
        <p class="mt-1 mr-3 text-right text-md text-gray-200">
          <RouterLink to="/login">forgot password?</RouterLink>
        </p>
      </div>
      <button type="submit" class="bg-blue-200 w-full p-3 mt-3 rounded-full text-lg font-bold text-black hover:bg-blue-300 transition-color">login</button>
      <p class="mt-2 text-center text-md text-gray-200">don't have an account? <RouterLink to="/signup" class="text-blue-200">sign up</RouterLink></p>
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
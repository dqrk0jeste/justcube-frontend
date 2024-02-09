<script setup lang="ts">
  import { ref } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { useTitle } from '@vueuse/core'
  import { ofetch } from 'ofetch'
  import { useSessionStore } from '@/stores/session'
  import { API } from '@/utils/api'
  import type { User } from '@/utils/types'

  const title = useTitle()
  title.value = "let's cube | sigup"

  const router = useRouter()

  const username = ref<string>('')
  const password = ref<string>('')

  const signupPending = ref<boolean>(false)
  const signupError = ref<any>(null)

  async function signupUser() {
    type SignupResponse = {
      user: User,
    }

    try {
      signupPending.value = true
      await ofetch<SignupResponse>(API + '/users', {
        method: 'POST',
        body: {
          username: username.value,
          password: password.value,
        },
      })

      router.push('/login')
    } catch(e: any) {
      signupError.value = e
    }
    signupPending.value = false
  }
</script>

<template>
  <div class="this h-full w-full overflow-y-auto grid place-items-center">
    <form @submit.prevent="signupUser()" class="max-w-[300px] w-full">
      <h1 class="text-3xl mb-5 text-center">create account</h1>

      <div>
        <label for="username" class="hidden">username</label>
        <input v-model="username" type="text" id="username" placeholder="username" class="outline-none rounded-full text-lg text-black px-5 py-3 w-full" required maxlength="20">
      </div>

      <div class="mt-5">
        <label for="password" class="hidden">password</label>
        <input v-model="password" type="password" id="password" placeholder="password" class="outline-none rounded-full text-lg text-black px-5 py-3 w-full" required>
        <div class="w-full flex justify-center">
          
        </div>
      </div>

      <button type="submit" class="bg-blue-200 w-full h-[52px] mt-7 rounded-full text-lg font-bold hover:bg-blue-300 transition-color" >
        <i v-if="signupPending" class='bx bx-loader-circle bx-spin text-2xl text-black'></i>
        <span v-else class="text-black">create account</span>
      </button>

      <p class="mt-2 text-center text-md text-gray-200">already have an account? <RouterLink to="/login" class="text-blue-200">login</RouterLink></p>
      
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
<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside, useTextareaAutosize } from '@vueuse/core'

import { isValidLink } from '@/utils/link'

import Input from '@/components/Input.vue'

const {
  links,
  solves,
} = useForm()

const {
  textarea,
  input: textContent
} = useTextareaAutosize({ styleProp: 'minHeight' })

const {
  currentLink,
  linkModal,
  linkModalOpened,
} = useLink()

function useLink() {
  const linkModal = ref<HTMLElement>()
  const linkModalOpened = ref(false)
  const currentLink = ref('')

  onClickOutside(linkModal, event => {
    linkModalOpened.value = false
  })

  return {
    linkModal,
    linkModalOpened,
    currentLink,
  }
}
// TODO
function useForm() {
  const links = ref([] as string[])
  const solves = ref([]) //as solve[])

  return {
    links,
    solves,
  }
}
// TODO
function uploadPost() {
  return;
}
// TODO
function addSolve() {
  return;
}
// TODO
function addLink() {
  links.value.push(currentLink.value)
}

function removeLink(index: number) {
  links.value.splice(index, 1)
}
</script>

<template>
  <form @submit.prevent="uploadPost" class="p-3 bg-neutral-900 rounded-2xl">
    <textarea
      ref="textarea"
      v-model="textContent"
      name="new-post"
      id="new-post"
      rows="5"
      placeholder="have something to share?"
      class="block w-full resize-none bg-transparent p-3 outline-none overflow-hidden text-xl border-white border rounded-xl"
      required
    ></textarea>
    <div class="pt-2 flex justify-between gap-3">
      <div class="flex gap-3 items-center">
        <button
          @click="addSolve"
          type="button"
          class="flex items-center w-[50px] justify-center aspect-square bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <box-icon name='cube' size="sm" color="white"></box-icon>
        </button>
        <button
          @click="linkModalOpened = true"
          type="button"
          class="flex items-center w-[50px] justify-center aspect-square bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <box-icon name='link' size="sm" color="white"></box-icon>
        </button>
        <button type="button" class="flex items-center w-[50px] justify-center aspect-square bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <box-icon name='image-add' size="sm" color="white"></box-icon>
        </button>
      </div>
      <button
        type="submit"
        class="flex-1 max-w-[250px] rounded-full flex items-center justify-center gap-1 bg-blue-200 hover:bg-blue-300 transition-all group"
      >
        <span class="text-xl text-black font-bold">
          upload
        </span>
        <box-icon name="upload" class="hidden group-hover:block"></box-icon>
      </button>
    </div>
  </form>
  <Teleport to="body">
    <div v-if="linkModalOpened" class="fixed top-0 left-0 w-full h-[100dvh] flex items-center justify-center z-50">
      <div ref="linkModal" class="flex flex-col bg-white p-5 rounded-xl">
        <label for="link" class="ml-2 mb-1 text-black text-lg">add a link</label>
        <div class="shadow-md rounded-full">
          <Input @click="addLink" v-model="currentLink" name="link" for="link" placeholder="https://example.com">
            <box-icon name="plus" color="black" size="md" class="transition-all hover:scale-110"></box-icon>
          </Input>
        </div>
        <div class="pt-3 space-y-2">
          <div
            v-for="(link, index) in links"
            :key="index"
            class="flex items-center gap-2 group"
          >
            <div class="shadow rounded-full px-2 py-1 flex items-center gap-1 w-fit">
              <box-icon name="link" color="black"></box-icon>
              <span class="text-black">{{ link }}</span>
            </div>
            <button @click="removeLink(index)" class="items-center justify-center hidden group-hover:flex">
              <box-icon name="x" color="gray"></box-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
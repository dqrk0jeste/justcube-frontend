<script setup lang="ts">
import { ofetch } from 'ofetch'
import { useRoute, useRouter } from 'vue-router'

import { ERROR_MESSAGE, newToastNotification } from '@/composables/useToast'
import { API } from '@/utils/api'

import type { Post } from '@/utils/types'

import PostComp from '@/components/posts/Post.vue'
import PostFooterSinglePost from '@/components/posts/PostFooterSinglePost.vue'

const id = getPostId()
const post = await getPost()

async function getPost() {
  try {
    const post = await ofetch<Post>(API + `/posts/${ id }`)
    return post
  } catch (e: any) {
    const router = useRouter()
    if (e.status === 404) {
      router.replace({
        name: '404',
      })
      return null
    }
    newToastNotification(ERROR_MESSAGE)
    return null
  }
}

function getPostId(): string {
  return useRoute().params.id as string
}

</script>

<template>
  <template v-if="post">
    <div class="h-full overflow-y-auto mb-3">
      <PostComp :post="post">
        <PostFooterSinglePost :id="id" />
      </PostComp>
    </div>
  </template>
</template>
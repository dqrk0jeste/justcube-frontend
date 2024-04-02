<script setup lang="ts">
  import 'boxicons'

  import DefaultLayout from './layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <KeepAlive exclude="UserProfileView,PostView">
            <component :is="Component" />
          </KeepAlive>
          <template #fallback>
            <div class="h-[calc(100dvh-var(--header-height))] text-4xl grid place-items-center">
              Loading...
            </div>
          </template>
        </Suspense>
      </template>
    </RouterView>
  </DefaultLayout>
</template>

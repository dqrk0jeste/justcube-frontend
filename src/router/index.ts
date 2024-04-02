import { createRouter, createWebHistory } from 'vue-router'

import { useTitle } from '@vueuse/core'

function setTitle(title: string) {
  const titleRef = useTitle()
  titleRef.value = `just cube | ${ title }`
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      beforeEnter() {
        setTitle('home')
      }
      
    },
    {
      path: '/posts/:id',
      name: 'posts',
      component: () => import('@/views/PostView.vue'),
      beforeEnter() {
        setTitle('post')
      }
      
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      beforeEnter() {
        setTitle('login')
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue'),
      beforeEnter() {
        setTitle('signup')
      }
   },
    {
      path: '/users/:id',
      name: 'users',
      component: () => import('@/views/UserProfileView.vue'),
      beforeEnter() {
        setTitle('user')
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/NotFoundView.vue'),
      beforeEnter() {
        setTitle('not found')
      }
    }
  ]
})

export default router

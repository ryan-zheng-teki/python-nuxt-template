import { defineNuxtPlugin } from '#app'
import { onError } from '@apollo/client/link/error'
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router'

export default defineNuxtPlugin((nuxtApp) => {
  const userStore = useUserStore()
  const router = useRouter()

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions?.code === 'UNAUTHENTICATED') {
          // Handle token expiration or invalidation
          userStore.logout()
          router.push('/login')
        }
      }
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`)
    }
  })

  nuxtApp.provide('apolloLinkError', errorLink)
})
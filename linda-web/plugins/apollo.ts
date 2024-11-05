import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const httpLink = createHttpLink({
    uri: config.public.graphqlBaseUrl,
  })

  // Using WebSocketLink directly from @apollo/client
  const wsLink = new WebSocketLink({
    uri: config.public.wsBaseUrl,
    options: {
      reconnect: true,
      connectionParams: () => {
        const token = localStorage.getItem('authToken')
        return {
          authorization: token ? `Bearer ${token}` : "",
        }
      },
    },
  })

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('authToken')
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  })

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    authLink.concat(httpLink)
  )

  const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
    },
  })

  nuxtApp.provide('apollo', apolloClient)
})
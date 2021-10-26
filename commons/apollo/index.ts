import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import Cookies from 'js-cookie'

const httpLink = createHttpLink({
  uri: "http://localhost:3000/api/graphql",
  credentials: 'same-origin'
})

const authLink = setContext((_, {headers}) => {
  const token = Cookies.get('Authorization')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkError', networkError)
  }
})

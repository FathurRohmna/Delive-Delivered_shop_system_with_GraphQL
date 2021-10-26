/* eslint-disable import/no-anonymous-default-export */
import { ApolloServer } from 'apollo-server-micro'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { PageConfig } from 'next'
import { applyMiddleware } from 'graphql-middleware'

import { createContext } from '../../graphql/context'
import { schema } from '../../graphql/schema'
import { permissions } from './../../graphql/rules'

const apolloServer = new ApolloServer({
  context: createContext,
  schema: applyMiddleware(schema, permissions),
  playground: true,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()] 
})

const startServer = apolloServer.start()

export default async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer

  await apolloServer.createHandler({
    path: '/api/graphql'
  })(req, res)
}

export const config: PageConfig = {
  api: {
    bodyParser: false
  }
}

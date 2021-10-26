import { shield, rule } from 'graphql-shield'

export const rules = {
  isAuthenticatedUser: rule({ cache: 'contextual' })(
    async (_root, _args, ctx) => {
      return ctx.user.userId !== -1
    }
  ),
  isAdmin: rule({ cache: 'contextual' })(
    async (_root, _args, ctx) => {
      return ctx.user.role === 'ADMIN'
    }
  )
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    getAllUsers: rules.isAdmin,
    getAllOrders: rules.isAdmin,
  },
  Mutation: {
    createOrder: rules.isAuthenticatedUser,
    createProduct: rules.isAuthenticatedUser,
    updateUserRole: rules.isAdmin,
    deleteProduct: rules.isAdmin,
    updateStatusOrder: rules.isAdmin,
  }
})

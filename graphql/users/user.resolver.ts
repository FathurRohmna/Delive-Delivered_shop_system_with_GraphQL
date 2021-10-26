import { extendType, stringArg, nonNull } from 'nexus'

export const userResolver = extendType({
  type: 'Query',
  definition(t) {
    t.field('getAllUsers', {
      type: 'Users',
      async resolve(_root, _args, ctx) {
        try {
          const users = await ctx.userService.findAllUsers()
          
          const result = {
            users: users
          }
          return result
        } catch (error) {
          console.log(error.message);
        }
      }
    })

    t.field('me', {
      type: 'User',
      args: {
        id: nonNull(stringArg())
      },
      async resolve(_root, args, ctx) {
        try {
          const user = await ctx.userService.findUserById(args.id)

          return user
        } catch (error) {
          console.log(error.message);
        }
      }
    })
  }
})

export const userMutationResolver = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateUserRole', {
      type: 'User',
      args: {
        userId: nonNull(stringArg()),
        role: nonNull(stringArg())
      },
      async resolve(_root, args, ctx) {
        try {
          return await ctx.userService.updateUserRole(args)
        } catch (error) {
          console.log(error)
        }
      }
    })
  }
})

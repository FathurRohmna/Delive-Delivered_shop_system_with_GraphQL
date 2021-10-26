import { UserNotFound } from './../../commons/exceptions/user-not-found.exceptions';
import { extendType, nonNull, stringArg, intArg } from 'nexus'
import { compare, hash } from 'bcrypt'
import { ApolloError } from 'apollo-server-errors'

export const authentication = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'SignupResult',
      args: {
        username: nonNull(stringArg()),
        fullName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        phone: nonNull(intArg()),
      },
      async resolve(_, args, ctx) {
        try {

            const validateUser = await ctx.userService.findUserByUniqueEmail(args.email)

            if (validateUser) {
              return Error('User Was Found')
            } else {

              const hashedPassword = await hash(args.password, 10)
              const user = await ctx.userService.create({
                ...args,
                password: hashedPassword
              })

              const accessToken = ctx.authService.generateAccessToken(user)

              return {
                __typename: 'AuthPayload',
                accessToken,
                user
              }
            }
            
        } catch (error) {
          console.log(error.message)
        }
      }
    })

    t.field('login', {
      type: 'LoginResult',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      async resolve(_root, args, ctx) {
        try {
          
          const user = await ctx.userService.findUserByUniqueEmail(args.email)

          if (!user) {
            return Error('User Not Found')
          }

          console.log(user)

          const passwordValid = await compare(args.password, user.password)

          if (!passwordValid) {
            return Error('You input wrong Email/Password')
          }

          const accessToken = ctx.authService.generateAccessToken(user)

          return {
            __typename: 'AuthPayload',
            access: accessToken,
            user
          }
        } catch (error) {
          console.log(error.message)
        }
      }
    })

    t.field('adminLogin', {
      type: 'LoginResult',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      async resolve(_root, args, ctx) {
        try {
          
          const user = await ctx.userService.findUserByUniqueEmail(args.email)

          if (!user) {
            return Error('User Not Found')
          }

          if (user.role !== 'ADMIN') {
            return Error('No Have Permission')
          }

          const passwordValid = await compare(args.password, user.password)

          if (!passwordValid) {
            return Error('You input wrong Email/Password')
          }

          const accessToken = ctx.authService.generateAccessToken(user)

          return {
            __typename: 'AuthPayload',
            access: accessToken,
            user
          }
        } catch (error) {
          console.log(error.message)
        }
      }
    })
  }
})

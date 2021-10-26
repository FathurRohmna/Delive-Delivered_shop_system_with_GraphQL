import { Order } from './../order/order.type';
import { objectType, enumType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('username')
    t.nonNull.string('email')
    t.nonNull.string('fullName')
    t.field('role', {
      type: Role
    })
    t.nonNull.int('phone')
    t.list.field('orderHistory', {
      type: Order
    })
  }
})

export const UsersCount = objectType({
  name: 'UsersCount',
  definition(t) {
    t.int('users_length')
  }
})

export const Users = objectType({
  name: 'Users',
  definition(t) {
    t.list.field('users', {
      type: User
    })
    t.field('count', {
      type: UsersCount,
      async resolve(_root, _args, ctx) {
        try {
          const count = await ctx.userService.usersCount()

          return {
            users_length: count
          }
        } catch (error) {
          console.log(error.message)
        }
      }
    })
  }
})

export const Role = enumType({
  name: 'Role',
  members: ['USER', 'ADMIN']
})

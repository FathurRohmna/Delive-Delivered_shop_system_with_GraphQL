import { extendType, nonNull, arg, stringArg, intArg, objectType, inputObjectType } from 'nexus'

export const orderResolver = extendType({
  type: 'Query',
  definition(t) {
    t.field('getAllOrders', {
      type: 'Orders',
      async resolve(_root, _args, ctx) {
        try {
          const allOrders = await ctx.orderService.getAllOrders()

          const result = {
            orders: allOrders
          }
          return result
        } catch (error) {
          console.log(error.message);
        }
      }
    })
  }
})

export const AddressInputType = inputObjectType({
  name: 'AddressInputType',
  definition(t) {
    t.nonNull.int('zipCode')
    t.nonNull.string('district')
    t.nonNull.string('city')
    t.nonNull.string('county')
    t.nonNull.string('country')
    t.nonNull.string('locationId')
  }
})

export const orderMutationResolver = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createOrder', {
      type: 'Order',
      args: {
        productId: nonNull(stringArg()),
        address: arg({ type: 'AddressInputType' })
      },
      async resolve(_root, args, ctx) {
        try {
          const newOrder = await ctx.orderService.createOrder({
            ...args,
            userId: ctx.user.userId
          })

          return newOrder
        } catch (error) {
          console.log(error)
        }
      }
    })

    t.field('updateStatusOrder', {
      type: 'Order',
      args: {
        orderId: nonNull(stringArg()),
        status: nonNull(stringArg())
      },
      async resolve(_root, args, ctx) {
        try {
          const updateOrder = await ctx.orderService.editOrderStatus(args)
          
          return updateOrder
        } catch (error) {
          console.log(error)
        }
      }
    })
  }
})

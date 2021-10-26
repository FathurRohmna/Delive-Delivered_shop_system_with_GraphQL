import { Address } from './../types';
import { Product } from './../products/product.type';
import { User } from './../users/user.type';
import { objectType } from 'nexus'

export const Order = objectType({
  name: 'Order',
  definition(t) {
    t.string('id')
    t.field('user', {
      type: User,
      async resolve(root, _args, ctx) {
        try {
          const user = await ctx.userService.findUserById(root.userId)

          return user
        } catch (error) {
          console.log(error.message);
        }
      }
    })
    t.string('productId')
    t.field('product', {
      type: Product,
      async resolve(root, _args, ctx) {
        try {
          const product = await ctx.productService.getProductById(root.productId)

          return product
        } catch (error) {
          console.log(error.message);
        }
      }
    })
    t.field('address', {
      type: Address,
      async resolve(root, _args, ctx) {
        try {
          const address = await ctx.orderService.getAddressById(root.addressId)

          return address
        } catch (error) {
          console.log(error.message);
        }
      }
    })
    t.string('status')
  }
})

export const OrdersCount = objectType({
  name: 'OrdersCount',
  definition(t) {
    t.int('orders_length')
  }
})

export const Orders = objectType({
  name: 'Orders',
  definition(t) {
    t.list.field('orders', {
      type: Order
    })
    t.field('count', {
      type: OrdersCount,
      async resolve(_root, _args, ctx) {
        try {
          const count = await ctx.orderService.countOrders()

          return {
            orders_length: count
          }
        } catch (error) {
          console.log(error.message)
        }
      }
    })
  }
})

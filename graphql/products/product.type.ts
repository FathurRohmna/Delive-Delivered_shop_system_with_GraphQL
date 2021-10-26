import { Order } from './../order/order.type';
import { objectType } from 'nexus'

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.string('id')
    t.string('name')
    t.int('price')
    t.string('descrption')
    t.string('imageUrl')
    t.field('_count', {
      type: '_CountOrders'
    })
  }
})

export const _CountOrders = objectType({
  name: '_CountOrders',
  definition(t) {
    t.int('orders')
  }
})

export const CountProduct = objectType({
  name: 'CountProduct',
  definition(t) {
    t.int('product_length')
  }
})

export const ProductDeleted = objectType({
  name: 'ProductDeleted',
  definition(t) {
    t.nonNull.string('message')
  }
})

export const Products = objectType({
  name: 'Products',
  definition(t) {
    t.list.field('items', {
      type: Product
    })
    t.field('count', {
      type: CountProduct,
      async resolve(_root, _args, ctx) {
        try {
          const count = await ctx.productService.countProduct()

          return {
            product_length: count
          }
        } catch (error) {
          console.log(error.message)
        }
      }
    })
  }
})

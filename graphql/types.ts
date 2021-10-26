import { objectType } from 'nexus'

export * from './authentication/authentication.type'
export * from './authentication/authentication.resolver'

export * from './users/user.resolver'
export * from './users/user.type'

export * from './products/product.resolver'
export * from './products/product.type'

export * from './order/order.resolver'
export * from './order/order.type'

export const Address = objectType({
  name: 'Address',
  definition(t) {
    t.string('id')
    t.int('zipCode')
    t.string('district')
    t.string('city')
    t.string('county')
    t.string('country')
    t.string('locationId')
  }
})

export const Shop = objectType({
  name: 'Shop',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('email')
    t.int('phone')
  }
})

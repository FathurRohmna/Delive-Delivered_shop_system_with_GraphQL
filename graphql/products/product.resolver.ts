import { extendType, nonNull, stringArg, intArg } from 'nexus'

export const productResolver = extendType({
  type: 'Query',
  definition(t) {
    t.field('getAllProducts', {
      type: 'Products',
      async resolve(_, _args, ctx) {
        console.log(ctx.user);
        try {
          const allProducts = await ctx.productService.getAllProducts()
          
          const result = {
            items: allProducts
          }

          console.log(ctx.user)

          return result
        } catch (error) {
          console.log(error.message);
        }
      }
    })

    t.field('getProductById', {
      type: 'Product',
      args: {
        id: nonNull(stringArg())
      },
      async resolve(_, args, ctx) {
        try {
          const product = await ctx.productService.getProductById(args.id)

          return product
        } catch (error) {
          
        }
      }
    })
  }
})

export const productMutationResolver = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createProduct', {
      type: 'Product',
      args: {
        name: nonNull(stringArg()),
        price: nonNull(intArg()),
        descrption: nonNull(stringArg()),
        imageUrl: nonNull(stringArg())
      },
      async resolve(_, args, ctx) {
        try {
          const uploadImage = await ctx.cloudinaryv2.uploader.upload(args.imageUrl)

          const newProduct = ctx.productService.createProduct({
            ...args,
            imageUrl: uploadImage.url
          })

          return newProduct
        } catch (error) {
          console.log(error.message);
        }
      }
    })

    t.field('deleteProduct', {
      type: 'ProductDeleted',
      args: {
        productId: nonNull(stringArg())
      },
      async resolve(_, args, ctx) {
        try {
          await ctx.productService.deleteProductById(args.productId)

          return {
            message: 'Product Deleted'
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    })
  }
})

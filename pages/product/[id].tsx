import Image from 'next/image'
import Head from 'next/head'

import { ProductRepository } from '../../graphql/products/product.repository.ts'

const repository = new ProductRepository()

const Product = ({ product }) => {

  return (
    <div className="relative block">
      <Head>
        <meta
          key="twitter:title"
          name="twitter:title"
          content={`${product.name} - Delivered`}
        />
        <meta
          key="og:title"
          property="og:title"
          content={`${product.name} - Delivered`}
        />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content="fathur rohman" />
        <meta key="twitter:description" name="twitter:description" content={`${product.name} - Delivered`} />
        <meta
          key="twitter:image"
          name="twitter:image"
          content={`${product.imageUrl}`}
        />
        <meta key="twitter:creator" name="twitter:creator" content="fathur rohman" />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content={`${product.name} - Delivered`} />
        <meta
          key="og:image"
          property="og:image"
          content={`${product.imageUrl}`}
        />
        <title>{product.name} - Delivered shop system with GraphQL.</title>
      </Head>
      <div className="relative w-full min-h-screen">
        <div className="max-w-3xl mx-auto my-8">
          <div className="pt-24">
            <div className="relative grid grid-cols-2 w-full gap-12 h-full">
              <div className="relative px-4 w-full">
                <Image
                  src={product.imageUrl}
                  width="300"
                  height="300"
                  objectFit="cover"
                  alt="Image"
                />
              </div>
              <div className="py-16 font-serif">
                <h1 className="text-2xl">
                  {product.name}
                </h1>
                <h1 className="text-2xl font-bold">
                  Rp. {product.price}
                </h1>
                <p className="my-4 text-base text-gray-900 leading-6 tracking-normal">{product.descrption}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product

export async function getServerSideProps(context) {
  const id = context.params.id
  const productItem = await repository.findUnique({
    where: {
      id: id
    },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      descrption: true
    }
  })

  return {
    props: {
      product: productItem
    }
  }
}

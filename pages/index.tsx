import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { gql, useQuery } from '@apollo/client'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'

const AllProductsQuery = gql`
  query {
    getAllProducts {
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`

const Home = ({ user }) => {
  const token = Cookies.get('Authorization')

  const { data, loading, error } = useQuery(AllProductsQuery)
  const products = data?.getAllProducts.items

  const router = useRouter()

  const handleBuy = (product) => {
    Cookies.set('productOrder', JSON.stringify(product))
    if (user !== null) {
      router.push('/shipping-payment')
    }
    router.push('/authentication/login') 
  }

  console.log(user)

  return (
    <div className="relative block">
      <Head>
        <meta
          key="twitter:title"
          name="twitter:title"
          content="Delive - Delivered shop system with GraphQL."
        />
        <meta
          key="og:title"
          property="og:title"
          content="Delive - Delivered shop system with GraphQL."
        />
        <title>Delive - Delivered shop system with GraphQL.</title>
      </Head>
      <div className="relative w-full min-h-screen">
        <div className="max-w-4xl mx-auto my-8">
          <div className="pt-12 px-4">
            <div className="relative grid grid-cols-2 w-full gap-12 h-full">
              <div className="py-16 px-4 font-serif">
                <h1 className="mb-4 font-normal text-7xl tracking-tight">
                  <span className="block"><span>Buy</span> More </span>
                  <span className="block"><span>Than</span> You</span>
                </h1>
                <p className="mb-4 text-base text-gray-900 leading-6 tracking-normal">Tempat berbelanja berbagai kebutuhan hidup, kebutuhan rumah tangga, sekolah, ataupun yang lain.</p>
                <div className="flex">
                  <a className="mr-2 py-2 px-4 bg-black font-semibold text-gray-100">Explore Collection</a>
                  <a className="py-2 px-4 bg-black font-semibold text-gray-100">#</a>
                </div>
              </div>
              <div className="w-full h-auto relative">
                <Image src="/assets/im7.jpg" layout="fill" objectFit="cover" alt="Here we goo" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto my-8">
          <div className="pt-24">
            <div className="relative grid grid-cols-2 w-full gap-12 h-full">
              <div className="relative px-4 w-full">
                <Image
                  src="/assets/im6.jpg"
                  width="300"
                  height="300"
                  objectFit="cover"
                  alt="Image"
                />
              </div>
              <div className="py-16 font-serif">
                <h1 className="text-2xl">
                  <span className="block">You Need </span>
                  <span className="block">I get it</span>
                </h1>
                <p className="mb-4 text-base text-gray-900 leading-6 tracking-normal">Dapatkan berbagai barang dengan harga yang terjangkau dan diskon yang melimpah.</p>
                <a className="mr-2 py-2 text-base px-4 bg-black font-normal text-gray-100">Explore More</a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto my-8">
          <div className="pt-24">
            <div className="relative grid grid-cols-2 w-full gap-12 h-full">
              <div className="py-16 font-serif">
                <h1 className="text-2xl">
                  <span className="block">Easy shops </span>
                  <span className="block">New modern Principles</span>
                </h1>
                <p className="mb-4 text-base text-gray-900 leading-6 tracking-normal">Berbelanja dengan cepat dan terpercaya, mengurangi kehilangan waktu anda.</p>
                <a className="mr-2 py-2 text-base px-4 bg-black font-normal text-gray-100">Explore More</a>
              </div>
              <div className="relative w-full">
                <Image
                  src="/assets/melissa-walker-horn-gtDYwUIr9Vg-unsplash.jpg"
                  width="300"
                  height="300"
                  objectFit="cover"
                  alt="Image"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto my-8 font-serif">
          <div className="pt-24">
            <h1 className="text-center mb-8 text-3xl font-bold text-gray-900">Fatured Products</h1>

            <div className="grid grid-cols-3 gap-8 font-sans">
              {products && products.map((product) => (
                <div key={product.id} className="shadow-md w-full mx-auto">
                  <Link href={`/product/${product.id}`}>
                    <a>
                      <div className="relative w-full h-48">
                        <Image layout="fill" src={product.imageUrl} alt={product.name} objectFit="cover" />
                      </div>
                    </a>
                  </Link>
                  <div className="px-3 py-2">
                    <p className="mb-2 text-sm font-bold text-gray-900">
                      {product.name}
                    </p>
                    <p className="mb-2 font-bold text-gray-900">Rp {product.price}</p>
                    <button onClick={() => handleBuy(product)} className="block text-center my-2 w-full bg-black text-white font-semibold px-3 py-2">Beli</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

export async function getServerSideProps(context) {
  const authToken = context.req?.cookies.Authorization
  let user = null

  try {
    if (authToken) {
      const verificationResponse = jwt.verify(authToken, process.env.JWT_SECRET)

      if (verificationResponse) {
        user = jwt.decode(authToken)
      } else {
        user = null
      }
    }
  } catch (error) {
    user = null
  }

  return {
    props: {
      user: user
    }
  }
}

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'

import { gql, useMutation } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'

import Cookies from 'js-cookie'
import axios from 'axios'
import jwt from 'jsonwebtoken'

import { Controllers } from '../components/Controllers'

const CreateOrderMutation = gql`
  mutation(
    $productId: String!
    $address: AddressInputType!
  ) {
    createOrder(
      productId: $productId
      address: $address
    ) {
      productId
    }
  }
`

const Shipping = ({ productOrder }) => {
  const product = Cookies.get('productOrder') 
    ? JSON.parse(Cookies.get('productOrder'))
    : null
  
  const shippingAddress = Cookies.get('shippingAddress')
    ? JSON.parse(Cookies.get('shippingAddress'))
    : null
  
  const [address, setAddress] = useState(shippingAddress)

  const [createOrder] = useMutation(CreateOrderMutation)
  const router = useRouter()

  const onChangeEventAddress = (e:  React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value

    if (value.length >= 1) {
      axios.get('https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json', {
        'params': {
          'query': value,
          'maxresults': 1,
          'apikey': 'lcYb3A46F8CTF8USOSv-GH9d8CjEDfzJI3antMSTc2E',
        }
      }).then(function (response) {
        const address = response.data.suggestions[0].address;
        const id = response.data.suggestions[0].locationId;

        setAddress({ ...address, locationId: id })
      })
    }
  }

  const handleSaveAddress = (e) => {
    e.preventDefault()
    Cookies.set('shippingAddress', JSON.stringify(address))
  }

  const submitHandler = async (productId, addressArg) => {
    const variables = { 
      productId, 
      address: { 
        zipCode: parseInt(addressArg.postalCode),
        district: addressArg.district,
        city: addressArg.city,
        county: addressArg.county,
        country: addressArg.country,
        locationId: addressArg.locationId
      }
    }

    try {
      await toast.promise(createOrder({ variables }), {
        loading: 'Creating new product..',
        success: 'Product successfully created!🎉',
        error: (err) => `Something went wrong 😥 Please try again ${err}`,
      })

      router.push('/')
      Cookies.remove('productOrder')
    } catch (error) {
      console.log(error)
    }
  }

  if (productOrder === null) {
    return (
      <div className="relative block">
        <div className="relative w-full min-h-screen">
          <div className="max-w-7xl mx-auto my-8">
            <h1>No Products Ordered</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative block">
      <Head>
        <title>Shipping Payment - Deliver.</title>
      </Head>
      <div className="relative w-full min-h-screen">
        <Toaster />
        <div className="max-w-7xl mx-auto my-8">
          <div className="grid w-full grid-cols-3 gap-8">
            <div className="col-span-2 px-4 h-full">
              <h1 className="text-xl font-semibold text-gray-700 mb-8">Add Shipping Address</h1>
              <form onSubmit={handleSaveAddress} className="flex flex-col justify-between h-full">
                <div className="">
                  <Controllers.InputText
                    name="address"
                    id="Address"
                    label="Address"
                    small
                    placeholder="exp. Kawunganten Cilacap Jawa Tengah Indonesia"
                    required
                    value={shippingAddress?.district || ''}
                    onChange={onChangeEventAddress}
                  />
                  <div className="grid w-full grid-cols-2 mt-4 gap-4 text-gray-400">
                    <Controllers.InputText
                      name="street"
                      id="Street"
                      placeholder="Street"
                      readOnly
                      small
                      value={shippingAddress?.district || ''}
                      required
                    />
                    <Controllers.InputText
                      name="zipCode"
                      id="Zip Code"
                      readOnly
                      small
                      placeholder="Zip Code"
                      value={shippingAddress?.postalCode || ''}
                      required
                    />             
                    <Controllers.InputText
                      name="city"
                      id="City"
                      placeholder="City"
                      readOnly
                      small
                      value={shippingAddress?.city || ''}
                      required
                    />
                    <Controllers.InputText
                      name="state"
                      id="State"
                      readOnly
                      small
                      placeholder="State"
                      value={shippingAddress?.county || ''}
                      required
                    />
                    <Controllers.InputText
                      name="country"
                      id="Country"
                      placeholder="Country"
                      readOnly
                      small
                      value={shippingAddress?.country || ''}
                      required
                    />
                    <Controllers.InputText
                      name="locationId"
                      id="LocationId"
                      placeholder="LocationId"
                      readOnly
                      small
                      value={shippingAddress?.locationId || ''}
                      required
                    />
                  </div>
                </div>
                <div className="my-4 w-full">
                  <button type="submit" className="text-white w-full font-semibold px-4 py-4 text-center bg-green-700">Save and Deliver Here</button>
                </div>
              </form>
            </div>
            <div className="px-4 h-full">
              <h1 className="text-xl font-normal text-gray-600 mb-8">Delivery Summary</h1>
              {product && <div className="w-full h-full flex flex-col justify-between">
                <div className="flex flex-row">
                  <div className="relative">
                    <Image
                      src={product.imageUrl}
                      width="80"
                      height="80"
                      objectFit="cover"
                      alt="Image"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">{product.name}</p>
                    <p className="font-semibold">Rp. {product.price}</p>
                  </div>
                </div>
                <div className="my-4 w-full">
                  <button onClick={() => submitHandler(product.id, address)} className="text-white w-full font-semibold px-4 py-4 text-center bg-red-700">Place Order</button>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shipping

export async function getServerSideProps(context) {
  const productOrder = context.req?.cookies.productOrder

  return {
    props: {
      productOrder: productOrder || null
    }
  }
}

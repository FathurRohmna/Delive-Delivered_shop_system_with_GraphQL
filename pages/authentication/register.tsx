import { useState } from 'react'
import Router, { useRouter } from 'next/router'
import Head from 'next/head'

import { gql, useMutation } from '@apollo/client'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'

import Link from 'next/link'

import { useForm } from '../../components/CustomHook/useForm'
import AuthPrivateRouter from '../../components/AuthPrivateRouter'

const initialOfValues = {
  username: '',
  fullName: '',
  password: '',
  email: '',
  phone: 0
}

const RegisterMutation = gql`
  mutation(
    $username: String!
    $email: String!
    $fullName: String!
    $password: String!
    $phone: Int!
  ) {
    signup(
      username: $username
      email: $email
      fullName: $fullName
      password: $password
      phone: $phone
    ) {
      ... on AuthPayload {
        access {
          accessToken
          refreshToken
        }
      }
    }
  }
`

const Register = () => {
  const {
    values,
    setValues,
    resetForm,
    handleInputChange
  } = useForm(initialOfValues)

  const [register] = useMutation(RegisterMutation)
  const router = useRouter()
  const [error, setError] = useState(null)

  const submitHandler = async (data) => {
    const { username, email, fullName, password, phone } = data
    const variables = { username, email, fullName, password, phone: parseInt(phone) }
    
    try {
      const access = await register({ variables })
      console.log(access)

      Cookies.set('Authorization', access.data.signup.access.accessToken, { expires: 60 * 60 * 24 * 7 })
      Cookies.set('RefreshToken', access.data.signup.access.refreshToken, { expires: 60 * 60 * 24 * 7 })
      router.push('/')
    } catch (error) {
      setError(error.message)
    }
  }

  const onSubmit = e => {
    e.preventDefault()
    setError(null)
    submitHandler(values)
  }

  return (
    <div className="block relative">
      <Head>
        <title>Register - Delivered</title>
      </Head>
      <div className="relative w-full max-h-screen">
        <div className="max-w-md h-full mx-auto my-10">
          <div className="w-full p-8 shadow-md">
            <h1 className="text-center text-2xl font-semibold text-gray-900">Create your account</h1>
            {error && <h1 className="text-red-700">{error}</h1>}
            <div className="my-8">
              <form onSubmit={onSubmit}>
                <div className="w-full grid grid-cols-2 gap-4">
                  <div className="w-full my-2">
                    <p className="text-base font-semibold mb-2">Fullname</p>
                    <input 
                      type="text"
                      name="fullName"
                      placeholder="Fullname"
                      required
                      className="w-full px-5 py-4 focus:outline-none border rounded-md border-gray-700"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-full my-2">
                    <p className="text-base font-semibold mb-2">Username</p>
                    <input 
                      type="text" 
                      name="username"
                      placeholder="Username"
                      required
                      className="w-full px-5 py-4 focus:outline-none border rounded-md border-gray-700"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full my-2">
                    <p className="text-base font-semibold mb-2">Password</p>
                    <input 
                      name="password"
                      type="password" 
                      placeholder="Password"
                      required
                      className="w-full px-5 py-4 focus:outline-none border rounded-md border-gray-700"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-center text-gray-600">- Contact -</p>
                  </div>
                  <div className="w-full my-2">
                    <p className="text-base font-semibold mb-2">Email</p>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email" 
                      required
                      className="w-full px-5 py-4 focus:outline-none border rounded-md border-gray-700"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-full my-2">
                    <p className="text-base font-semibold mb-2">Phone</p>
                    <input 
                      type="number" 
                      name="phone"
                      placeholder="Phone" 
                      required
                      className="w-full px-5 py-4 focus:outline-none border rounded-md border-gray-700"
                      onChange={handleInputChange}
                    />
                  </div>
                <div className="my-4">
                  <button type="submit" className="text-white w-full font-semibold px-4 py-4 text-center bg-black">Login</button>
                </div>
              </form>
            </div>
            <div className="mb-4">
              <h1 className="text-center text-md text-gray-600">Have an account registered ? <Link href="/authentication/login"><a className="underline text-blue-600">Login</a></Link></h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPrivateRouter(Register)


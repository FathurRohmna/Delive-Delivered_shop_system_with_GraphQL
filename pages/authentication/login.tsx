import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { gql, useMutation } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'
import Cookies from 'js-cookie'

import Link from 'next/link'

import { useForm } from '../../components/CustomHook/useForm'
import AuthPrivateRouter from '../../components/AuthPrivateRouter'

const initialOfValues = {
  email: '',
  password: ''
}

const LoginMutation = gql`
  mutation(
    $email: String!
    $password: String!
  ) {
    login(
      email: $email
      password: $password
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

const Login = () => {
  const {
    values,
    setValues,
    resetForm,
    handleInputChange
  } = useForm(initialOfValues)
  
  const [login] = useMutation(LoginMutation)
  const router = useRouter()
  const [error, setError] = useState(null)

  const submitHandler = async (data) => {
    const { email, password } = data
    const variables = { email, password }

    try {
      const access = await login({ variables })

      if (access.data.adminLogin === null) {
        setError('User not found and registered')
      } else {
        Cookies.set('Authorization', access.data.login.access.accessToken, { expires: 60 * 60 * 24 * 7 })
        Cookies.set('RefreshToken', access.data.login.access.refreshToken, { expires: 60 * 60 * 24 * 7 })
      }

      const productOrder = Cookies.get('productOrder')
      if (productOrder) {
        router.push('/shipping-payment')
      } else {
        router.push('/')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const onSubmit = e => {
    e.preventDefault()
    submitHandler(values)
  }

  return (
    <div className="block relative">
      <Head>
        <title>Login - Delivered</title>
      </Head>
      <div className="relative w-full max-h-screen">
        <div className="max-w-sm h-full mx-auto my-10">
          <div className="w-full p-8 shadow-lg">
            <h1 className="text-center text-2xl font-semibold text-gray-900">Welcome Back</h1>
            {error && <h1 className="text-red-700">{error}</h1>}
            <div className="my-8">
              <form onSubmit={onSubmit}>
                <div className="my-4 w-full">
                  <p className="text-base font-semibold mb-2">Email</p>
                  <input
                    name="email"
                    type="text"
                    required
                    placeholder="Email" 
                    className="w-full px-5 py-4 focus:outline-none border rounded-md border-gray-700"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="my-4 w-full">
                  <p className="text-base font-semibold mb-2">Password</p>
                  <input
                    name="password"
                    type="text" 
                    required
                    placeholder="Password" 
                    className="w-full px-5 py-4 focus:outline-none border rounded-md border-gray-700"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="my-4 w-full">
                  <button type="submit" className="text-white w-full font-semibold px-4 py-4 text-center bg-black">Login</button>
                </div>
              </form>
            </div>
            <div className="mb-4">
              <h1 className="text-center text-md text-gray-600">Doest not have account ? <Link href="/authentication/register"><a className="underline text-blue-600">Register</a></Link></h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPrivateRouter(Login)
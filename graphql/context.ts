import { OrderService } from './order/order.service'
import { ProductService } from './products/product.service'
import { UserService } from './users/user.service'
import { AuthService } from './authentication/authentication.service'

import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import * as cloudinary from 'cloudinary'

const productService = new ProductService()
const userService = new UserService()
const orderService = new OrderService()
const authService = new AuthService()

const cloudinaryv2 = cloudinary.v2

export interface Token {
  userId: number
  email: string
  role: string
  type: string
  timestamp: number
}

interface user {
  userId: string
  email: string
  role: number
}

cloudinaryv2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const createContext = (ctx: any) => {
  let user: user
  const SECRET = process.env.JWT_SECRET

  try {
    let Authorization = ''
    try {
      Authorization = ctx.req.headers.authorization
    } catch (error) {
      Authorization = ctx?.connection?.context?.Authorization
    }
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, SECRET) as Token

    if (!verifiedToken.userId) 
      user = -1
    else 
      user = verifiedToken
  } catch (error) {
    user = -1
  }

  return {
    authService,
    userService,
    productService,
    orderService,
    user,
    cloudinaryv2
  }
}

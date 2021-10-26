/* eslint-disable import/no-anonymous-default-export */
import Router from 'next/router'

import jwt from 'jsonwebtoken'

const adminAuth = '/authentication/admin-authentication'
const home = '/'

export default WrapperComponent => {
  const hocComponent = ({ ...props }) => <WrapperComponent {...props} />

  hocComponent.getInitialProps = async (context) => {
    const authToken = await context.req?.cookies.Authorization

    if (!authToken) {
      if (context.res) {
        context.res?.writeHead(302, {
          Location: home
        })
        context.res?.end()
      } else {
        Router.replace(home)
      }
    }

    const verificationJwt = jwt.verify(authToken, process.env.JWT_SECRET)
    const user = jwt.decode(authToken)

    if (!verificationJwt || user.role !== 'ADMIN') {
      if (context.res) {
        context.res?.writeHead(302, {
          Location: adminAuth
        })
        context.res?.end()
      } else {
        Router.replace(adminAuth)
      }
    } else if (WrapperComponent.getInitialProps) {
      const wrappedProps = await WrapperComponent.getInitialProps({...context})

      return { ...wrappedProps, user }
    }

    return { user }
  }

  return hocComponent
}

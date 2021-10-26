/* eslint-disable import/no-anonymous-default-export */
import Router from 'next/router'
const home = '/'

export default WrapperComponent => {
  const hocComponent = ({ ...props }) => <WrapperComponent {...props} />

  hocComponent.getInitialProps = async (context) => {
    const authToken = await context.req?.cookies.Authorization
    let user = null

    if (authToken) {
      if (context.res) {
        context.res?.writeHead(302, {
          Location: home
        })
        context.res?.end()
      } else {
        Router.replace(home)
      }
    } else if (WrapperComponent.getInitialProps) {
      const wrappedProps = await WrapperComponent.getInitialProps({...context})

      return { ...wrappedProps }
    }

    return { user }
  }

  return hocComponent
}

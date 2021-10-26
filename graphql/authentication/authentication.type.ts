import { objectType, unionType } from 'nexus'

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.field('access', { type: 'Token' })
    t.field('user', { type: 'User' })
  }
})

export const Token = objectType({
  name: 'Token',
  definition(t) {
    t.string('accessToken')
    t.string('refreshToken')
    t.string('accessTokenExpiresAt')
    t.string('refreshTokenExpiresAt')
  }
})

export const UserAlreadyExistsError = objectType({
  name: 'UserAlreadyExists',
  definition(t) {
    t.nonNull.string('message')
  }
})

export const InvalidUserError = objectType({
  name: 'InvalidUser',
  definition(t) {
    t.nonNull.string('message')
  },
})

export const LoginResult = unionType({
  name: 'LoginResult',
  definition(t) {
    t.members('AuthPayload', 'InvalidUser')
  },
  resolveType(t) {
    return t.__typename
  }
})

export const SignupResult = unionType({
  name: 'SignupResult',
  definition(t) {
    t.members('AuthPayload', 'UserAlreadyExists')
  },
  resolveType(t) {
    return t.__typename
  }
})

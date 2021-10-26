import { UserTokenPayloadDTO } from './interfaces/user-tokenpayload';
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export class AuthService {
  private jwtService = jwt

  async generateAccessToken(user: UserTokenPayloadDTO) {
    const date = new Date()
    const SECRET = process.env.JWT_SECRET

    const accessTokenExpiresIn = 18 * 3600 * 1000
    const refreshTokenExpiresIn = 30 * 24 * 3600 * 1000

    const payload = { userId: user.id, email: user.email, role: user.role }
    const refreshId = payload.userId + SECRET
    const salt = crypto.createSecretKey(crypto.randomBytes(16))
    const hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64')

    payload.refreshKey = salt.export()

    return {
      accessToken: await this.jwtService.sign(payload, SECRET, {
        expiresIn: accessTokenExpiresIn / 1000,
      }),
      refreshToken: hash,
      accessTokenExpiresAt: date.getTime() + accessTokenExpiresIn,
      refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn,
    }
  }
}

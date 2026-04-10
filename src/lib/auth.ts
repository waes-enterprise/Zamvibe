import { pbkdf2, randomBytes, timingSafeEqual } from 'crypto'
import { SignJWT, jwtVerify } from 'jose'
import { promisify } from 'util'

const pbkdf2Async = promisify(pbkdf2) as (
  password: string | Buffer,
  salt: string | Buffer,
  iterations: number,
  keylen: number,
  digest: string
) => Promise<Buffer>

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'housemate-zm-secret-key-change-in-production'
)

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await pbkdf2Async(password, salt, 10000, 64, 'sha512')
  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':')
  if (!salt || !key) return false
  const derivedKey = await pbkdf2Async(password, salt, 10000, 64, 'sha512')
  try {
    return timingSafeEqual(derivedKey, Buffer.from(key, 'hex'))
  } catch {
    return false
  }
}

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    }
  } catch {
    return null
  }
}

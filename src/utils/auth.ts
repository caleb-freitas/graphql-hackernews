import * as jwt from "jsonwebtoken"

export const JWT_SECRET = "754037e7be8f61cbb1b85ab46c7da77d"

export interface AuthTokenPayload {
  userId: number
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  const token = authHeader.replace("Bearer ", "")
  if (!token) {
    throw new Error("No token found")
  }
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
}
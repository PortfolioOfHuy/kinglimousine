import { SignJWT, jwtVerify } from "jose";

export type AdminSessionPayload = {
  userId: number;
  name: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function signAdminToken(payload: AdminSessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey);
  return payload as unknown as AdminSessionPayload;
}

  import jwt from 'jsonwebtoken';
import type { ITokenPayload, IRefreshTokenPayload } from '../interfaces/usuario.ts';
import { decode } from 'punycode';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secret_super_seguro_aqui';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'tu_refresh_secret_diferente';
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || '7d';
console.log("JWT_SECRET:", JWT_SECRET);
console.log("JWT_EXPIRE:", JWT_EXPIRE);

export const jwtUtils = {
  generateToken(payload: ITokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  },

  generateRefreshToken(payload: IRefreshTokenPayload): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE });
  },

  verifyToken(token: string): ITokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as ITokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  },

  verifyRefreshToken(token: string): IRefreshTokenPayload | null {
    try {
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as IRefreshTokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  },

  decodeToken(token: string): ITokenPayload | null {
    try {
      const decoded = jwt.decode(token) as ITokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  },
};

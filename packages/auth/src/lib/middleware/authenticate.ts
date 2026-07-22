import { RequestHandler } from 'express';
import { createUnauthorizedError } from '@inithium/types';
import { verifyToken } from '../jwt/jwt.js';
import { AuthenticatedRequestUser } from '../types/types.js';

export const createAuthenticateMiddleware = (secret: string): RequestHandler => {
  return (req, res, next) => {
    const token = req.cookies?.['access_token'];

    if (!token) {
      res.status(401).json({ success: false, error: createUnauthorizedError('Authentication required') });
      return;
    }

    const result = verifyToken(token, secret);

    result.match(
      (payload) => {
        const user: AuthenticatedRequestUser = { id: payload.sub, email: payload.email, role: payload.role };
        req.user = user;
        next();
      },
      (error) => {
        res.status(401).json({ success: false, error });
      }
    );
  };
};

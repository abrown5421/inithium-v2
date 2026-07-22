import jwt, { SignOptions } from 'jsonwebtoken';
import { Result, ok, err } from 'neverthrow';
import { AppError, createUnauthorizedError } from '@inithium/types';
import { JwtPayload } from '../types/types.js';

export const signAccessToken = (payload: JwtPayload, secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const signRefreshToken = (payload: JwtPayload, secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string, secret: string): Result<JwtPayload, AppError> => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return ok(decoded);
  } catch {
    return err(createUnauthorizedError('Invalid or expired token'));
  }
};

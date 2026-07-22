import { Response } from 'express';

export interface CookieConfig {
  readonly secure: boolean;
  readonly domain?: string;
}

const ACCESS_TOKEN_MAX_AGE_MS = 1000 * 60 * 15;
const REFRESH_TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string, config: CookieConfig): void => {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: config.secure,
    sameSite: config.secure ? 'none' : 'lax',
    domain: config.domain,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: config.secure,
    sameSite: config.secure ? 'none' : 'lax',
    domain: config.domain,
    path: '/auth/refresh',
    maxAge: REFRESH_TOKEN_MAX_AGE_MS
  });
};

export const clearAuthCookies = (res: Response, config: CookieConfig): void => {
  res.clearCookie('access_token', { domain: config.domain });
  res.clearCookie('refresh_token', { domain: config.domain, path: '/auth/refresh' });
};

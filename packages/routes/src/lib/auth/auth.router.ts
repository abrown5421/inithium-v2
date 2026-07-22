import { Router, Request, Response, RequestHandler } from 'express';
import { handleResult } from '@inithium/crud-engine';
import { createUnauthorizedError } from '@inithium/types';
import { UserService } from '@inithium/services';
import { signAccessToken, signRefreshToken, verifyToken, setAuthCookies, clearAuthCookies, JwtPayload } from '@inithium/auth';

export interface AuthRouterConfig {
  readonly accessSecret: string;
  readonly accessExpiry: string;
  readonly refreshSecret: string;
  readonly refreshExpiry: string;
  readonly cookieSecure: boolean;
  readonly cookieDomain?: string;
  readonly authenticate: RequestHandler;
}

export const createAuthRouter = (userService: UserService, config: AuthRouterConfig): Router => {
  const router = Router();

  const issueTokens = (res: Response, payload: JwtPayload): void => {
    const accessToken = signAccessToken(payload, config.accessSecret, config.accessExpiry);
    const refreshToken = signRefreshToken(payload, config.refreshSecret, config.refreshExpiry);
    setAuthCookies(res, accessToken, refreshToken, { secure: config.cookieSecure, domain: config.cookieDomain });
  };

  router.post('/register', async (req: Request, res: Response) => {
    const result = await userService.register(req.body);
    if (result.isOk()) {
      issueTokens(res, { sub: result.value._id, email: result.value.email, role: result.value.role });
    }
    handleResult(res, result, 201);
  });

  router.post('/login', async (req: Request, res: Response) => {
    const result = await userService.login(req.body);
    if (result.isOk()) {
      issueTokens(res, { sub: result.value._id, email: result.value.email, role: result.value.role });
    }
    handleResult(res, result);
  });

  router.post('/refresh', (req: Request, res: Response) => {
    const token = req.cookies?.['refresh_token'];
    if (!token) {
      res.status(401).json({ success: false, error: createUnauthorizedError('Refresh token missing') });
      return;
    }
    const result = verifyToken(token, config.refreshSecret);
    if (result.isOk()) {
      const { sub, email, role } = result.value;
      issueTokens(res, { sub, email, role });
    }
    handleResult(res, result.map(() => ({ refreshed: true })));
  });

  router.post('/logout', (req: Request, res: Response) => {
    clearAuthCookies(res, { secure: config.cookieSecure, domain: config.cookieDomain });
    res.status(200).json({ success: true, data: { loggedOut: true } });
  });

  router.get('/me', config.authenticate, (req: Request, res: Response) => {
    res.status(200).json({ success: true, data: req.user });
  });

  return router;
};

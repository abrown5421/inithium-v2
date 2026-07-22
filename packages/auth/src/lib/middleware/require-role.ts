import { RequestHandler } from 'express';
import { UserRole, createUnauthorizedError, createForbiddenError } from '@inithium/types';

export const createRequireRoleMiddleware = (allowedRoles: readonly UserRole[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ success: false, error: createUnauthorizedError('Authentication required') });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: createForbiddenError('Insufficient permissions') });
      return;
    }

    next();
  };
};

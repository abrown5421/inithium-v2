import type { Socket } from 'socket.io';
import type { AuthMiddleware, AuthenticatedIdentity, HandshakeContext } from '../types/identity.js';

export const buildHandshakeContext = (socket: Socket): HandshakeContext => ({
  auth: socket.handshake.auth ?? {},
  headers: socket.handshake.headers ?? {},
  query: socket.handshake.query ?? {}
});

export const createConnectionAuthenticator = <TIdentity extends AuthenticatedIdentity>(
  authenticate: AuthMiddleware<TIdentity>
) => {
  return async (socket: Socket, next: (err?: Error) => void): Promise<void> => {
    const context = buildHandshakeContext(socket);
    const result = await authenticate(context);

    result.match(
      (identity) => {
        socket.data.identity = identity;
        next();
      },
      (error) => {
        next(new Error(error.message));
      }
    );
  };
};

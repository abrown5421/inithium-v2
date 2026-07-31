import type { Server as HttpServer } from 'node:http';
import type { CorsOptions } from 'cors';
import { err } from 'neverthrow';
import { createUnauthorizedError } from '@inithium/types';
import { verifyToken, type JwtPayload } from '@inithium/auth';
import {
  createPubSubServer,
  roomChannel,
  type AuthenticatedIdentity,
  type EventRegistry,
  type EventPayloadMap,
  type PubSubServer
} from '@inithium/pubsub/server';

export interface ApiIdentity extends AuthenticatedIdentity {
  readonly email: string;
  readonly role: JwtPayload['role'];
}

interface ApiServerToClientEvents extends EventPayloadMap {
  readonly 'server:welcome': { readonly message: string; readonly socketId: string };
  readonly pong: { readonly echo: unknown; readonly at: number };
  readonly 'chat:message': { readonly from: string; readonly message: unknown; readonly at: number };
  readonly 'room:update': { readonly roomId: string; readonly memberCount: number };
}

interface ApiClientToServerEvents extends EventPayloadMap {
  readonly ping: unknown;
  readonly 'chat:send': { readonly message?: unknown };
  readonly 'room:join': { readonly roomId?: string };
}

export type ApiPubSubEvents = EventRegistry<ApiServerToClientEvents, ApiClientToServerEvents, EventPayloadMap>;

const parseCookieHeader = (header: string | undefined): Record<string, string> =>
  (header ?? '').split(';').reduce<Record<string, string>>((cookies, pair) => {
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex === -1) return cookies;

    const key = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();
    if (key.length > 0) cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});

export interface CreateApiPubSubServerOptions {
  readonly httpServer: HttpServer;
  readonly jwtAccessSecret: string;
  readonly cors: CorsOptions;
}

export const createApiPubSubServer = (options: CreateApiPubSubServerOptions): PubSubServer<ApiPubSubEvents, ApiIdentity> => {
  const server = createPubSubServer<ApiPubSubEvents, ApiIdentity>({
    httpServer: options.httpServer,
    socketIoOptions: { cors: options.cors },
    authenticate: (context) => {
      const cookieHeader = context.headers['cookie'];
      const rawCookieHeader = Array.isArray(cookieHeader) ? cookieHeader[0] : cookieHeader;
      const token = parseCookieHeader(rawCookieHeader)['access_token'];

      if (!token) {
        return err(createUnauthorizedError('Missing access_token cookie on the socket handshake'));
      }

      return verifyToken(token, options.jwtAccessSecret).map((payload) => ({
        userId: payload.sub,
        email: payload.email,
        role: payload.role
      }));
    }
  });

  server.onConnect((client) => {
    client.emit('server:welcome', { message: `Welcome, ${client.identity.email}!`, socketId: client.id });

    client.on('ping', async (payload) => {
      await server.unicast(client.identity.userId, 'pong', { echo: payload ?? null, at: Date.now() });
    });

    client.on('chat:send', async (payload) => {
      await server.broadcast('chat:message', { from: client.identity.userId, message: payload?.message, at: Date.now() });
    });

    client.on('room:join', async (payload) => {
      const roomId = payload?.roomId ?? 'lobby';
      await client.join(roomChannel(roomId));
      const memberCount = await server.state.update<number>(`room:${roomId}:count`, (current) => (current ?? 0) + 1);
      await server.toChannel(roomChannel(roomId), 'room:update', { roomId, memberCount });
    });
  });

  return server;
};

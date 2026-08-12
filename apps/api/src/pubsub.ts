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
import type {
  PresenceChangedPayload,
  PresenceClientToServerEvents,
  PresenceServerToClientEvents,
  PresenceStatus
} from '@inithium/presence';

export interface ApiIdentity extends AuthenticatedIdentity {
  readonly email: string;
  readonly role: JwtPayload['role'];
}

interface ApiServerToClientEvents extends EventPayloadMap, PresenceServerToClientEvents {
  readonly 'server:welcome': { readonly message: string; readonly socketId: string };
  readonly pong: { readonly echo: unknown; readonly at: number };
  readonly 'chat:message': { readonly from: string; readonly message: unknown; readonly at: number };
  readonly 'room:update': { readonly roomId: string; readonly memberCount: number };
}

interface ApiClientToServerEvents extends EventPayloadMap, PresenceClientToServerEvents {
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

interface PresenceEntry {
  readonly status: PresenceStatus;
  readonly socketCount: number;
}

interface PresenceTracker {
  readonly connect: (userId: string) => PresenceChangedPayload | undefined;
  readonly disconnect: (userId: string) => PresenceChangedPayload | undefined;
  readonly setStatus: (userId: string, status: PresenceStatus) => PresenceChangedPayload;
  readonly snapshot: () => readonly PresenceChangedPayload[];
}

const createPresenceTracker = (): PresenceTracker => {
  const entries = new Map<string, PresenceEntry>();

  const connect: PresenceTracker['connect'] = (userId) => {
    const existing = entries.get(userId) ?? { status: 'offline' as const, socketCount: 0 };
    const isFirstConnection = existing.socketCount === 0;
    const status: PresenceStatus = isFirstConnection ? 'online' : existing.status;
    entries.set(userId, { status, socketCount: existing.socketCount + 1 });
    return isFirstConnection ? { userId, status, at: Date.now() } : undefined;
  };

  const disconnect: PresenceTracker['disconnect'] = (userId) => {
    const existing = entries.get(userId);
    if (!existing) return undefined;

    const socketCount = Math.max(existing.socketCount - 1, 0);
    const status: PresenceStatus = socketCount === 0 ? 'offline' : existing.status;
    entries.set(userId, { status, socketCount });
    return socketCount === 0 ? { userId, status, at: Date.now() } : undefined;
  };

  const setStatus: PresenceTracker['setStatus'] = (userId, status) => {
    const existing = entries.get(userId) ?? { status: 'offline' as const, socketCount: 1 };
    entries.set(userId, { ...existing, status });
    return { userId, status, at: Date.now() };
  };

  const snapshot: PresenceTracker['snapshot'] = () =>
    Array.from(entries.entries())
      .filter(([, entry]) => entry.socketCount > 0)
      .map(([userId, entry]) => ({ userId, status: entry.status, at: Date.now() }));

  return { connect, disconnect, setStatus, snapshot };
};

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

  const presence = createPresenceTracker();

  server.onConnect((client) => {
    client.emit('server:welcome', { message: `Welcome, ${client.identity.email}!`, socketId: client.id });

    const connectedChange = presence.connect(client.identity.userId);
    if (connectedChange) {
      void server.broadcast('presence:changed', connectedChange);
    }

    client.on('presence:update', async (payload) => {
      const change = presence.setStatus(client.identity.userId, payload.status);
      await server.broadcast('presence:changed', change);
    });

    client.on('presence:request-snapshot', async () => {
      await server.unicast(client.identity.userId, 'presence:snapshot', { entries: presence.snapshot() });
    });

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

  server.onDisconnect((client) => {
    const disconnectedChange = presence.disconnect(client.identity.userId);
    if (disconnectedChange) {
      void server.broadcast('presence:changed', disconnectedChange);
    }
  });

  return server;
};

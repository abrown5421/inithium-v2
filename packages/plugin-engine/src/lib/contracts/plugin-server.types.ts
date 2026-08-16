import type { Db } from 'mongodb';
import type { Router, RequestHandler } from 'express';
import type { ResultAsync } from 'neverthrow';
import type { AppError, UserRole } from '@inithium/types';
import type { CrudService } from '@inithium/crud-engine';
import type { Page, Setting } from '@inithium/models';
import type { CreatePageDTO, UpdatePageDTO, CreateSettingDTO, UpdateSettingDTO } from '@inithium/validators';
import type { PubSubServer } from '@inithium/pubsub/server';
import type { EventRegistry, AuthenticatedIdentity } from '@inithium/pubsub';
import type { NotificationPublisher } from '@inithium/notifications';
import type { PluginMeta } from './plugin-meta.types.js';

/** The untyped pub/sub handle every plugin receives; narrow it with `createPluginPubSubHandle<TEvents>()`. */
export type PluginPubSubHandle = PubSubServer<EventRegistry, AuthenticatedIdentity>;

export interface PluginServerContext {
  readonly db: Db;
  readonly authenticate: RequestHandler;
  readonly requireRole: (roles: readonly UserRole[]) => RequestHandler;
  readonly pageService: CrudService<Page, CreatePageDTO, UpdatePageDTO>;
  readonly settingService: CrudService<Setting, CreateSettingDTO, UpdateSettingDTO>;
  readonly pubsub: PluginPubSubHandle;
  /** Lets a plugin push a persisted, real-time notification into a user's notification center. */
  readonly notifications: NotificationPublisher;
}

/** Returned by `onServerInit` for anything a plugin attached to a live object (e.g. a pubsub subscription). */
export type PluginTeardown = () => ResultAsync<void, AppError> | void;

export interface PluginServerRouterContribution {
  readonly path: string;
  /**
   * Built lazily with the full `PluginServerContext` (including `pubsub`, which only exists once
   * the HTTP/pubsub servers are up) — router mounting happens after that context is constructed,
   * while `path` stays static so collision detection can run at registration time.
   */
  readonly createRouter: (ctx: PluginServerContext) => Router;
}

export interface PluginServerModule extends PluginMeta {
  readonly routers?: readonly PluginServerRouterContribution[];
  readonly onUserRegistered?: (userId: string) => void;
  /** The only place side effects happen: index creation, Page-doc seeding, pubsub subscriptions. */
  readonly onServerInit?: (ctx: PluginServerContext) => ResultAsync<PluginTeardown | void, AppError>;
}

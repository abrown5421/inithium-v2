import { ensureIndex } from '@inithium/db';
import { defineServerPlugin } from '@inithium/plugin-engine/server';
import { FRIENDS_PLUGIN_META } from './index.js';
import { FRIENDSHIPS_COLLECTION } from './lib/friendship.model.js';
import { createFriendsRouter } from './lib/friendship.router.js';
import { friendsNotificationChannel } from './lib/friends-events.js';

export default defineServerPlugin({
  ...FRIENDS_PLUGIN_META,
  routers: [{ path: '/friends', createRouter: createFriendsRouter }],
  onServerInit: (ctx) =>
    ensureIndex(ctx.db, FRIENDSHIPS_COLLECTION, { requesterId: 1, recipientId: 1 }, { unique: true })
      .andThen(() => ensureIndex(ctx.db, FRIENDSHIPS_COLLECTION, { requesterId: 1 }))
      .andThen(() => ensureIndex(ctx.db, FRIENDSHIPS_COLLECTION, { recipientId: 1 }))
      .map(() =>
        ctx.pubsub.onConnect((client) => {
          void client.join(friendsNotificationChannel(client.identity.userId));
        })
      )
});

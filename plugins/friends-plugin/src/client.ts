import { Users } from 'lucide-react';
import { defineClientPlugin } from '@inithium/plugin-engine/client';
import { FRIENDS_PLUGIN_META } from './index.js';
import { FriendsProfileTab } from './lib/client/friends-profile-tab.js';
import { FriendsNotificationsBackground } from './lib/client/friends-notifications-background.js';

export default defineClientPlugin({
  ...FRIENDS_PLUGIN_META,
  profileTabs: [{ id: 'friends', label: 'Friends', icon: Users, component: FriendsProfileTab, enabled: () => true }],
  backgroundComponents: [FriendsNotificationsBackground]
});

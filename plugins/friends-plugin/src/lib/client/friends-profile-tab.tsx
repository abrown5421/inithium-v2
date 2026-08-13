import * as React from 'react';
import { Button } from '@inithium/ui';
import type { ProfileTabContext } from '@inithium/plugin-engine/client';
import { SearchAndAddFriendsView } from './search-and-add-view.js';
import { PendingRequestsView } from './pending-requests-view.js';
import { FriendsListView } from './friends-list-view.js';
import { MutualFriendsView } from './mutual-friends-view.js';

interface FriendsSidebarView {
  readonly key: string;
  readonly label: string;
  readonly render: () => React.ReactNode;
}

const buildOwnedViews = (userId: string): readonly FriendsSidebarView[] => [
  { key: 'friends', label: 'My Friends', render: () => <FriendsListView userId={userId} canManage /> },
  { key: 'search', label: 'Search & Add', render: () => <SearchAndAddFriendsView /> },
  { key: 'pending', label: 'Pending Requests', render: () => <PendingRequestsView /> }
];

const buildUnownedViews = (userId: string): readonly FriendsSidebarView[] => [
  { key: 'friends', label: 'Friends', render: () => <FriendsListView userId={userId} /> },
  { key: 'mutual', label: 'Mutual Friends', render: () => <MutualFriendsView userId={userId} /> }
];

export interface FriendsProfileTabProps {
  readonly context: ProfileTabContext;
}

export const FriendsProfileTab = ({ context }: FriendsProfileTabProps) => {
  const views = context.isOwner ? buildOwnedViews(context.userId) : buildUnownedViews(context.userId);
  const [activeKey, setActiveKey] = React.useState(views[0].key);
  const activeView = views.find((view) => view.key === activeKey) ?? views[0];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      <nav className="flex shrink-0 flex-col gap-1 overflow-x-auto md:w-48 md:flex-col md:overflow-visible">
        {views.map((view) => (
          <Button
            key={view.key}
            type="button"
            variant={view.key === activeKey ? 'outlined' : 'ghost'}
            color={view.key === activeKey ? 'primary' : undefined}
            className="shrink-0 justify-start"
            onClick={() => setActiveKey(view.key)}
          >
            {view.label}
          </Button>
        ))}
      </nav>
      <div className="min-w-0 flex-1">{activeView.render()}</div>
    </div>
  );
};

import { FriendsOfUserListView } from './friends-of-user-list-view.js';

export interface FriendsListViewProps {
  readonly userId: string;
  readonly canManage?: boolean;
}

export const FriendsListView = ({ userId, canManage = false }: FriendsListViewProps) => (
  <FriendsOfUserListView path={`/friends/of/${userId}`} emptyMessage="No friends yet" canManage={canManage} />
);

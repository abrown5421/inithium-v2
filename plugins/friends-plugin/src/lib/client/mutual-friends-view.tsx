import { FriendsOfUserListView } from './friends-of-user-list-view.js';

export interface MutualFriendsViewProps {
  readonly userId: string;
}

export const MutualFriendsView = ({ userId }: MutualFriendsViewProps) => (
  <FriendsOfUserListView path={`/friends/of/${userId}/mutual`} emptyMessage="No mutual friends" />
);

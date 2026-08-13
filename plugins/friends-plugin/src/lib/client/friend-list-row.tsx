import type { ReactNode } from 'react';
import { Card, CardContent, UserAvatar } from '@inithium/ui';
import { resolveAvatarDisplay, resolveAvatarInitials, useReadAllProfilesQuery } from '@inithium/store';
import { usePageNavigate } from '@inithium/pages';
import type { UserSummary } from '../friendship.model.js';

export interface FriendListRowProps {
  readonly user: UserSummary;
  readonly renderAction?: (user: UserSummary) => ReactNode;
}

export const FriendListRow = ({ user, renderAction }: FriendListRowProps) => {
  const pageNavigate = usePageNavigate();
  const displayName = `${user.firstName} ${user.lastName}`.trim() || user.email;
  const { data: profilesResult } = useReadAllProfilesQuery({ field: 'user_id', search: user.userId, limit: 1 });
  const profile = profilesResult?.data?.[0];

  return (
    <Card>
      <CardContent className="flex items-center gap-3 px-4">
        <button
          type="button"
          className="flex flex-1 items-center gap-3 text-left"
          onClick={() => void pageNavigate(`/profile/${user.userId}`)}
        >
          <UserAvatar
            user={{
              name: displayName,
              avatarFallback: resolveAvatarInitials(user.firstName, user.lastName, user.email),
              ...resolveAvatarDisplay(profile?.profileAvatar)
            }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </button>
        {renderAction ? <div className="flex shrink-0 items-center gap-1">{renderAction(user)}</div> : null}
      </CardContent>
    </Card>
  );
};

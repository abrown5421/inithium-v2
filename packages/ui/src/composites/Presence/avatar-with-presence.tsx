import * as React from 'react';
import { PRESENCE_STATUS_META, type PresenceStatus } from '@inithium/presence';
import { UserAvatar } from '../Navbar/user-avatar.js';
import type { NavbarUser } from '../Navbar/navbar.types.js';
import { PresenceDot, type PresenceDotPlacement } from './presence-dot.js';

export interface AvatarWithPresenceProps {
  readonly user?: NavbarUser;
  readonly status: PresenceStatus;
  readonly placement?: PresenceDotPlacement;
  readonly className?: string;
  readonly dotClassName?: string;
}

export const AvatarWithPresence: React.FC<AvatarWithPresenceProps> = ({
  user,
  status,
  placement,
  className,
  dotClassName
}) => (
  <div className="relative inline-block">
    <UserAvatar user={user} className={className} />
    <PresenceDot status={status} meta={PRESENCE_STATUS_META} placement={placement} className={dotClassName} />
  </div>
);

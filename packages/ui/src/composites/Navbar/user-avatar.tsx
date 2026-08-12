import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../primitives/avatar.js';
import { cn } from '../../utils/cn.js';
import type { NavbarUser } from './navbar.types.js';

export interface UserAvatarProps {
  readonly user?: NavbarUser;
  readonly className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, className }) => {
  const shapeClassName = user?.avatarShapeClassName ?? 'rounded-full';
  const hasCustomColors = Boolean(user?.avatarBackgroundColor || user?.avatarFontColor);

  return (
    <Avatar className={cn(shapeClassName, className)}>
      {user?.avatarSrc ? <AvatarImage src={user.avatarSrc} alt={user?.name ?? 'Account'} /> : null}
      <AvatarFallback
        className={cn(shapeClassName, user?.avatarFontClassName)}
        style={
          hasCustomColors
            ? { backgroundColor: user?.avatarBackgroundColor, color: user?.avatarFontColor }
            : undefined
        }
      >
        {user?.avatarFallback ?? user?.name?.charAt(0)?.toUpperCase() ?? '?'}
      </AvatarFallback>
    </Avatar>
  );
};

import React from 'react';
import { Pencil } from 'lucide-react';
import { AvatarWithPresence } from '@inithium/ui';
import { resolveAvatarDisplay } from '@inithium/store';
import { usePresenceStatus } from '@inithium/presence/react';
import type { ProfileAvatar } from '@inithium/models';
import { UpdateAvatarDialog } from './update-avatar-dialog.js';

export interface ProfileAvatarDisplayProps {
  readonly userId: string;
  readonly profileId?: string;
  readonly avatar?: ProfileAvatar;
  readonly displayName?: string;
  readonly avatarFallback?: string;
  readonly isEditable: boolean;
  readonly className?: string;
}

export const ProfileAvatarDisplay: React.FC<ProfileAvatarDisplayProps> = ({
  userId,
  profileId,
  avatar,
  displayName,
  avatarFallback,
  isEditable,
  className
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const presenceStatus = usePresenceStatus(userId);

  return (
    <div className="relative inline-block">
      <AvatarWithPresence
        user={{ name: displayName, avatarFallback, ...resolveAvatarDisplay(avatar) }}
        status={presenceStatus}
        className={className}
        dotClassName="bottom-8 right-9"
      />

      {isEditable ? (
        <>
          <div
            onClick={() => setIsDialogOpen(true)}
            aria-label="Edit avatar"
            className="size-52 -mt-22.5 border-15 border-transparent rounded-full absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 cursor-pointer text-black outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Pencil className="size-8" />
          </div>
          <UpdateAvatarDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            userId={userId}
            profileId={profileId}
            avatar={avatar}
          />
        </>
      ) : null}
    </div>
  );
};

import React from 'react';
import { Pencil } from 'lucide-react';
import { Button, UserAvatar } from '@inithium/ui';
import { resolveAvatarDisplay } from '@inithium/store';
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

  return (
    <div className="relative inline-block">
      <UserAvatar user={{ name: displayName, avatarFallback, ...resolveAvatarDisplay(avatar) }} className={className} />

      {isEditable ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute bottom-1 right-1 rounded-full bg-background/80 backdrop-blur hover:bg-background"
            onClick={() => setIsDialogOpen(true)}
            aria-label="Edit avatar"
          >
            <Pencil className="size-4" />
          </Button>
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

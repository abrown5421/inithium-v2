import React from 'react';
import { Pencil } from 'lucide-react';
import { Button, TrianglifyPattern, cn } from '@inithium/ui';
import { DEFAULT_TRIANGLIFY_CONFIG, type ProfileBanner } from '@inithium/models';
import { resolveAssetUrl } from '@inithium/store';
import { UpdateBannerDialog } from './update-banner-dialog.js';

export interface ProfileBannerDisplayProps {
  readonly userId: string;
  readonly profileId?: string;
  readonly banner?: ProfileBanner;
  readonly isEditable: boolean;
  readonly className?: string;
}

export const ProfileBannerDisplay: React.FC<ProfileBannerDisplayProps> = ({
  userId,
  profileId,
  banner,
  isEditable,
  className
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className={cn('relative overflow-hidden rounded-md bg-muted', className)}>
      {banner?.bannerType === 'image' && banner.bannerAssetRef ? (
        <img
          src={resolveAssetUrl(banner.bannerAssetRef)}
          alt="Profile banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <TrianglifyPattern
          config={banner?.trianglifyConfig ?? DEFAULT_TRIANGLIFY_CONFIG}
          className="absolute inset-0 h-full w-full"
        />
      )}

      {isEditable ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur hover:bg-background"
            onClick={() => setIsDialogOpen(true)}
            aria-label="Edit banner"
          >
            <Pencil className="size-4" />
          </Button>
          <UpdateBannerDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            userId={userId}
            profileId={profileId}
            banner={banner}
          />
        </>
      ) : null}
    </div>
  );
};

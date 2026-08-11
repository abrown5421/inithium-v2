import React from 'react';
import { PageLayoutComponent } from '@inithium/pages';
import { Avatar, AvatarFallback, AvatarImage, NavbarUser } from '@inithium/ui';
import { useParams } from 'react-router-dom';
import { useReadUserQuery } from '@inithium/store';

interface MinimalUserSpec {
  readonly first_name?: string | null;
  readonly last_name?: string | null;
  readonly email: string;
  readonly avatarSrc?: string | null;
}

type UserMapper<T extends MinimalUserSpec> = (user?: T | null) => NavbarUser | undefined;

const createNavbarUserMapper = <T extends MinimalUserSpec>(): UserMapper<T> =>
  (user) =>
    user
      ? {
          name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email,
          firstName: user.first_name ?? undefined,
          avatarFallback: (user.first_name ?? user.email).charAt(0).toUpperCase(),
          avatarSrc: user.avatarSrc ?? undefined
        }
      : undefined;

const mapToNavbarUser = createNavbarUserMapper<MinimalUserSpec>();

const formatInitials = (user?: NavbarUser): string =>
  user?.avatarFallback ?? user?.name?.charAt(0)?.toUpperCase() ?? '?';

const UserAvatar: React.FC<{ readonly user?: NavbarUser }> = ({ user }) => (
  <Avatar className="size-52 -mt-32 border-20 border-background">
    {user?.avatarSrc ? <AvatarImage src={user.avatarSrc} alt={user.name ?? 'Account'} /> : null}
    <AvatarFallback>{formatInitials(user)}</AvatarFallback>
  </Avatar>
);

export const ProfilePage: PageLayoutComponent = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: profileUser } = useReadUserQuery(id, { skip: !id });

  return (
    <div className="flex flex-col">
      <div className="w-full h-60 bg-emerald-500">
        banner section
      </div>
      <div className="relative mx-auto flex w-full flex-row md:flex-row gap-4 md:gap-8 p-4">
        <UserAvatar user={mapToNavbarUser(profileUser)} />
      </div>
      <div className="mx-auto flex w-full flex-row md:flex-row gap-4 md:gap-8 p-4">
        profile content
      </div>
    </div>
  );
};
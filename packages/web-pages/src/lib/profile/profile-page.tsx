import React from 'react';
import { PageLayoutComponent } from '@inithium/pages';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  Heading,
  NavbarUser,
  Separator,
  Skeleton,
  Text
} from '@inithium/ui';
import { useParams } from 'react-router-dom';
import { useReadAllProfilesQuery, useReadAllSettingsQuery, useReadUserQuery } from '@inithium/store';
import type { Address, Gender, Profile, Setting } from '@inithium/models';
import { Cake, FileText, Link2, Phone, Receipt, Truck, UserRound, type LucideIcon } from 'lucide-react';

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

const PROFILE_CONFIG_SETTING_NAME = 'site.profileConfig';

interface PaginatedSettings {
  readonly data?: readonly Setting[];
}

const extractSettingsMap = (response?: PaginatedSettings): Record<string, unknown> =>
  (response?.data ?? []).reduce<Record<string, unknown>>(
    (acc, item) => ({ ...acc, [item.settingName]: item.settingValue }),
    {}
  );

const isProfileFieldActive = (config: unknown, field: string): boolean => {
  if (typeof config !== 'object' || config === null) return true;
  return (config as Record<string, unknown>)[field] !== false;
};

const hasText = (value?: string | null): value is string => Boolean(value && value.trim().length > 0);

const formatDate = (value: unknown): string | undefined => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value as string);
  return Number.isNaN(date.getTime())
    ? undefined
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatGender = (gender?: Gender): string | undefined =>
  gender ? (gender.type === 'Other' ? gender.custom : gender.type) : undefined;

const formatAddressLines = (address?: Address): readonly string[] | undefined =>
  address
    ? [address.addressLine1, address.addressLine2, `${address.city}, ${address.state} ${address.postalCode}`, address.country].filter(
        hasText
      )
    : undefined;

interface ProfileInfoRowProps {
  readonly icon: LucideIcon;
  readonly children: React.ReactNode;
}

const ProfileInfoRow: React.FC<ProfileInfoRowProps> = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-3 py-3">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Icon className="size-4" aria-hidden="true" />
    </div>
    <div className="flex flex-1 flex-col gap-0.5 pt-1.5">{children}</div>
  </div>
);

interface ProfileRowDef {
  readonly key: string;
  readonly icon: LucideIcon;
  readonly active: boolean;
  readonly content: React.ReactNode | null;
}

export const ProfilePage: PageLayoutComponent = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: profileUser } = useReadUserQuery(id, { skip: !id });
  const { data: profilesResult, isFetching: isProfileFetching } = useReadAllProfilesQuery(
    { field: 'user_id', search: id, limit: 1 },
    { skip: !id }
  );
  const { data: settingsData } = useReadAllSettingsQuery();
console.log(profileUser)
  const profile: Profile | undefined = profilesResult?.data?.[0];
  const settingsMap = React.useMemo(() => extractSettingsMap(settingsData), [settingsData]);
  const profileConfig = settingsMap[PROFILE_CONFIG_SETTING_NAME];

  const displayName = [profileUser?.first_name, profileUser?.last_name].filter(Boolean).join(' ') || profileUser?.email;
  const socials = (profile?.profileOtherSocials ?? []).filter(hasText);
  const shippingLines = formatAddressLines(profile?.profileShippingAddress);
  const billingLines = formatAddressLines(profile?.profileBillingAddress);
  const genderLabel = formatGender(profile?.profileGender);
  const dobLabel = formatDate(profile?.profileDOB);

  const rows: readonly ProfileRowDef[] = [
    {
      key: 'profileBio',
      icon: FileText,
      active: isProfileFieldActive(profileConfig, 'profileBio'),
      content: hasText(profile?.profileBio) ? <Text size="sm">{profile?.profileBio}</Text> : null
    },
    {
      key: 'profileDOB',
      icon: Cake,
      active: isProfileFieldActive(profileConfig, 'profileDOB'),
      content: dobLabel ? <Text size="sm">{dobLabel}</Text> : null
    },
    {
      key: 'profileGender',
      icon: UserRound,
      active: isProfileFieldActive(profileConfig, 'profileGender'),
      content: genderLabel ? <Text size="sm">{genderLabel}</Text> : null
    },
    {
      key: 'profilePhone',
      icon: Phone,
      active: isProfileFieldActive(profileConfig, 'profilePhone'),
      content: hasText(profile?.profilePhone) ? <Text size="sm">{profile?.profilePhone}</Text> : null
    },
    {
      key: 'profileOtherSocials',
      icon: Link2,
      active: isProfileFieldActive(profileConfig, 'profileOtherSocials'),
      content:
        socials.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {socials.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="truncate">
                <Text as="span" size="sm" color="primary" className="hover:underline">
                  {url}
                </Text>
              </a>
            ))}
          </div>
        ) : null
    },
    {
      key: 'profileShippingAddress',
      icon: Truck,
      active: isProfileFieldActive(profileConfig, 'profileShippingAddress'),
      content: shippingLines ? (
        <div className="flex flex-col">
          {shippingLines.map((line, index) => (
            <Text key={index} size="sm">
              {line}
            </Text>
          ))}
        </div>
      ) : null
    },
    {
      key: 'profileBillingAddress',
      icon: Receipt,
      active: isProfileFieldActive(profileConfig, 'profileBillingAddress'),
      content: billingLines ? (
        <div className="flex flex-col">
          {billingLines.map((line, index) => (
            <Text key={index} size="sm">
              {line}
            </Text>
          ))}
        </div>
      ) : null
    }
  ];

  const visibleRows = rows.filter((row) => row.active && row.content !== null);

  return (
    <div className="flex flex-col">
      <div className="w-full h-60 bg-emerald-500">
        banner section
      </div>
      <div className="relative mx-auto flex w-full flex-row md:flex-row gap-4 md:gap-8 p-4">
        <div className='flex flex-col flex-2'>
          <UserAvatar user={mapToNavbarUser(profileUser)} />
        </div>
        <div className='flex flex-col flex-8'>
          {/* spacer leave blank */}
        </div>
      </div>
      <div className="mx-auto flex w-full flex-row md:flex-row gap-4 md:gap-8 p-4">
        <div className='flex flex-col flex-2'>
          <Card>
            <CardContent className="flex flex-col gap-4">
              {profileUser ? (
                <div className="flex flex-col gap-1">
                  <Heading level={4}>{displayName}</Heading>
                  <Text size="sm" color="muted">
                    {profileUser.email}
                  </Text>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              )}

              <Separator />

              {isProfileFetching ? (
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ) : visibleRows.length > 0 && (
                <div className="flex flex-col divide-y divide-border">
                  {visibleRows.map((row) => (
                    <ProfileInfoRow key={row.key} icon={row.icon}>
                      {row.content}
                    </ProfileInfoRow>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className='flex flex-col flex-8'>
          profile content
        </div>
      </div>
    </div>
  );
};

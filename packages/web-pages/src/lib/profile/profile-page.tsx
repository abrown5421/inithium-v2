import React from 'react';
import { PageLayoutComponent } from '@inithium/pages';
import { Card, CardContent, Heading, Separator, Skeleton, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@inithium/ui';
import { useParams } from 'react-router-dom';
import { resolveAvatarInitials, useReadAllProfilesQuery, useReadAllSettingsQuery, useReadUserQuery } from '@inithium/store';
import type { Address, Gender, Profile } from '@inithium/models';
import { Cake, Link2, Phone, Receipt, Truck, UserRound, type LucideIcon } from 'lucide-react';
import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaFacebook,
  FaFigma,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaSoundcloud,
  FaSpotify,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube
} from 'react-icons/fa6';
import { useProfileIdentity } from './profile-identity.js';
import { extractSettingsMap, isProfileFieldActive, PROFILE_CONFIG_SETTING_NAME } from './profile-config.js';
import { PROFILE_TAB_REGISTRY, resolveActiveProfileTabs, ProfileTabContext } from './profile-tab-registry.js';
import { ProfileBannerDisplay } from './profile-banner-display.js';
import { ProfileAvatarDisplay } from './profile-avatar-display.js';

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

type SocialIconComponent = React.ComponentType<{ readonly className?: string }>;

interface SocialLinkIconEntry {
  readonly hostnames: readonly string[];
  readonly icon: SocialIconComponent;
}

const SOCIAL_LINK_ICON_ENTRIES: readonly SocialLinkIconEntry[] = [
  { hostnames: ['github.com'], icon: FaGithub },
  { hostnames: ['twitter.com', 'x.com'], icon: FaXTwitter },
  { hostnames: ['linkedin.com'], icon: FaLinkedin },
  { hostnames: ['instagram.com'], icon: FaInstagram },
  { hostnames: ['facebook.com', 'fb.com'], icon: FaFacebook },
  { hostnames: ['youtube.com', 'youtu.be'], icon: FaYoutube },
  { hostnames: ['tiktok.com'], icon: FaTiktok },
  { hostnames: ['discord.com', 'discord.gg'], icon: FaDiscord },
  { hostnames: ['twitch.tv'], icon: FaTwitch },
  { hostnames: ['reddit.com'], icon: FaReddit },
  { hostnames: ['medium.com'], icon: FaMedium },
  { hostnames: ['whatsapp.com', 'wa.me'], icon: FaWhatsapp },
  { hostnames: ['telegram.org', 't.me'], icon: FaTelegram },
  { hostnames: ['pinterest.com'], icon: FaPinterest },
  { hostnames: ['snapchat.com'], icon: FaSnapchat },
  { hostnames: ['threads.net'], icon: FaThreads },
  { hostnames: ['spotify.com'], icon: FaSpotify },
  { hostnames: ['soundcloud.com'], icon: FaSoundcloud },
  { hostnames: ['behance.net'], icon: FaBehance },
  { hostnames: ['dribbble.com'], icon: FaDribbble },
  { hostnames: ['figma.com'], icon: FaFigma }
];

const getHostname = (url: string): string | undefined => {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return undefined;
  }
};

const resolveSocialLinkIcon = (url: string): SocialIconComponent => {
  const hostname = getHostname(url);
  if (!hostname) return Link2;
  const match = SOCIAL_LINK_ICON_ENTRIES.find((entry) =>
    entry.hostnames.some((candidate) => hostname === candidate || hostname.endsWith(`.${candidate}`))
  );
  return match?.icon ?? Link2;
};

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
  const { isOwner } = useProfileIdentity();

  const profile: Profile | undefined = profilesResult?.data?.[0];
  const settingsMap = React.useMemo(() => extractSettingsMap(settingsData), [settingsData]);
  const profileConfig = settingsMap[PROFILE_CONFIG_SETTING_NAME];

  const displayName = [profileUser?.first_name, profileUser?.last_name].filter(Boolean).join(' ') || profileUser?.email;
  const socials = (profile?.profileOtherSocials ?? []).filter(hasText);
  const shippingLines = formatAddressLines(profile?.profileShippingAddress);
  const billingLines = formatAddressLines(profile?.profileBillingAddress);
  const genderLabel = formatGender(profile?.profileGender);
  const dobLabel = formatDate(profile?.profileDOB);

  const bioActive = isProfileFieldActive(profileConfig, 'profileBio') && hasText(profile?.profileBio);
  const socialsActive = isProfileFieldActive(profileConfig, 'profileOtherSocials') && socials.length > 0;

  const rows: readonly ProfileRowDef[] = [
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

  const tabContext: ProfileTabContext = { isOwner, userId: id };
  const activeTabs = resolveActiveProfileTabs(PROFILE_TAB_REGISTRY, tabContext);

  return (
    <div className="flex flex-col">
      <ProfileBannerDisplay
        userId={id}
        profileId={profile?._id}
        banner={profile?.profileBanner}
        isEditable={isOwner}
        className="w-full h-60"
      />
      <div className="relative mx-auto flex w-full flex-row md:flex-row gap-4 md:gap-8 p-4">
        <div className='flex flex-col flex-2 items-center'>
          <ProfileAvatarDisplay
            userId={id}
            profileId={profile?._id}
            avatar={profile?.profileAvatar}
            displayName={displayName}
            avatarFallback={resolveAvatarInitials(profileUser?.first_name, profileUser?.last_name, profileUser?.email)}
            isEditable={isOwner}
            className="size-52 -mt-32 border-15 border-background"
          />
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
              ) : (
                <>
                  {bioActive ? (
                    <>
                      <Text size="sm">{profile?.profileBio}</Text>
                      <Separator />
                    </>
                  ) : null}

                  {visibleRows.length > 0 ? (
                    <div className="flex flex-col divide-y divide-border">
                      {visibleRows.map((row) => (
                        <ProfileInfoRow key={row.key} icon={row.icon}>
                          {row.content}
                        </ProfileInfoRow>
                      ))}
                    </div>
                  ) : null}

                  {socialsActive ? (
                    <>
                      <Separator />
                      <div className="flex flex-col gap-2">
                        <Text size="xs" color="muted">
                          Links
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          {socials.map((url) => {
                            const Icon = resolveSocialLinkIcon(url);
                            return (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                title={url}
                                className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <Icon className="size-4" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className='flex flex-col flex-8' key={id}>
          {activeTabs.length > 0 ? (
            <Tabs defaultValue={activeTabs[0]?.id}>
              <TabsList>
                {activeTabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="gap-1.5">
                    <tab.icon className="size-4" aria-hidden="true" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {activeTabs.map((tab) => {
                const TabComponent = tab.component;
                return (
                  <TabsContent key={tab.id} value={tab.id}>
                    <TabComponent context={tabContext} />
                  </TabsContent>
                );
              })}
            </Tabs>
          ) : (
            <Text size="sm" color="muted">
              Nothing to show here.
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};

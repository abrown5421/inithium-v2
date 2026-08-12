import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Text } from '@inithium/ui';
import type { ProfileTabContext } from './profile-tab-registry.js';

export const FriendsTab: React.FC<{ readonly context: ProfileTabContext }> = ({ context }) => (
  <Card>
    <CardHeader>
      <CardTitle>Friends</CardTitle>
    </CardHeader>
    <CardContent>
      {context.isOwner ? (
        <Text size="sm" color="muted">
          Manage your friends and pending requests here.
        </Text>
      ) : (
        <Text size="sm" color="muted">
          See mutual friends here.
        </Text>
      )}
    </CardContent>
  </Card>
);

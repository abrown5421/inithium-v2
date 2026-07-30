import * as React from 'react';
import { Heading, Text } from '@inithium/ui';

export const ForbiddenPage: React.FC = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
    <Heading level={1}>403</Heading>
    <Text tone="muted">You do not have permission to view this page.</Text>
  </div>
);

import * as React from 'react';
import { Button, Heading, Text } from '@inithium/ui';

export const NotFoundPage: React.FC = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
    <Heading font='secondary' level={1} color='primary'>404</Heading>
    <Text tone="muted">We're sorry the page you are looking for does not exist.</Text>
    <Button color='primary'>Go Home</Button>
  </div>
);

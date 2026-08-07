import * as React from 'react';
import { Button, Heading, Text } from '@inithium/ui';
import { usePageNavigate } from '../hooks/use-page-navigate.js';

export const NotFoundPage: React.FC = () => {
  const navigate = usePageNavigate();
  
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center bg-background">
      <Heading font='secondary' level={1} color='primary'>404</Heading>
      <Text color="muted">We're sorry the page you are looking for does not exist.</Text>
      <Button color='primary' onClick={() => navigate('/')}>Go Home</Button>
    </div>
  )
};

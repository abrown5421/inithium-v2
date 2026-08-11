import type * as React from 'react';
import { Heading, Text } from '@inithium/ui';

export interface ThemingDocSectionProps {
  readonly title: string;
  readonly description?: React.ReactNode;
  readonly children: React.ReactNode;
}

export const ThemingDocSection = ({ title, description, children }: ThemingDocSectionProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <Heading level={4}>{title}</Heading>
      {description ? (
        <Text size="sm" color="muted" className="max-w-3xl">
          {description}
        </Text>
      ) : null}
    </div>
    {children}
  </div>
);

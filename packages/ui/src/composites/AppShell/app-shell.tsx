import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface AppShellProps {
  readonly navbar?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ navbar, children, className }) => (
  <div data-slot="app-shell" className={cn('flex min-h-dvh flex-col bg-foreground', className)}>
    {navbar ? (
      <div data-slot="app-shell-navbar" className="sticky top-0 z-40">
        {navbar}
      </div>
    ) : null}
    <main data-slot="app-shell-main" className="flex flex-1 flex-col">
      {children}
    </main>
  </div>
);

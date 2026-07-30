import * as React from 'react';
import { Page } from '@inithium/models';
import { AccessEvaluationConfig, evaluateAccess } from '../access-control/access-control.js';
import { DEFAULT_FALLBACK_COMPONENTS, FallbackComponents, resolveAccessNode } from '../fallback/fallback-resolver.js';
import { usePageSession } from '../session/page-session-context.js';

export interface AccessGuardProps {
  readonly page: Page;
  readonly config: AccessEvaluationConfig;
  readonly fallbackComponents?: Partial<FallbackComponents>;
  readonly children: React.ReactNode;
}

export const AccessGuard: React.FC<AccessGuardProps> = ({ page, config, fallbackComponents, children }) => {
  const session = usePageSession();

  const decision = React.useMemo(
    () => evaluateAccess(page, session, config),
    [page, session, config]
  );

  const components = React.useMemo<FallbackComponents>(
    () => ({ ...DEFAULT_FALLBACK_COMPONENTS, ...fallbackComponents }),
    [fallbackComponents]
  );

  return <>{resolveAccessNode(decision, children, components)}</>;
};

export const withAccessGuard = <P extends object>(
  Component: React.ComponentType<P>,
  resolveGuardProps: (props: P) => Pick<AccessGuardProps, 'page' | 'config' | 'fallbackComponents'>
): React.FC<P> => {
  const Guarded: React.FC<P> = (props) => (
    <AccessGuard {...resolveGuardProps(props)}>
      <Component {...props} />
    </AccessGuard>
  );
  return Guarded;
};

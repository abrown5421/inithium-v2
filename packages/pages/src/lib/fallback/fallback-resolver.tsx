import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { AccessDecision } from '../access-control/access-control.js';
import { ForbiddenPage } from './forbidden-page.js';
import { NotFoundPage } from './not-found-page.js';

export interface FallbackComponents {
  readonly NotFound: React.ComponentType;
  readonly Forbidden: React.ComponentType;
}

export const DEFAULT_FALLBACK_COMPONENTS: FallbackComponents = {
  NotFound: NotFoundPage,
  Forbidden: ForbiddenPage
};

export const resolveAccessNode = (
  decision: AccessDecision,
  allowedNode: React.ReactNode,
  components: FallbackComponents = DEFAULT_FALLBACK_COMPONENTS
): React.ReactNode => {
  switch (decision.kind) {
    case 'allow': {
      return allowedNode;
    }
    case 'redirect': {
      return <Navigate to={decision.to} replace />;
    }
    case 'forbidden': {
      const { Forbidden } = components;
      return <Forbidden />;
    }
    case 'not-found': {
      const { NotFound } = components;
      return <NotFound />;
    }
  }
};

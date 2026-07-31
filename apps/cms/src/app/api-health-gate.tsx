import * as React from 'react';
import { useCheckHealthQuery } from '@inithium/store';
import { Spinner } from '@inithium/ui';

const HEALTH_POLL_INTERVAL_MS = 2000;

export interface ApiHealthGateProps {
  readonly children: React.ReactNode;
}

/**
 * Blocks rendering of the app until the API responds healthy, polling `/health`
 * until it succeeds. Prevents the initial data fetches (pages, auth/me) from
 * racing a not-yet-ready API and falling through to the 404 page.
 */
export const ApiHealthGate: React.FC<ApiHealthGateProps> = ({ children }) => {
  const [ready, setReady] = React.useState(false);
  const { isSuccess } = useCheckHealthQuery(undefined, {
    pollingInterval: ready ? 0 : HEALTH_POLL_INTERVAL_MS,
    skip: ready
  });

  React.useEffect(() => {
    if (isSuccess) {
      setReady(true);
    }
  }, [isSuccess]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner size="lg" label="Connecting to server" />
      </div>
    );
  }

  return <>{children}</>;
};

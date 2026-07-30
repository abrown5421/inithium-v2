import * as React from 'react';
import { useReadAllPagesQuery } from '@inithium/store';
import {
  ANONYMOUS_SESSION,
  DynamicRouterProvider,
  PageLayoutComponent,
  PageSessionProvider,
  usePageNavigate
} from '@inithium/pages';
import { Button, Heading, Spinner, Text } from '@inithium/ui';

const DefaultPageLayout: PageLayoutComponent = ({ page }) => {
  const pageNavigate = usePageNavigate();

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-8">
      <Heading level={1}>{page.metadata.title || page.pageName}</Heading>
      <Text tone="muted">{page.metadata.description}</Text>
      <Button className="w-fit" onClick={() => void pageNavigate('/')}>
        Go home
      </Button>
    </div>
  );
};

const layouts = { default: DefaultPageLayout };

const App: React.FC = () => {
  const { data, isLoading } = useReadAllPagesQuery({ limit: 100 });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageSessionProvider value={ANONYMOUS_SESSION}>
      <DynamicRouterProvider
        pages={data?.data ?? []}
        app="web"
        layouts={layouts}
        config={{ loginRoute: '/login', defaultAuthenticatedRoute: '/dashboard' }}
      />
    </PageSessionProvider>
  );
};

export default App;

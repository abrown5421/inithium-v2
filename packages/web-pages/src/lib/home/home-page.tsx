import { PageLayoutComponent } from '@inithium/pages';
import { Heading } from '@inithium/ui';

export const HomePage: PageLayoutComponent = ({ page }) => (
  <div className="flex flex-1 items-center justify-center">
    <Heading level={1}>{page.pageName}</Heading>
  </div>
);

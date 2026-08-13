import { PageLayoutComponent } from '@inithium/pages';
import { DashboardGridContainer } from '@inithium/dashboard-widgets';

export const DashboardPage: PageLayoutComponent = ({ page }) => (
  <div className="flex flex-1 flex-col gap-4">
    <DashboardGridContainer />
  </div>
);

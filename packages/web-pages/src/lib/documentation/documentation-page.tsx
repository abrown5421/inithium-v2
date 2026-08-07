import { PageLayoutComponent } from '@inithium/pages';
import { Heading, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@inithium/ui';
import { SectionPanel } from './components/section-panel.js';
import { ThemingPanel } from './components/theming-panel.js';
import { COMPOSITES_SECTION } from './data/composites.data.js';
import { PRIMITIVES_SECTION } from './data/primitives.data.js';

const THEMING_TAB_ID = 'theming';

export const DocumentationPage: PageLayoutComponent = ({ page }) => (
  <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-2">
      <Heading level={1} font="secondary">
        {page.pageName}
      </Heading>
      <Text size="lg" color="muted" className="max-w-3xl">
        A living reference for the @inithium/ui package, scoped to the UI package only. Every section
        below — the tabs, cards, buttons, and code blocks — is itself built from the components it
        documents.
      </Text>
    </div>

    <Tabs defaultValue={PRIMITIVES_SECTION.id} className="flex flex-col gap-6">
      <TabsList>
        <TabsTrigger value={PRIMITIVES_SECTION.id}>{PRIMITIVES_SECTION.label}</TabsTrigger>
        <TabsTrigger value={COMPOSITES_SECTION.id}>{COMPOSITES_SECTION.label}</TabsTrigger>
        <TabsTrigger value={THEMING_TAB_ID}>Theming Tooling</TabsTrigger>
      </TabsList>

      <TabsContent value={PRIMITIVES_SECTION.id}>
        <SectionPanel section={PRIMITIVES_SECTION} />
      </TabsContent>
      <TabsContent value={COMPOSITES_SECTION.id}>
        <SectionPanel section={COMPOSITES_SECTION} />
      </TabsContent>
      <TabsContent value={THEMING_TAB_ID}>
        <ThemingPanel />
      </TabsContent>
    </Tabs>
  </div>
);

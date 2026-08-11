import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Text,
} from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const NAVIGATION_MENU_DOC: PrimitiveDoc = {
  overview: (
    <>
      NavigationMenu is a top-level, keyboard-accessible navigation bar with flyout content panels, built
      on Radix Navigation Menu with an animated shared viewport. Enterprise use cases include primary
      app navigation bars with mega-menu style dropdowns for product, docs, or resource sections.
    </>
  ),
  importStatement: "import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@inithium/ui';",
  propGroups: [
    {
      component: 'NavigationMenu',
      props: [
        { name: 'viewport', type: 'boolean', defaultValue: 'true', description: 'Renders the shared animated viewport that flyout content mounts into.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Menu with flyout content',
      code: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-64 gap-2 p-2">
          <NavigationMenuLink href="#">Analytics</NavigationMenuLink>
          <NavigationMenuLink href="#">Automation</NavigationMenuLink>
          <NavigationMenuLink href="#">Reporting</NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
      preview: (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-64 gap-2 p-2">
                  <NavigationMenuLink href="#">
                    <Text size="sm">Analytics</Text>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#">
                    <Text size="sm">Automation</Text>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#">
                    <Text size="sm">Reporting</Text>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ),
    },
  ],
};

export const NavigationMenuDoc = () => <PrimitiveDocView doc={NAVIGATION_MENU_DOC} />;

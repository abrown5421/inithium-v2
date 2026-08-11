import { Topic } from './documentation-page.types.js';
import { AccordionDoc } from './primitives/accordion/index.js';
import { AlertDialogDoc } from './primitives/alert-dialog/index.js';
import { AlertDoc } from './primitives/alert/index.js';
import { AspectRatioDoc } from './primitives/aspect-ratio/index.js';
import { AvatarDoc } from './primitives/avatar/index.js';
import { BadgeDoc } from './primitives/badge/index.js';
import { BreadcrumbDoc } from './primitives/breadcrumb/index.js';
import { ButtonDoc } from './primitives/button/index.js';
import { CardDoc } from './primitives/card/index.js';
import { CheckboxDoc } from './primitives/checkbox/index.js';
import { CollapsibleDoc } from './primitives/collapsible/index.js';
import { ComboboxDoc } from './primitives/combobox/index.js';
import { CommandDoc } from './primitives/command/index.js';
import { ContextMenuDoc } from './primitives/context-menu/index.js';
import { DialogDoc } from './primitives/dialog/index.js';
import { DropdownMenuDoc } from './primitives/dropdown-menu/index.js';
import { HeadingDoc } from './primitives/heading/index.js';
import { InputOTPDoc } from './primitives/input-otp/index.js';
import { InputDoc } from './primitives/input/index.js';
import { LabelDoc } from './primitives/label/index.js';
import { NavigationMenuDoc } from './primitives/navigation-menu/index.js';
import { PaginationDoc } from './primitives/pagination/index.js';
import { PopoverDoc } from './primitives/popover/index.js';
import { ProgressDoc } from './primitives/progress/index.js';
import { RadioGroupDoc } from './primitives/radio-group/index.js';
import { ScrollAreaDoc } from './primitives/scroll-area/index.js';
import { SelectDoc } from './primitives/select/index.js';
import { SeparatorDoc } from './primitives/separator/index.js';
import { SheetDoc } from './primitives/sheet/index.js';
import { SkeletonDoc } from './primitives/skeleton/index.js';
import { SliderDoc } from './primitives/slider/index.js';
import { SpinnerDoc } from './primitives/spinner/index.js';
import { SwitchDoc } from './primitives/switch/index.js';
import { TableDoc } from './primitives/table/index.js';
import { TabsDoc } from './primitives/tabs/index.js';
import { TextDoc } from './primitives/text/index.js';
import { TextareaDoc } from './primitives/textarea/index.js';
import { TooltipDoc } from './primitives/tooltip/index.js';
import { ThemeColorDoc } from './theming/theme-color/index.js';
import { TailwindColorDoc } from './theming/tailwind-color/index.js';
import { AppFontsDoc } from './theming/app-fonts/index.js';
import { AppLogoDoc } from './theming/app-logo/index.js';

export const DOCS_CONFIG: readonly Topic[] = [
  {
    id: 'overview',
    title: 'Overview',
    overviewContent: <p className="text-muted-foreground">General documentation overview and guidelines.</p>,
    subTopics: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'getting-started', title: 'Getting Started' },
    ],
  },
  {
    id: 'primitives',
    title: 'Primitives',
    overviewContent: <p className="text-muted-foreground">Primitves are atomic level UI elements that are prop driven and designed to scale with your application.</p>,
    subTopics: [
      { id: 'accordion', title: 'Accordion', content: <AccordionDoc /> },
      { id: 'alert-dialog', title: 'Alert Dialog', content: <AlertDialogDoc /> },
      { id: 'alert', title: 'Alert', content: <AlertDoc /> },
      { id: 'aspect-ratio', title: 'Aspect Ratio', content: <AspectRatioDoc /> },
      { id: 'avatar', title: 'Avatar', content: <AvatarDoc /> },
      { id: 'badge', title: 'Badge', content: <BadgeDoc /> },
      { id: 'breadcrumb', title: 'Breadcrumb', content: <BreadcrumbDoc /> },
      { id: 'button', title: 'Button', content: <ButtonDoc /> },
      { id: 'card', title: 'Card', content: <CardDoc /> },
      { id: 'checkbox', title: 'Checkbox', content: <CheckboxDoc /> },
      { id: 'collapsible', title: 'Collapsible', content: <CollapsibleDoc /> },
      { id: 'combobox', title: 'Combobox', content: <ComboboxDoc /> },
      { id: 'command', title: 'Command', content: <CommandDoc /> },
      { id: 'context-menu', title: 'Context Menu', content: <ContextMenuDoc /> },
      { id: 'dialog', title: 'Dialog', content: <DialogDoc /> },
      { id: 'dropdown-menu', title: 'Dropdown Menu', content: <DropdownMenuDoc /> },
      { id: 'heading', title: 'Heading', content: <HeadingDoc /> },
      { id: 'input-otp', title: 'Input OTP', content: <InputOTPDoc /> },
      { id: 'input', title: 'Input', content: <InputDoc /> },
      { id: 'label', title: 'Label', content: <LabelDoc /> },
      { id: 'navigation-menu', title: 'Navigation Menu', content: <NavigationMenuDoc /> },
      { id: 'pagination', title: 'Pagination', content: <PaginationDoc /> },
      { id: 'popover', title: 'Popover', content: <PopoverDoc /> },
      { id: 'progress', title: 'Progress', content: <ProgressDoc /> },
      { id: 'radio-group', title: 'Radio Group', content: <RadioGroupDoc /> },
      { id: 'scroll-area', title: 'Scroll Area', content: <ScrollAreaDoc /> },
      { id: 'select', title: 'Select', content: <SelectDoc /> },
      { id: 'separator', title: 'Separator', content: <SeparatorDoc /> },
      { id: 'sheet', title: 'Sheet', content: <SheetDoc /> },
      { id: 'skeleton', title: 'Skeleton', content: <SkeletonDoc /> },
      { id: 'slider', title: 'Slider', content: <SliderDoc /> },
      { id: 'spinner', title: 'Spinner', content: <SpinnerDoc /> },
      { id: 'switch', title: 'Switch', content: <SwitchDoc /> },
      { id: 'table', title: 'Table', content: <TableDoc /> },
      { id: 'tabs', title: 'Tabs', content: <TabsDoc /> },
      { id: 'text', title: 'Text', content: <TextDoc /> },
      { id: 'textarea', title: 'Textarea', content: <TextareaDoc /> },
      { id: 'tooltip', title: 'Tooltip', content: <TooltipDoc /> },
    ],
  },
  {
    id: 'composites',
    title: 'Composites',
    overviewContent: <p className="text-muted-foreground">High-level complex composite patterns made up of primitives used to creat complex molecular level UI elements and components.</p>,
    subTopics: [
      { id: 'alert-toast', title: 'Alert Toast' },
      { id: 'app-shell', title: 'App Shell' },
      { id: 'asset-picker', title: 'Asset Picker' },
      { id: 'auth', title: 'Auth' },
      { id: 'auto-increment-list', title: 'Auto Increment List' },
      { id: 'color-picker', title: 'Color Picker' },
      { id: 'confirm-delete-dialog', title: 'Confirm Delete Dialog' },
      { id: 'data-table', title: 'Data Table' },
      { id: 'entity-form-dialog', title: 'Entity Form Dialog' },
      { id: 'file-drop-zone', title: 'File Dropzone' },
      { id: 'navbar', title: 'Navbar' },
      { id: 'pagination', title: 'Pagination' },
      { id: 'search-filter-bar', title: 'Search Filter Bar' },
      { id: 'setting-value-editor', title: 'Setting Value Editor' },
      { id: 'user-picker', title: 'User Picker' },
    ],
  },
  {
    id: 'theming',
    title: 'Theming',
    overviewContent: <p className="text-muted-foreground">Design token system and themes configuration.</p>,
    subTopics: [
      { id: 'theme-color', title: 'Theme Colors', content: <ThemeColorDoc /> },
      { id: 'tailwind-color', title: 'Tailwind Colors', content: <TailwindColorDoc /> },
      { id: 'app-fonts', title: 'Application Fonts', content: <AppFontsDoc /> },
      { id: 'app-logo', title: 'Application Logo', content: <AppLogoDoc /> },
    ],
  },
];

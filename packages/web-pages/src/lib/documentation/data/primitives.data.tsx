import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Heading,
  Input,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@inithium/ui';
import type { DocumentationSection } from '../documentation-page.types.js';

export const PRIMITIVES_SECTION: DocumentationSection = {
  id: 'primitives',
  label: 'Primitives',
  description:
    'Low-level, single-purpose building blocks from @inithium/ui. Primitives own no business logic — they accept a small, consistent variant/color API and compose into everything else on this page.',
  components: [
    {
      id: 'button',
      name: 'Button',
      summary: 'Solid, outlined, ghost, and link variants sharing the same 8-token color palette.',
      importStatement: "import { Button } from '@inithium/ui';",
      usageCode: `<Button variant="solid" color="primary">Save changes</Button>
<Button variant="outlined" color="destructive">Delete</Button>
<Button variant="ghost" loading>Submitting…</Button>`,
      preview: (
        <>
          <Button variant="solid" color="primary">
            Save changes
          </Button>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="ghost" color="accent">
            Ghost
          </Button>
          <Button variant="link" color="info">
            Learn more
          </Button>
          <Button variant="solid" color="destructive" loading>
            Deleting
          </Button>
        </>
      ),
      props: [
        { name: 'variant', type: "'solid' | 'outlined' | 'ghost' | 'link'", defaultValue: "'solid'", description: 'Visual treatment of the button.' },
        { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", defaultValue: "'default'", description: 'Controls height/padding, or a square icon-only button.' },
        { name: 'color', type: 'ColorToken', defaultValue: "'primary' (solid only)", description: 'One of the 8 core theme tokens, or a literal Tailwind shade.' },
        { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Swaps leftIcon for a spinner and disables the button.' },
        { name: 'leftIcon', type: 'React.ReactNode', description: 'Icon rendered before the label (hidden while loading).' },
        { name: 'rightIcon', type: 'React.ReactNode', description: 'Icon rendered after the label.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Merges button behavior onto its immediate child instead of rendering a <button>.' },
      ],
    },
    {
      id: 'input',
      name: 'Input',
      summary: 'Native text input styled to the design system, with a built-in error/destructive state.',
      importStatement: "import { Input } from '@inithium/ui';",
      usageCode: `<Input placeholder="you@example.com" />
<Input placeholder="you@example.com" error="Enter a valid email address" />`,
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input placeholder="you@example.com" />
          <Input placeholder="you@example.com" error defaultValue="not-an-email" />
        </div>
      ),
      props: [
        { name: 'error', type: 'boolean | string', description: 'Marks the field invalid and switches it to the destructive palette.' },
        { name: 'color', type: 'ColorToken', description: 'Focus-ring and selection color. Omit for the neutral default.' },
      ],
    },
    {
      id: 'badge',
      name: 'Badge',
      summary: 'Compact status/label pill in solid or outlined treatments.',
      importStatement: "import { Badge } from '@inithium/ui';",
      usageCode: `<Badge color="success">Live</Badge>
<Badge variant="outlined" color="warning">Draft</Badge>`,
      preview: (
        <>
          <Badge color="primary">Primary</Badge>
          <Badge color="success">Live</Badge>
          <Badge variant="outlined" color="warning">
            Draft
          </Badge>
          <Badge variant="outlined" color="destructive">
            Archived
          </Badge>
        </>
      ),
      props: [
        { name: 'variant', type: "'solid' | 'outlined'", defaultValue: "'solid'", description: 'Visual treatment of the badge.' },
        { name: 'color', type: 'ColorToken', defaultValue: "'primary' (solid only)", description: 'One of the 8 core theme tokens, or a literal Tailwind shade.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Merges badge styling onto its immediate child, e.g. an <a>.' },
      ],
    },
    {
      id: 'spinner',
      name: 'Spinner',
      summary: 'Accessible loading indicator used standalone or inside Button via the loading prop.',
      importStatement: "import { Spinner } from '@inithium/ui';",
      usageCode: `<Spinner size="sm" />
<Spinner label="Loading documentation" color="primary" />`,
      preview: (
        <>
          <Spinner size="sm" />
          <Spinner size="default" color="primary" />
          <Spinner size="lg" color="accent" />
        </>
      ),
      props: [
        { name: 'size', type: "'sm' | 'default' | 'lg'", defaultValue: "'default'", description: 'Diameter of the spinner.' },
        { name: 'label', type: 'string', defaultValue: "'Loading'", description: 'Accessible label announced to assistive tech.' },
        { name: 'color', type: 'ColorToken', defaultValue: "'muted'", description: 'One of the 8 core theme tokens, or a literal Tailwind shade.' },
      ],
    },
    {
      id: 'heading',
      name: 'Heading',
      summary: 'Semantic h1–h6 with an independent visual level and font-family selector.',
      importStatement: "import { Heading } from '@inithium/ui';",
      usageCode: `<Heading level={1} font="secondary">Page title</Heading>
<Heading level={3} color="muted">Section title</Heading>`,
      preview: (
        <div className="flex flex-col gap-1">
          <Heading level={3} font="secondary">
            Section title
          </Heading>
          <Heading level={5} color="muted">
            Muted subtitle
          </Heading>
        </div>
      ),
      props: [
        { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', defaultValue: '2', description: 'Both the rendered <h{level}> tag and its visual scale.' },
        { name: 'font', type: "'primary' | 'secondary' | 'sans' | 'serif' | 'mono'", defaultValue: "'sans'", description: 'Font-family variant.' },
        { name: 'color', type: 'ColorToken', description: 'One of the 8 core theme tokens. Omit for text-foreground.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Merges heading styling onto its immediate child.' },
      ],
    },
    {
      id: 'text',
      name: 'Text',
      summary: 'The default copy component for this entire page — every label, description, and code caption you see is a Text instance.',
      importStatement: "import { Text } from '@inithium/ui';",
      usageCode: `<Text size="sm" color="muted">Supporting copy</Text>
<Text as="span" weight="semibold">Inline emphasis</Text>`,
      preview: (
        <div className="flex flex-col gap-1">
          <Text size="lg" weight="semibold">
            Large, semibold
          </Text>
          <Text size="sm" color="muted">
            Small, muted supporting copy
          </Text>
          <Text as="span" font="mono" size="xs">
            mono / xs
          </Text>
        </div>
      ),
      props: [
        { name: 'size', type: "'xs' | 'sm' | 'base' | 'lg' | 'xl'", defaultValue: "'base'", description: 'Font size.' },
        { name: 'weight', type: "'normal' | 'medium' | 'semibold' | 'bold'", defaultValue: "'normal'", description: 'Font weight.' },
        { name: 'font', type: "'primary' | 'secondary' | 'sans' | 'serif' | 'mono'", defaultValue: "'sans'", description: 'Font-family variant.' },
        { name: 'color', type: "'default' | ColorToken", defaultValue: "'default'", description: "'default' renders text-foreground; otherwise one of the 8 core theme tokens." },
        { name: 'as', type: "'p' | 'span' | 'div' | 'label' | 'small'", defaultValue: "'p'", description: 'Rendered element.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Merges text styling onto its immediate child.' },
      ],
    },
    {
      id: 'card',
      name: 'Card',
      summary: 'The bordered container primitive. Every doc entry on this page — including this one — is rendered inside a Card.',
      importStatement: "import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@inithium/ui';",
      usageCode: `<Card>
  <CardHeader>
    <CardTitle>Storage usage</CardTitle>
    <CardDescription>Updated a few seconds ago</CardDescription>
  </CardHeader>
  <CardContent>
    <Text size="sm">42.1 GB of 100 GB used</Text>
  </CardContent>
  <CardFooter>
    <Button size="sm" variant="outlined">View details</Button>
  </CardFooter>
</Card>`,
      preview: (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Storage usage</CardTitle>
            <CardDescription>Updated a few seconds ago</CardDescription>
          </CardHeader>
          <CardContent>
            <Text size="sm">42.1 GB of 100 GB used</Text>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outlined">
              View details
            </Button>
          </CardFooter>
        </Card>
      ),
      props: [
        { name: '(all sub-parts)', type: 'React.HTMLAttributes<HTMLDivElement>', description: 'Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, and CardFooter are unstyled-prop div wrappers — pass className/children like any div.' },
      ],
    },
    {
      id: 'tabs',
      name: 'Tabs',
      summary: "Radix-based tab navigation. This documentation page's own Primitives / Molecular Composites / Theming Tooling navigation is built with this exact component.",
      importStatement: "import { Tabs, TabsList, TabsTrigger, TabsContent } from '@inithium/ui';",
      usageCode: `<Tabs defaultValue="props">
  <TabsList>
    <TabsTrigger value="props">Props</TabsTrigger>
    <TabsTrigger value="usage">Usage</TabsTrigger>
  </TabsList>
  <TabsContent value="props">…</TabsContent>
  <TabsContent value="usage">…</TabsContent>
</Tabs>`,
      preview: (
        <Tabs defaultValue="props" className="w-full max-w-sm">
          <TabsList>
            <TabsTrigger value="props">Props</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>
          <TabsContent value="props">
            <Text size="sm" color="muted">
              value / defaultValue / onValueChange, straight from Radix.
            </Text>
          </TabsContent>
          <TabsContent value="usage">
            <Text size="sm" color="muted">
              Wrap TabsTrigger/TabsContent pairs sharing the same value.
            </Text>
          </TabsContent>
        </Tabs>
      ),
      props: [
        { name: 'value / defaultValue', type: 'string', description: 'Controlled/uncontrolled active tab, set on Tabs and matched by TabsTrigger/TabsContent.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the active tab changes (controlled usage).' },
      ],
      notes: 'Props are passed through unmodified from @radix-ui/react-tabs — Tabs/TabsList/TabsTrigger/TabsContent only add default styling.',
    },
  ],
};

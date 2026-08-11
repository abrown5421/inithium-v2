import { Badge, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Text } from '@inithium/ui';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const CARD_DOC: PrimitiveDoc = {
  overview: (
    <>
      Card groups related content into a bordered, padded surface, composed from Header, Title,
      Description, Action, Content, and Footer slots that lay out via CSS grid so an action button can
      sit beside the title without extra markup. Enterprise use cases include dashboard summary cards,
      settings panels, and list-item detail cards.
    </>
  ),
  importStatement: "import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Card and its slots',
      props: [],
    },
  ],
  examples: [
    {
      title: 'Standard card',
      code: `<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Monthly revenue</CardTitle>
    <CardDescription>Compared to last month</CardDescription>
  </CardHeader>
  <CardContent>
    <Text size="xl" weight="bold">$48,200</Text>
  </CardContent>
  <CardFooter>
    <Badge color="success">+12.4%</Badge>
  </CardFooter>
</Card>`,
      preview: (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Monthly revenue</CardTitle>
            <CardDescription>Compared to last month</CardDescription>
          </CardHeader>
          <CardContent>
            <Text size="xl" weight="bold">$48,200</Text>
          </CardContent>
          <CardFooter>
            <Badge color="success">+12.4%</Badge>
          </CardFooter>
        </Card>
      ),
    },
    {
      title: 'Card with a header action',
      description: 'CardAction occupies the grid cell beside CardTitle/CardDescription, ideal for a single trailing button.',
      code: `<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Team members</CardTitle>
    <CardDescription>4 active seats</CardDescription>
    <CardAction>
      <Button size="sm" variant="outlined">Invite</Button>
    </CardAction>
  </CardHeader>
</Card>`,
      preview: (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Team members</CardTitle>
            <CardDescription>4 active seats</CardDescription>
            <CardAction>
              <Button size="sm" variant="outlined">Invite</Button>
            </CardAction>
          </CardHeader>
        </Card>
      ),
    },
  ],
};

export const CardDoc = () => <PrimitiveDocView doc={CARD_DOC} />;

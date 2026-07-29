import * as React from 'react';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Heading, Progress } from '@inithium/ui';

const App: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-8">
      <Badge variant="secondary" className="w-fit">
        @inithium/ui
      </Badge>
      <Heading level={1}>CMS</Heading>
      <Card>
        <CardHeader>
          <CardTitle>Sync status</CardTitle>
          <CardDescription>Content is up to date with the last publish.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Progress value={72} />
          <Button className="w-fit">Publish now</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;

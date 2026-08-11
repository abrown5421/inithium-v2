import { Alert, AlertDescription, AlertTitle } from '@inithium/ui';
import { AlertTriangle, CheckCircle2, Terminal } from 'lucide-react';
import { PrimitiveDocView } from '../../components/primitive-doc-view.js';
import type { PrimitiveDoc } from '../primitive-doc.types.js';

const ALERT_DOC: PrimitiveDoc = {
  overview: (
    <>
      Alert is a bordered, icon-aware inline banner for surfacing status messages, sharing the same
      8-token soft-color treatment as Badge and Button on top of a neutral card-surface default.
      Enterprise use cases include form-level validation summaries, system status banners, and
      contextual warnings shown above a data table.
    </>
  ),
  importStatement: "import { Alert, AlertTitle, AlertDescription } from '@inithium/ui';",
  propGroups: [
    {
      component: 'Alert',
      props: [
        { name: 'color', type: 'ColorToken', description: 'One of the 8 core theme tokens. Omit for the neutral card-surface treatment.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Neutral informational alert',
      code: `<Alert>
  <Terminal />
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
</Alert>`,
      preview: (
        <Alert className="max-w-md">
          <Terminal />
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
        </Alert>
      ),
    },
    {
      title: 'Themed status alerts',
      code: `<Alert color="success">
  <CheckCircle2 />
  <AlertTitle>Deployment succeeded</AlertTitle>
  <AlertDescription>Your changes are now live in production.</AlertDescription>
</Alert>
<Alert color="destructive">
  <AlertTriangle />
  <AlertTitle>Build failed</AlertTitle>
  <AlertDescription>Check the deployment logs for details.</AlertDescription>
</Alert>`,
      preview: (
        <div className="flex w-full max-w-md flex-col gap-3">
          <Alert color="success">
            <CheckCircle2 />
            <AlertTitle>Deployment succeeded</AlertTitle>
            <AlertDescription>Your changes are now live in production.</AlertDescription>
          </Alert>
          <Alert color="destructive">
            <AlertTriangle />
            <AlertTitle>Build failed</AlertTitle>
            <AlertDescription>Check the deployment logs for details.</AlertDescription>
          </Alert>
        </div>
      ),
    },
  ],
};

export const AlertDoc = () => <PrimitiveDocView doc={ALERT_DOC} />;

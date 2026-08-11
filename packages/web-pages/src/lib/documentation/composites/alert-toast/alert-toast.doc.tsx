import * as React from 'react';
import { AlertToastItem, Button, type AlertToastConfig } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

let demoToastId = 0;

const DEMO_SEVERITIES: readonly { readonly label: string; readonly severity: AlertToastConfig['severity']; readonly message: string }[] = [
  { label: 'Add success', severity: 'success', message: 'Changes saved successfully.' },
  { label: 'Add warning', severity: 'warning', message: 'Your session expires in 5 minutes.' },
  { label: 'Add destructive', severity: 'destructive', message: 'Failed to delete the resource.' },
];

const AlertToastDemo = () => {
  const [toasts, setToasts] = React.useState<readonly AlertToastConfig[]>([]);

  const addToast = (severity: AlertToastConfig['severity'], message: string) => {
    const id = `demo-toast-${demoToastId++}`;
    setToasts((current) => [
      ...current,
      {
        id,
        message,
        severity,
        position: 'top-right',
        closeable: true,
        autoCloseMs: null,
        animation: { entry: 'fadeIn', exit: 'fadeOut', duration: 300 },
      },
    ]);
  };

  const closeToast = (id: string) => setToasts((current) => current.filter((toast) => toast.id !== id));

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {DEMO_SEVERITIES.map(({ label, severity, message }) => (
          <Button key={label} type="button" size="sm" variant="outlined" onClick={() => addToast(severity, message)}>
            {label}
          </Button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {toasts.map((toast) => (
          <AlertToastItem key={toast.id} {...toast} onClose={closeToast} />
        ))}
      </div>
    </div>
  );
};

const ALERT_TOAST_DOC: CompositeDoc = {
  overview: (
    <>
      AlertToast is the floating notification system layered on top of the inline Alert primitive:
      AlertViewport groups and positions any number of toasts by screen corner, while AlertToastItem
      renders one toast's card, entrance/exit animation, and optional auto-dismiss timer. It's designed
      to be mounted once near the app root — driven by whatever global state owns the active alert list —
      not embedded inline like a normal component. Enterprise use cases include save confirmations,
      background job failures, and session-expiry warnings that need to interrupt the user without
      blocking the page.
    </>
  ),
  importStatement: "import { AlertViewport, AlertToastItem } from '@inithium/ui';",
  composition: [
    { name: 'AlertViewport', role: "Groups active toasts by AlertPosition ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right') and stacks each group in a fixed-position corner." },
    { name: 'AlertToastItem', role: "Renders a single toast's card using the primitive AlertTitle/AlertDescription, colored via the 'toast' recipe, with imperative enter/exit animation and an optional auto-close timer." },
    { name: 'animate-orchestrator', role: 'Applies and cleans up animate.css entry/exit class names on the toast\'s DOM node and resolves once the animation completes.' },
  ],
  propGroups: [
    {
      component: 'AlertViewport',
      props: [
        { name: 'alerts', type: 'readonly AlertToastConfig[]', required: true, description: 'Every currently active toast, across all positions.' },
        { name: 'onClose', type: '(id: string) => void', required: true, description: 'Called once a toast finishes its exit animation and should be removed from state.' },
      ],
    },
    {
      component: 'AlertToastConfig',
      props: [
        { name: 'id', type: 'string', required: true, description: 'Stable identifier used for the exit callback and React key.' },
        { name: 'message', type: 'string', required: true, description: 'Toast body text.' },
        { name: 'title', type: 'string', description: 'Optional bold title above the message.' },
        { name: 'severity', type: "'default' | 'destructive' | 'success' | 'warning' | 'info'", description: "Colors the card via the 'toast' recipe. Omit for the neutral popover-surface treatment." },
        { name: 'position', type: 'AlertPosition', required: true, description: "Which screen corner this toast stacks in: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'." },
        { name: 'closeable', type: 'boolean', required: true, description: 'Shows a manual close button in the top-right corner of the card.' },
        { name: 'autoCloseMs', type: 'number | null', required: true, description: 'Auto-dismisses after this many milliseconds, or never when null.' },
        { name: 'animation', type: 'AnimationConfig', required: true, description: 'animate.css entry/exit class names and duration.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Severity-driven toast cards',
      description: 'AlertToastItem rendered directly, outside AlertViewport\'s fixed-position wrapper, so it stays inside this preview card instead of floating over the whole page — exactly how it behaves once AlertViewport stacks it in production.',
      code: `const [toasts, setToasts] = useState<readonly AlertToastConfig[]>([]);

const addToast = (severity: AlertToastConfig['severity'], message: string) => {
  setToasts((current) => [
    ...current,
    {
      id: crypto.randomUUID(),
      message,
      severity,
      position: 'top-right',
      closeable: true,
      autoCloseMs: null,
      animation: { entry: 'fadeIn', exit: 'fadeOut', duration: 300 }
    }
  ]);
};

// Normally mounted once at the app root:
<AlertViewport alerts={toasts} onClose={(id) => setToasts((c) => c.filter((t) => t.id !== id))} />`,
      preview: <AlertToastDemo />,
    },
  ],
};

export const AlertToastDoc = () => <CompositeDocView doc={ALERT_TOAST_DOC} />;

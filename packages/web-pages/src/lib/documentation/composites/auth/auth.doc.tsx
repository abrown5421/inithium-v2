import * as React from 'react';
import { AuthField, PasswordField } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

const AuthFieldsDemo = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <AuthField
        label="Email address"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        errorMessage={email.length > 0 && !email.includes('@') ? 'Enter a valid email address' : undefined}
      />
      <PasswordField
        label="Password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
    </div>
  );
};

const AUTH_DOC: CompositeDoc = {
  overview: (
    <>
      Auth groups two labeled, error-aware form fields built for sign-in/sign-up flows: AuthField pairs
      Label + Input + an inline error message for any text input type, and PasswordField adds a show/hide
      toggle button on top of the same pattern. Both auto-generate an accessible id/aria-describedby pair
      via React.useId when none is supplied. Enterprise use cases: login forms, password reset flows, and
      the email/password fields EntityFormDialog renders for its 'text'/'email'/'password' field types.
    </>
  ),
  importStatement: "import { AuthField, PasswordField } from '@inithium/ui';",
  composition: [
    { name: 'Label', role: 'Field label, with the same required-asterisk convention used across every form composite.' },
    { name: 'Input', role: 'The underlying field — AuthField renders it directly; PasswordField toggles its type between password and text.' },
    { name: 'Button', role: "PasswordField's show/hide toggle (ghost, icon-sized, Eye/EyeOff from lucide-react)." },
    { name: 'Text', role: 'Renders the inline destructive-colored error message when errorMessage is set.' },
  ],
  propGroups: [
    {
      component: 'AuthField',
      props: [
        { name: 'label', type: 'string', required: true, description: 'Field label text.' },
        { name: 'errorMessage', type: 'string', description: 'Renders as inline destructive text and sets the field to its error state.' },
        { name: 'containerClassName', type: 'string', description: 'Class name for the label+input+error wrapper.' },
        { name: '...InputProps', type: 'InputProps', description: 'Every native/Input prop (type, value, onChange, required, etc.) passes through.' },
      ],
    },
    {
      component: 'PasswordField',
      props: [
        { name: 'label', type: 'string', required: true, description: 'Field label text.' },
        { name: 'errorMessage', type: 'string', description: 'Renders as inline destructive text and sets the field to its error state.' },
        { name: 'containerClassName', type: 'string', description: 'Class name for the label+input+error wrapper.' },
        { name: '...InputProps', type: "Omit<InputProps, 'type'>", description: "Every Input prop except type, which PasswordField manages via its own visibility toggle." },
      ],
    },
  ],
  examples: [
    {
      title: 'Sign-in fields',
      description: 'AuthField validates inline in this demo; PasswordField manages its own show/hide state internally.',
      code: `<AuthField
  label="Email address"
  type="email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  errorMessage={isInvalid ? 'Enter a valid email address' : undefined}
/>
<PasswordField
  label="Password"
  required
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>`,
      preview: <AuthFieldsDemo />,
    },
  ],
};

export const AuthDoc = () => <CompositeDocView doc={AUTH_DOC} />;

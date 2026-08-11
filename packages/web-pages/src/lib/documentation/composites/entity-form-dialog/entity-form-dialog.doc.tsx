import * as React from 'react';
import { Button, EntityFormDialog, type FormFieldConfig } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

const DEMO_FIELDS: readonly FormFieldConfig[] = [
  { key: 'name', label: 'Name', type: 'text', required: true, autoComplete: 'name' },
  { key: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'member', label: 'Member' },
    ],
  },
  { key: 'active', label: 'Active', type: 'switch' },
];

const EntityFormDialogDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const errors: Record<string, string | undefined> = {};

  const handleChange = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
    }, 800);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite member</Button>
      <EntityFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Invite team member"
        fields={DEMO_FIELDS}
        values={values}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
        isSubmitting={isSubmitting}
        submitLabel="Send invite"
      />
    </>
  );
};

const ENTITY_FORM_DIALOG_DOC: CompositeDoc = {
  overview: (
    <>
      EntityFormDialog is a config-driven create/edit modal: field visibility, select options, and
      validation are all resolved by the caller — the component only renders what it's given, staying
      entirely unaware of any permission matrix or entity-specific rules. Fields lay out two-per-row (one
      per row on narrow viewports; fullWidth fields always take their own row), and only the field grid
      scrolls once a form is taller than the viewport — the submit button lives in a fixed footer, wired
      to the form via the HTML5 form attribute rather than nesting. Enterprise use cases: every CMS
      management page's create/edit modal (users, assets, pages, settings).
    </>
  ),
  importStatement: "import { EntityFormDialog } from '@inithium/ui';",
  composition: [
    { name: 'Dialog', role: 'The modal shell — header and footer stay fixed while the field grid scrolls independently.' },
    { name: 'AuthField / PasswordField', role: "Render for field.type: 'text' | 'email' | 'password'." },
    { name: 'Select', role: "Renders for field.type: 'select', from field.options." },
    { name: 'Switch', role: "Renders for field.type: 'switch', coerced to/from the string values model ('true'/'false')." },
    { name: 'ColorPicker', role: "Renders for field.type: 'color'." },
    { name: 'FileDropzone', role: 'Renders once, full-width, above the fields grid when fileField is supplied — for entities whose create flow is a file upload rather than a form field.' },
  ],
  propGroups: [
    {
      component: 'EntityFormDialog',
      props: [
        { name: 'open', type: 'boolean', required: true, description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Called on close via Cancel, Escape, or outside click.' },
        { name: 'title', type: 'string', required: true, description: 'Dialog title.' },
        { name: 'fileField', type: 'EntityFormDialogFileField', description: 'One dedicated File-valued slot, rendered full-width above the regular fields grid.' },
        { name: 'fields', type: 'readonly FormFieldConfig[]', required: true, description: 'Field definitions, rendered in order and filtered by field.visible.' },
        { name: 'values', type: 'Record<string, string>', required: true, description: "All field values as strings, including 'switch' ('true'/'false')." },
        { name: 'errors', type: 'Record<string, string | undefined>', required: true, description: 'Per-field error messages, keyed by field.key.' },
        { name: 'onChange', type: '(key: string, value: string) => void', required: true, description: 'Called whenever any field changes.' },
        { name: 'onSubmit', type: '(event: React.FormEvent<HTMLFormElement>) => void', required: true, description: 'Form submit handler.' },
        { name: 'onCancel', type: '() => void', required: true, description: 'Called from the Cancel button.' },
        { name: 'isSubmitting', type: 'boolean', required: true, description: 'Passed to the submit Button\'s loading prop.' },
        { name: 'submitLabel', type: 'string', required: true, description: 'Submit button label.' },
      ],
    },
    {
      component: 'FormFieldConfig',
      props: [
        { name: 'key', type: 'string', required: true, description: 'Key into values/errors/onChange.' },
        { name: 'label', type: 'string', required: true, description: 'Field label.' },
        { name: 'type', type: "'text' | 'email' | 'password' | 'select' | 'switch' | 'color' | 'custom'", required: true, description: 'Which control renders for this field.' },
        { name: 'required', type: 'boolean', description: 'Marks the field required.' },
        { name: 'options', type: 'readonly FormFieldOption[]', description: "Required for type: 'select'." },
        { name: 'visible', type: 'boolean', defaultValue: 'true', description: 'Omits the field entirely when false.' },
        { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: "Spans both grid columns instead of sharing a row." },
        { name: 'renderCustom', type: '(params: CustomFieldRenderParams) => React.ReactNode', description: "Required for type: 'custom' — full control over the field's markup." },
      ],
    },
  ],
  examples: [
    {
      title: 'Invite-member form',
      code: `const FIELDS: FormFieldConfig[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'role', label: 'Role', type: 'select', required: true, options: [
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' }
  ]},
  { key: 'active', label: 'Active', type: 'switch' }
];

<EntityFormDialog
  open={open}
  onOpenChange={setOpen}
  title="Invite team member"
  fields={FIELDS}
  values={values}
  errors={errors}
  onChange={(key, value) => setValues((v) => ({ ...v, [key]: value }))}
  onSubmit={handleSubmit}
  onCancel={() => setOpen(false)}
  isSubmitting={isSubmitting}
  submitLabel="Send invite"
/>`,
      preview: <EntityFormDialogDemo />,
    },
  ],
};

export const EntityFormDialogDoc = () => <CompositeDocView doc={ENTITY_FORM_DIALOG_DOC} />;

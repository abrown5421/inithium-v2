import * as React from 'react';
import { Button } from '../../primitives/button.js';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../primitives/dialog.js';
import { Label } from '../../primitives/label.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../primitives/select.js';
import { Switch } from '../../primitives/switch.js';
import { Text } from '../../primitives/text.js';
import { AuthField } from '../Auth/auth-field.js';
import { PasswordField } from '../Auth/password-field.js';
import { ColorPicker } from '../ColorPicker/color-picker.js';
import type { EntityFormDialogProps, FormFieldConfig } from './entity-form-dialog.types.js';

const renderField = (
  field: FormFieldConfig,
  value: string,
  error: string | undefined,
  onChange: (value: string) => void
): React.ReactNode => {
  switch (field.type) {
    case 'password':
      return (
        <PasswordField
          label={field.label}
          autoComplete={field.autoComplete ?? 'new-password'}
          required={field.required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          errorMessage={error}
        />
      );

    case 'select':
      return (
        <div className="flex flex-col gap-1.5">
          <Label required={field.required}>{field.label}</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger error={Boolean(error)}>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {(field.options ?? []).map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error ? (
            <Text as="span" size="xs" tone="destructive">
              {error}
            </Text>
          ) : null}
        </div>
      );

    case 'switch':
      return (
        <div className="flex items-center justify-between gap-2">
          <Label>{field.label}</Label>
          <Switch checked={value === 'true'} onCheckedChange={(checked) => onChange(checked ? 'true' : 'false')} />
        </div>
      );

    case 'color':
      return (
        <div className="flex flex-col gap-1.5">
          <Label required={field.required}>{field.label}</Label>
          <ColorPicker value={value} onValueChange={onChange} error={error} />
          {error ? (
            <Text as="span" size="xs" tone="destructive">
              {error}
            </Text>
          ) : null}
        </div>
      );

    case 'custom':
      return field.renderCustom?.({ value, onChange, error }) ?? null;

    case 'email':
    case 'text':
    default:
      return (
        <AuthField
          label={field.label}
          type={field.type === 'email' ? 'email' : 'text'}
          autoComplete={field.autoComplete}
          required={field.required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          errorMessage={error}
        />
      );
  }
};

/**
 * Config-driven create/edit modal. Field visibility, `select` options (including disabled
 * entries), and validation are all resolved by the caller — this composite only renders what
 * it's given, so it stays entirely unaware of any permission matrix or entity-specific rules.
 *
 * Fields lay out two-per-row (one per row on narrow viewports, `fullWidth` fields always take
 * their own row) so a long form fits more of itself above the fold. The header and footer stay
 * put while only the field grid scrolls once a form is still taller than the viewport allows —
 * the submit button lives in the footer but is wired to the form via the `form` attribute
 * (valid HTML5) rather than nesting, since the footer sits outside the scrollable region.
 */
export const EntityFormDialog: React.FC<EntityFormDialogProps> = ({
  open,
  onOpenChange,
  title,
  fields,
  values,
  errors,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel
}) => {
  const formId = React.useId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border p-6">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          id={formId}
          className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2"
          onSubmit={onSubmit}
          noValidate
        >
          {fields
            .filter((field) => field.visible ?? true)
            .map((field) => (
              <div key={field.key} className={field.fullWidth ? 'sm:col-span-2' : undefined}>
                {renderField(field, values[field.key] ?? '', errors[field.key], (value) => onChange(field.key, value))}
              </div>
            ))}
        </form>
        <DialogFooter className="shrink-0 border-t border-border p-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={isSubmitting}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

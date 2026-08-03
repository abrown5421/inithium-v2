import * as React from 'react';
import { Button } from '../../primitives/button.js';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../primitives/dialog.js';
import { Label } from '../../primitives/label.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../primitives/select.js';
import { Switch } from '../../primitives/switch.js';
import { Text } from '../../primitives/text.js';
import { AuthField } from '../Auth/auth-field.js';
import { PasswordField } from '../Auth/password-field.js';
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
          key={field.key}
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
        <div key={field.key} className="flex flex-col gap-1.5">
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
        <div key={field.key} className="flex items-center justify-between gap-2">
          <Label>{field.label}</Label>
          <Switch checked={value === 'true'} onCheckedChange={(checked) => onChange(checked ? 'true' : 'false')} />
        </div>
      );

    case 'email':
    case 'text':
    default:
      return (
        <AuthField
          key={field.key}
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
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        {fields
          .filter((field) => field.visible ?? true)
          .map((field) => renderField(field, values[field.key] ?? '', errors[field.key], (value) => onChange(field.key, value)))}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

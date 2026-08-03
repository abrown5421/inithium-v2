import * as React from 'react';

export type FormFieldType = 'text' | 'email' | 'password' | 'select' | 'switch';

export interface FormFieldOption {
  readonly value: string;
  readonly label: string;
  /** Shown but not selectable — e.g. a value outside the acting role's cap, kept visible so the field doesn't appear blank. */
  readonly disabled?: boolean;
}

export interface FormFieldConfig {
  readonly key: string;
  readonly label: string;
  readonly type: FormFieldType;
  readonly required?: boolean;
  /** Required for `type: 'select'`. Ignored otherwise. */
  readonly options?: readonly FormFieldOption[];
  /** Omits the field from the form entirely (e.g. password only on create, role only if the acting role may set it). Defaults to `true`. */
  readonly visible?: boolean;
  readonly autoComplete?: string;
}

export interface EntityFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  readonly fields: readonly FormFieldConfig[];
  /**
   * All field values as strings, including `type: 'switch'` (`'true'`/`'false'`) — this keeps a
   * single flat, serializable shape regardless of field type, mirroring the same convention
   * `SearchFilterBar`/the backend's `fieldType=boolean` coercion already use.
   */
  readonly values: Record<string, string>;
  readonly errors: Record<string, string | undefined>;
  readonly onChange: (key: string, value: string) => void;
  readonly onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  readonly onCancel: () => void;
  readonly isSubmitting: boolean;
  readonly submitLabel: string;
}

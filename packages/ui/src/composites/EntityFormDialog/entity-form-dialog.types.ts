import * as React from 'react';

export type FormFieldType = 'text' | 'email' | 'password' | 'select' | 'switch' | 'color' | 'custom';

export interface CustomFieldRenderParams {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly error: string | undefined;
}

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
  /** Spans both columns of the fields grid instead of sharing a row — for content that needs the room (a checkbox group, a longer description) or that reads better as its own section. */
  readonly fullWidth?: boolean;
  /**
   * Required for `type: 'custom'`. Full control over the field's markup (e.g. a multi-value
   * checkbox group) while still participating in the same values/errors/visible wiring as every
   * other field type — the value is still just a string, encoded however the caller likes.
   */
  readonly renderCustom?: (params: CustomFieldRenderParams) => React.ReactNode;
}

export interface EntityFormDialogFileField {
  readonly label: string;
  readonly value: File | null;
  readonly onChange: (file: File | null) => void;
  readonly error?: string;
  readonly accept?: string;
  readonly required?: boolean;
}

export interface EntityFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  /**
   * A `File` value doesn't fit the string-keyed `values` model every other field shares, so it's
   * not a `FormFieldConfig` entry — one dedicated slot, rendered full-width above the regular
   * fields grid, for entities (like Assets) whose create flow is a file upload rather than a form.
   */
  readonly fileField?: EntityFormDialogFileField;
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

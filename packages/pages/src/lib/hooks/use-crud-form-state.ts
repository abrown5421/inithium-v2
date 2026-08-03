import * as React from 'react';

export type CrudFormMode = 'create' | 'edit';

export interface CrudFormState<TValues extends Record<string, string>> {
  readonly isOpen: boolean;
  readonly mode: CrudFormMode;
  readonly values: TValues;
  readonly errors: Record<string, string | undefined>;
  readonly openCreate: (initialValues: TValues) => void;
  readonly openEdit: (initialValues: TValues) => void;
  readonly close: () => void;
  readonly setValue: (key: string, value: string) => void;
  readonly setErrors: (errors: Record<string, string | undefined>) => void;
}

/**
 * Open/mode/values/errors state for a create-or-edit form dialog, shared by any CMS entity page.
 * Validation (zod) and the actual submit/mutation call are entity-specific and stay in the page —
 * this only owns the mechanical open/close/value-tracking state around it.
 */
export const useCrudFormState = <TValues extends Record<string, string>>(emptyValues: TValues): CrudFormState<TValues> => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mode, setMode] = React.useState<CrudFormMode>('create');
  const [values, setValues] = React.useState<TValues>(emptyValues);
  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});

  const openCreate = React.useCallback((initialValues: TValues) => {
    setMode('create');
    setValues(initialValues);
    setErrors({});
    setIsOpen(true);
  }, []);

  const openEdit = React.useCallback((initialValues: TValues) => {
    setMode('edit');
    setValues(initialValues);
    setErrors({});
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => setIsOpen(false), []);

  const setValue = React.useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }) as TValues);
  }, []);

  return { isOpen, mode, values, errors, openCreate, openEdit, close, setValue, setErrors };
};

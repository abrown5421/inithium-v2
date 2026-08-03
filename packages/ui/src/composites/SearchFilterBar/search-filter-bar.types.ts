export type SearchFieldType = 'string' | 'enum' | 'boolean';

export interface SearchFieldOption {
  readonly value: string;
  readonly label: string;
}

export interface SearchFieldConfig {
  readonly value: string;
  readonly label: string;
  readonly type: SearchFieldType;
  /** Required for `type: 'enum'`. `type: 'boolean'` gets a fixed True/False pair regardless of this. */
  readonly options?: readonly SearchFieldOption[];
}

export interface SearchFilterBarProps {
  readonly fields: readonly SearchFieldConfig[];
  readonly field: string;
  readonly value: string;
  readonly onFieldChange: (field: string) => void;
  readonly onValueChange: (value: string) => void;
}

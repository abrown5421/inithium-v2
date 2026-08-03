import * as React from 'react';
import { Input } from '../../primitives/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../primitives/select.js';
import type { SearchFieldOption, SearchFilterBarProps } from './search-filter-bar.types.js';

const BOOLEAN_OPTIONS: readonly SearchFieldOption[] = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];

/**
 * Field-select + value widget for filtering a list: a Select for which field to search, and
 * either a free-text Input (`type: 'string'`) or a Select restricted to valid values
 * (`type: 'enum'`/`'boolean'`) for the value — free text can never match a closed set, so those
 * types never render a text box.
 */
export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  fields,
  field,
  value,
  onFieldChange,
  onValueChange
}) => {
  const activeField = fields.find((option) => option.value === field) ?? fields[0];

  return (
    <div className="flex gap-2">
      <Select value={field} onValueChange={onFieldChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fields.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {activeField?.type === 'string' ? (
        <Input
          placeholder={`Search by ${activeField.label.toLowerCase()}`}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        />
      ) : (
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={`Select a ${activeField?.label.toLowerCase() ?? 'value'}`} />
          </SelectTrigger>
          <SelectContent>
            {(activeField?.type === 'boolean' ? BOOLEAN_OPTIONS : activeField?.options ?? []).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

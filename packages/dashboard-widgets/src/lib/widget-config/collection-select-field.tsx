import { SelectField } from '@inithium/ui';
import { useGetReportableCollectionsQuery } from '@inithium/store';

export interface CollectionSelectFieldProps {
  readonly value: string;
  readonly onChange: (collectionName: string) => void;
  readonly errorMessage?: string;
}

export const CollectionSelectField = ({ value, onChange, errorMessage }: CollectionSelectFieldProps) => {
  const { data: collections, isLoading } = useGetReportableCollectionsQuery();

  return (
    <SelectField
      label="Target collection"
      value={value}
      onValueChange={onChange}
      options={(collections ?? []).map((name) => ({ value: name, label: name }))}
      placeholder={isLoading ? 'Loading collections…' : 'Select a collection'}
      errorMessage={errorMessage}
      disabled={isLoading}
      required
    />
  );
};

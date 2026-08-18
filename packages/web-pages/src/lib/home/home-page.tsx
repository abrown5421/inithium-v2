import * as React from 'react';
import { PageLayoutComponent } from '@inithium/pages';
import { Heading, AutoIncrementList, Input } from '@inithium/ui';

export const HomePage: PageLayoutComponent = ({ page }) => {
  const [headings, setHeadings] = React.useState<string[]>([page.pageName]);

  const createItem = React.useCallback(() => '', []);

  const renderItem = React.useCallback(
    ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
      <div className="flex items-center gap-2">
        
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter heading text..."
        />
      </div>
    ),
    []
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <AutoIncrementList<string>
        values={headings}
        onValuesChange={setHeadings}
        createItem={createItem}
        renderItem={renderItem}
        className="w-full max-w-md"
      />
    </div>
  );
};
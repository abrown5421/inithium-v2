import * as React from 'react';
import { PageLayoutComponent } from '@inithium/pages';
import { AssetPicker, Label, Text } from '@inithium/ui';

/** Demo GUID for the scoped test harness below — stands in for a real user `_id`. */
const DEMO_USER_ID = '6a70c8bdcb7a68d4acfb72d8';

export const HomePage: PageLayoutComponent = () => {
  const [scopedAsset, setScopedAsset] = React.useState('');
  const [unscopedAsset, setUnscopedAsset] = React.useState('');

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <Label>Scoped to a user (`user` provided)</Label>
          <AssetPicker
            value={scopedAsset}
            onValueChange={setScopedAsset}
            user={DEMO_USER_ID}
            placeholder="Type or click to pick an asset..."
            dialogTitle="Select an Asset"
            dialogDescription="Browsing only assets uploaded by this user."
          />
          <Text size="xs" tone="muted">
            user: {DEMO_USER_ID}
          </Text>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Unscoped (`user` omitted)</Label>
          <AssetPicker
            value={unscopedAsset}
            onValueChange={setUnscopedAsset}
            placeholder="Type or click to pick an asset..."
            dialogTitle="Select an Asset"
            assetCategory='fonts'
            dialogDescription="Browsing system assets and every user's uploads."
          />
        </div>
      </div>
    </div>
  );
};
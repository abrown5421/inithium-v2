import { Text } from '@inithium/ui';

export interface ColorSwatch {
  readonly label: string;
  readonly swatchClassName: string;
  readonly meta?: string;
}

export interface ColorSwatchGridProps {
  readonly swatches: readonly ColorSwatch[];
}

export const ColorSwatchGrid = ({ swatches }: ColorSwatchGridProps) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    {swatches.map((swatch) => (
      <div key={swatch.label} className="flex flex-col gap-2 rounded-lg border border-border p-3">
        <div className={`h-12 w-full rounded-md border border-border/50 ${swatch.swatchClassName}`} />
        <div className="flex flex-col">
          <Text as="span" size="sm" weight="medium">
            {swatch.label}
          </Text>
          {swatch.meta ? (
            <Text as="span" font="mono" size="xs" color="muted">
              {swatch.meta}
            </Text>
          ) : null}
        </div>
      </div>
    ))}
  </div>
);

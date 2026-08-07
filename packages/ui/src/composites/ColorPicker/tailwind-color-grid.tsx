import * as React from 'react';
import { Slider } from '../../primitives/slider.js';
import { Text } from '../../primitives/text.js';
import { cn } from '../../utils/cn.js';
import { ColorSwatch } from './color-swatch.js';
import { TAILWIND_SHADES, type TailwindPalette } from './tailwind-palette.js';

const REPRESENTATIVE_SHADE = '500';
const DEFAULT_SHADE_INDEX = TAILWIND_SHADES.indexOf(REPRESENTATIVE_SHADE);

export interface TailwindColorGridProps {
  palette: TailwindPalette;
  /** Fires with the resolved CSS color whenever the family or intensity changes. */
  onSelect: (color: string) => void;
  className?: string;
}

/** A family picker (swatch grid) plus a 100–950 intensity slider. */
export function TailwindColorGrid({ palette, onSelect, className }: TailwindColorGridProps) {
  const families = React.useMemo(() => Object.keys(palette), [palette]);
  const [family, setFamily] = React.useState(families[0]);
  const [shadeIndex, setShadeIndex] = React.useState(DEFAULT_SHADE_INDEX);

  const activeFamily = palette[family] ? family : families[0];
  const shade = TAILWIND_SHADES[shadeIndex] ?? REPRESENTATIVE_SHADE;
  const color = palette[activeFamily]?.[shade];

  const handleFamilySelect = (nextFamily: string) => {
    setFamily(nextFamily);
    const nextColor = palette[nextFamily]?.[shade];
    if (nextColor) onSelect(nextColor);
  };

  const handleShadeChange = ([nextIndex]: number[]) => {
    setShadeIndex(nextIndex);
    const nextShade = TAILWIND_SHADES[nextIndex];
    const nextColor = palette[activeFamily]?.[nextShade];
    if (nextColor) onSelect(nextColor);
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="grid grid-cols-8 gap-1.5" role="listbox" aria-label="Tailwind color family">
        {families.map((familyName) => (
          <button
            key={familyName}
            type="button"
            role="option"
            aria-selected={familyName === activeFamily}
            title={familyName}
            className="rounded-sm outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring/50"
            onClick={() => handleFamilySelect(familyName)}
          >
            <ColorSwatch
              color={palette[familyName][REPRESENTATIVE_SHADE]}
              size="sm"
              selected={familyName === activeFamily}
              aria-hidden="true"
            />
            <span className="sr-only">{familyName}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <ColorSwatch color={color ?? '#000000'} size="lg" aria-hidden="true" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Text size="xs" weight="medium" className="capitalize">
              {activeFamily}
            </Text>
            <Text size="xs" color="muted">
              {shade}
            </Text>
          </div>
          <Slider
            min={0}
            max={TAILWIND_SHADES.length - 1}
            step={1}
            value={[shadeIndex]}
            onValueChange={handleShadeChange}
            aria-label="Color intensity"
          />
        </div>
      </div>
    </div>
  );
}

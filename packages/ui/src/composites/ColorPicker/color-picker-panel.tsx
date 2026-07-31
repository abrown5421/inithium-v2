import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../primitives/tabs.js';
import { cn } from '../../utils/cn.js';
import { TailwindColorGrid } from './tailwind-color-grid.js';
import { ThemeColorList } from './theme-color-list.js';
import type { TailwindPalette } from './tailwind-palette.js';
import type { ThemeColorOption } from './theme-colors.js';

export interface ColorPickerPanelProps {
  tailwindColors: TailwindPalette;
  themeColors: readonly ThemeColorOption[];
  onSelect: (color: string) => void;
  className?: string;
}

/**
 * The picker popover's body. Shows both sources behind tabs when both are
 * supplied, otherwise renders whichever single source is available.
 */
export function ColorPickerPanel({
  tailwindColors,
  themeColors,
  onSelect,
  className,
}: ColorPickerPanelProps) {
  const hasTailwind = Object.keys(tailwindColors).length > 0;
  const hasTheme = themeColors.length > 0;

  if (hasTailwind && hasTheme) {
    return (
      <Tabs defaultValue="tailwind" className={cn('w-72', className)}>
        <TabsList className="w-full">
          <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>
        <TabsContent value="tailwind">
          <TailwindColorGrid palette={tailwindColors} onSelect={onSelect} />
        </TabsContent>
        <TabsContent value="theme">
          <ThemeColorList colors={themeColors} onSelect={onSelect} />
        </TabsContent>
      </Tabs>
    );
  }

  if (hasTailwind) {
    return (
      <TailwindColorGrid palette={tailwindColors} onSelect={onSelect} className={cn('w-72', className)} />
    );
  }

  if (hasTheme) {
    return <ThemeColorList colors={themeColors} onSelect={onSelect} className={cn('w-72', className)} />;
  }

  return null;
}

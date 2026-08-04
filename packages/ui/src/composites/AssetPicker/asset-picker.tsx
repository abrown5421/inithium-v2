import * as React from 'react';
import {
  Archive,
  File as GenericFileIcon,
  FileJson,
  FileText,
  FileType,
  Film,
  Image as ImageIcon,
  Music
} from 'lucide-react';
import type { AssetCategory, AssetWithUrl } from '@inithium/models';
import { Input } from '../../primitives/input.js';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '../../primitives/dialog.js';
import { Spinner } from '../../primitives/spinner.js';
import { cn } from '../../utils/cn.js';
import { SearchFilterBar } from '../SearchFilterBar/search-filter-bar.js';
import { PaginationControl } from '../Pagination/pagination-control.js';
import { useAssetPicker } from './use-asset-picker.js';
import type { AssetPickerProps } from './asset-picker.types.js';

type DialogState = { readonly isOpen: boolean };

const setOpenState = (isOpen: boolean) => (): DialogState => ({ isOpen });

const handleInputChange =
  (onValueChange?: (val: string) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>): void => {
    onValueChange?.(e.target.value);
  };

const handleInputClick =
  (setOpen: React.Dispatch<React.SetStateAction<DialogState>>, onClick?: React.MouseEventHandler<HTMLInputElement>) =>
  (e: React.MouseEvent<HTMLInputElement>): void => {
    onClick?.(e);
    setOpen(setOpenState(true));
  };

const handleInputFocus =
  (
    triggerOnFocus: boolean,
    setOpen: React.Dispatch<React.SetStateAction<DialogState>>,
    onFocus?: React.FocusEventHandler<HTMLInputElement>
  ) =>
  (e: React.FocusEvent<HTMLInputElement>): void => {
    onFocus?.(e);
    if (triggerOnFocus) {
      setOpen(setOpenState(true));
    }
  };

const handleSelectValue =
  (onValueChange?: (val: string) => void, setOpen?: React.Dispatch<React.SetStateAction<DialogState>>) =>
  (val: string): void => {
    onValueChange?.(val);
    setOpen?.(setOpenState(false));
  };

const CATEGORY_ICONS: Record<AssetCategory, typeof GenericFileIcon> = {
  images: ImageIcon,
  pdfs: FileText,
  videos: Film,
  audio: Music,
  fonts: FileType,
  archives: Archive,
  data: FileJson,
  other: GenericFileIcon
};

const AssetThumbnail: React.FC<{ asset: AssetWithUrl }> = ({ asset }) => {
  if (asset.category === 'images') {
    return (
      <img
        src={asset.url}
        alt={asset.originalName}
        className="size-16 rounded-md border border-border object-cover"
      />
    );
  }
  const Icon = CATEGORY_ICONS[asset.category];
  return (
    <div className="flex size-16 items-center justify-center rounded-md border border-border bg-muted">
      <Icon className="size-6 text-muted-foreground" aria-hidden="true" />
    </div>
  );
};

export const AssetPicker = React.forwardRef<HTMLInputElement, AssetPickerProps>(
  (
    {
      value,
      onValueChange,
      user,
      pageLimit,
      dialogTitle,
      dialogDescription,
      emptyMessage = 'No assets found',
      triggerOnFocus = false,
      onClick,
      onFocus,
      ...inputProps
    },
    ref
  ) => {
    const [{ isOpen }, setDialogState] = React.useState<DialogState>({ isOpen: false });

    const onOpenChange = React.useCallback((open: boolean) => setDialogState(setOpenState(open)), []);

    const selectValue = React.useMemo(
      () => handleSelectValue(onValueChange, setDialogState),
      [onValueChange]
    );

    const picker = useAssetPicker({ user, pageLimit });

    return (
      <>
        <Input
          {...inputProps}
          ref={ref}
          value={value}
          onChange={handleInputChange(onValueChange)}
          onClick={handleInputClick(setDialogState, onClick)}
          onFocus={handleInputFocus(triggerOnFocus, setDialogState, onFocus)}
        />

        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl">
            {(dialogTitle || dialogDescription) && (
              <DialogHeader>
                {dialogTitle && <DialogTitle>{dialogTitle}</DialogTitle>}
                {dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
              </DialogHeader>
            )}

            <SearchFilterBar
              fields={picker.searchableFields}
              field={picker.searchField}
              value={picker.searchValue}
              onFieldChange={picker.handleSearchFieldChange}
              onValueChange={picker.handleSearchValueChange}
            />

            {picker.isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner />
              </div>
            ) : picker.assets.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">{emptyMessage}</p>
            ) : (
              <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {picker.assets.map((asset) => (
                  <li key={asset._id}>
                    <button
                      type="button"
                      onClick={() => selectValue(asset.url)}
                      aria-pressed={value === asset.url}
                      className={cn(
                        'flex w-full flex-col items-center gap-1.5 rounded-md p-2 text-center transition-colors hover:bg-muted',
                        value === asset.url && 'bg-muted ring-2 ring-ring'
                      )}
                    >
                      <AssetThumbnail asset={asset} />
                      <span className="w-full truncate text-xs text-foreground">{asset.originalName}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <span />
              <PaginationControl
                currentPage={picker.currentPage}
                totalPages={picker.totalPages}
                onPageChange={picker.handlePageChange}
                className="justify-self-center"
              />
              <div className="justify-self-end">{picker.isFetching ? <Spinner size="sm" /> : null}</div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

AssetPicker.displayName = 'AssetPicker';

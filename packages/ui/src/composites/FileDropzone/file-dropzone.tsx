import * as React from 'react';
import { File as FileIcon, Upload, X } from 'lucide-react';
import { Button } from '../../primitives/button.js';
import { Text } from '../../primitives/text.js';
import { cn } from '../../utils/cn.js';
import type { FileDropzoneProps } from './file-dropzone.types.js';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Drag-and-drop single-file picker with a click-to-browse fallback. Once a file is selected it shows the name/size with a way to remove it, rather than the drop area. */
export const FileDropzone: React.FC<FileDropzoneProps> = ({ value, onChange, accept, error, disabled }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onChange(file);
  };

  if (value) {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-3 rounded-md border border-input bg-transparent p-3',
          error && 'border-destructive'
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <FileIcon className="size-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <Text size="sm" className="truncate">
              {value.name}
            </Text>
            <Text size="xs" tone="muted">
              {formatFileSize(value.size)}
            </Text>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label="Remove selected file"
          onClick={() => onChange(null)}
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(event) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragActive(false);
        if (!disabled) handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center outline-none transition-colors',
        isDragActive ? 'border-ring bg-accent/50' : 'border-input',
        error && 'border-destructive',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-accent/30',
        'focus-visible:ring-2 focus-visible:ring-ring/50'
      )}
    >
      <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
      <Text size="sm">Drag and drop a file here, or click to browse</Text>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
};

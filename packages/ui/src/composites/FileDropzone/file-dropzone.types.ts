export interface FileDropzoneProps {
  readonly value: File | null;
  readonly onChange: (file: File | null) => void;
  /** Passed straight through to the underlying `<input type="file" accept="...">`. */
  readonly accept?: string;
  readonly error?: boolean | string;
  readonly disabled?: boolean;
}

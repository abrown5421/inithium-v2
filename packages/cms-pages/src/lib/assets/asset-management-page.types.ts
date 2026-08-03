/** Scope of who a new asset belongs to — drives whether `onBehalfOfUserId` is sent at all. */
export type UploadScope = 'self' | 'on-behalf-of' | 'system';

export interface UploadFormValues {
  readonly [key: string]: string;
  readonly scope: UploadScope;
  readonly onBehalfOfUserId: string;
}

export interface RenameFormValues {
  readonly [key: string]: string;
  readonly originalName: string;
}

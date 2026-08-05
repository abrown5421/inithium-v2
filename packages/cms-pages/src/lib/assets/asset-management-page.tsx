import * as React from 'react';
import { z } from 'zod';
import {
  Archive,
  File as GenericFileIcon,
  FileJson,
  FileText,
  FileType,
  Film,
  Image as ImageIcon,
  Music,
  Pencil,
  Trash2
} from 'lucide-react';
import { PageLayoutComponent, useCrudFormState } from '@inithium/pages';
import { canAssignAssetIsSystem, canPerformAssetAction, getEditableAssetFields } from '@inithium/types';
import { ASSET_CATEGORIES, type AssetCategory, type AssetWithUrl } from '@inithium/models';
import { updateAssetSchema } from '@inithium/validators';
import {
  openAlert,
  selectCurrentUser,
  useAppDispatch,
  useAppSelector,
  useDeleteAssetByKeyMutation,
  useDeleteAssetsByKeysMutation,
  useReadAllAssetsQuery,
  useReadUsersByIdsQuery,
  useUpdateAssetMutation,
  useUploadAssetMutation
} from '@inithium/store';
import {
  Button,
  ConfirmDeleteDialog,
  DataTable,
  type DataTableColumn,
  EntityFormDialog,
  type FormFieldConfig,
  Heading,
  Label,
  type SearchFieldConfig,
  SearchFilterBar,
  Text,
  useEntityListState,
  UserPicker
} from '@inithium/ui';
import { RenameFormValues, UploadFormValues, UploadScope } from './asset-management-page.types.js';

const SUBMISSION_ERROR_MESSAGE = 'There was a problem with your submission';
const DELETE_ERROR_MESSAGE = 'There was a problem deleting the selected asset(s)';
const PAGE_LIMIT = 10;

const EMPTY_UPLOAD_FORM_VALUES: UploadFormValues = { scope: 'self', onBehalfOfUserId: '' };
const EMPTY_RENAME_FORM_VALUES: RenameFormValues = { originalName: '' };

const SCOPE_OPTIONS: readonly { value: string; label: string }[] = [
  { value: 'self', label: 'For Myself' },
  { value: 'on-behalf-of', label: 'On Behalf of a User' },
  { value: 'system', label: 'System Asset' }
];

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  images: 'Images',
  pdfs: 'PDFs',
  videos: 'Videos',
  audio: 'Audio',
  fonts: 'Fonts',
  archives: 'Archives',
  data: 'Data',
  other: 'Other'
};

const SEARCHABLE_FIELDS: readonly SearchFieldConfig[] = [
  { value: 'originalName', label: 'Name', type: 'string' },
  { value: 'isSystem', label: 'System Asset', type: 'boolean' },
  {
    value: 'category',
    label: 'Type',
    type: 'enum',
    options: ASSET_CATEGORIES.map((category) => ({ value: category, label: CATEGORY_LABELS[category] }))
  }
];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

const AssetIcon: React.FC<{ category: AssetCategory }> = ({ category }) => {
  const Icon = CATEGORY_ICONS[category];
  return <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />;
};

export const AssetManagementPage: PageLayoutComponent = () => {
  const dispatch = useAppDispatch();
  const actingRole = useAppSelector(selectCurrentUser)?.role ?? 'user';
  const canCreate = canPerformAssetAction(actingRole, 'create');
  const canDelete = canPerformAssetAction(actingRole, 'delete');
  const canUploadOnBehalfOf = getEditableAssetFields(actingRole).includes('onBehalfOfUserId');
  const canUploadUserAsset = canAssignAssetIsSystem(actingRole, 'false');

  const canEditAsset = (asset: AssetWithUrl): boolean => {
    if (!canPerformAssetAction(actingRole, 'update')) return false;
    if (actingRole === 'editor') return asset.isSystem;
    return true;
  };

  const listState = useEntityListState(SEARCHABLE_FIELDS[0].value);
  const activeSearchField =
    SEARCHABLE_FIELDS.find((option) => option.value === listState.searchField) ?? SEARCHABLE_FIELDS[0];
  const { data, isLoading, isFetching } = useReadAllAssetsQuery({
    page: listState.currentPage,
    limit: PAGE_LIMIT,
    field: listState.searchField,
    search: listState.searchValue,
    fieldType: activeSearchField.type
  });
  const [uploadAsset, { isLoading: isUploading }] = useUploadAssetMutation();
  const [updateAsset, { isLoading: isRenaming }] = useUpdateAssetMutation();
  const [deleteAssetByKey, { isLoading: isDeletingOne }] = useDeleteAssetByKeyMutation();
  const [deleteAssetsByKeys, { isLoading: isDeletingMany }] = useDeleteAssetsByKeysMutation();
  const isDeleting = isDeletingOne || isDeletingMany;

  const assets = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const uploaderIds = React.useMemo(
    () => Array.from(new Set(assets.filter((asset) => !asset.isSystem).map((asset) => asset.uploadedBy))),
    [assets]
  );
  const { data: uploaders } = useReadUsersByIdsQuery(uploaderIds, { skip: uploaderIds.length === 0 });
  const uploaderNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    (uploaders ?? []).forEach((user) => map.set(user._id, `${user.first_name} ${user.last_name}`));
    return map;
  }, [uploaders]);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | undefined>(undefined);
  const uploadFormState = useCrudFormState<UploadFormValues>(EMPTY_UPLOAD_FORM_VALUES);

  const [selectedAsset, setSelectedAsset] = React.useState<AssetWithUrl | null>(null);
  const renameFormState = useCrudFormState<RenameFormValues>(EMPTY_RENAME_FORM_VALUES);

  const [assetsPendingDelete, setAssetsPendingDelete] = React.useState<readonly AssetWithUrl[]>([]);

  const columns: readonly DataTableColumn<AssetWithUrl>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (asset) => (
        <a
          href={asset.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline"
        >
          <AssetIcon category={asset.category} />
          {asset.originalName}
        </a>
      )
    },
    { key: 'size', header: 'Size', render: (asset) => formatFileSize(asset.sizeBytes) },
    {
      key: 'owner',
      header: 'Owner',
      render: (asset) => (asset.isSystem ? 'System' : (uploaderNameById.get(asset.uploadedBy) ?? asset.uploadedBy))
    },
    { key: 'createdAt', header: 'Uploaded', render: (asset) => new Date(asset.createdAt).toLocaleDateString() }
  ];

  const uploadFormFields: readonly FormFieldConfig[] = canUploadOnBehalfOf
    ? [
        { key: 'scope', label: 'Scope', type: 'select', required: true, options: SCOPE_OPTIONS },
        {
          key: 'onBehalfOfUserId',
          label: 'User',
          type: 'custom',
          required: true,
          visible: uploadFormState.values.scope === 'on-behalf-of',
          renderCustom: ({ value, onChange, error }) => (
            <div className="flex flex-col gap-1.5">
              <Label required>User</Label>
              <UserPicker value={value} onChange={onChange} error={error} />
              {error ? (
                <Text as="span" size="xs" tone="destructive">
                  {error}
                </Text>
              ) : null}
            </div>
          )
        }
      ]
    : [];

  const openUploadDialog = () => {
    setSelectedFile(null);
    setFileError(undefined);
    uploadFormState.openCreate(EMPTY_UPLOAD_FORM_VALUES);
  };

  const openEditModal = (asset: AssetWithUrl) => {
    setSelectedAsset(asset);
    renameFormState.openEdit({ originalName: asset.originalName });
  };

  const handleUploadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setFileError('Choose a file to upload');
      return;
    }

    const scope = (canUploadOnBehalfOf ? uploadFormState.values.scope : 'system') as UploadScope;
    const isSystem = scope === 'system';
    const onBehalfOfUserId = scope === 'on-behalf-of' ? uploadFormState.values.onBehalfOfUserId : undefined;

    if (scope === 'on-behalf-of' && !onBehalfOfUserId) {
      uploadFormState.setErrors({ onBehalfOfUserId: 'Select a user' });
      return;
    }
    if (scope === 'self' && !canUploadUserAsset) {
      // Editors never see the "self"/"on-behalf-of" options at all, so this only guards direct misuse.
      return;
    }

    setFileError(undefined);
    uploadFormState.setErrors({});
    try {
      await uploadAsset({ file: selectedFile, isSystem, onBehalfOfUserId }).unwrap();
      dispatch(openAlert({ severity: 'success', message: 'Asset uploaded' }));
      uploadFormState.close();
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
    }
  };

  const handleRenameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedAsset) return;

    const result = updateAssetSchema.safeParse({ originalName: renameFormState.values.originalName });
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      renameFormState.setErrors({ originalName: fieldErrors.originalName?.[0] });
      return;
    }

    renameFormState.setErrors({});
    try {
      await updateAsset({ id: selectedAsset._id, data: result.data }).unwrap();
      dispatch(openAlert({ severity: 'success', message: 'Asset renamed' }));
      renameFormState.close();
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
    }
  };

  const openDeleteDialog = (asset: AssetWithUrl) => setAssetsPendingDelete([asset]);

  const openBulkDeleteDialog = () =>
    setAssetsPendingDelete(assets.filter((asset) => listState.selectedIds.has(asset._id)));

  const handleConfirmDelete = async () => {
    if (assetsPendingDelete.length === 0) return;
    try {
      if (assetsPendingDelete.length === 1) {
        await deleteAssetByKey(assetsPendingDelete[0].key).unwrap();
      } else {
        await deleteAssetsByKeys(assetsPendingDelete.map((asset) => asset.key)).unwrap();
      }
      dispatch(
        openAlert({
          severity: 'success',
          message: assetsPendingDelete.length === 1 ? 'Asset deleted' : `${assetsPendingDelete.length} assets deleted`
        })
      );
      listState.removeFromSelection(assetsPendingDelete.map((asset) => asset._id));
      setAssetsPendingDelete([]);
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: DELETE_ERROR_MESSAGE }));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Heading font='secondary' level={1}>Assets</Heading>
        <div className="flex items-center gap-2">
          {canDelete && listState.selectedIds.size > 1 ? (
            <Button type="button" variant="destructive" onClick={openBulkDeleteDialog}>
              Delete Selected ({listState.selectedIds.size})
            </Button>
          ) : null}
          {canCreate ? (
            <Button type="button" onClick={openUploadDialog}>
              Upload Asset
            </Button>
          ) : null}
        </div>
      </div>

      <SearchFilterBar
        fields={SEARCHABLE_FIELDS}
        field={listState.searchField}
        value={listState.searchValue}
        onFieldChange={listState.handleSearchFieldChange}
        onValueChange={listState.handleSearchValueChange}
      />

      <DataTable
        columns={columns}
        rows={assets}
        getRowId={(asset) => asset._id}
        getRowLabel={(asset) => asset.originalName}
        selectAllLabel="Select all assets on this page"
        isLoading={isLoading}
        isFetching={isFetching}
        currentPage={listState.currentPage}
        totalPages={totalPages}
        onPageChange={listState.handlePageChange}
        selectable={canDelete}
        selectedIds={listState.selectedIds}
        onToggleRow={listState.toggleSelected}
        onToggleAllOnPage={(checked) =>
          listState.toggleSelectAllOnPage(
            checked,
            assets.map((asset) => asset._id)
          )
        }
        renderRowActions={(asset) => (
          <>
            {canEditAsset(asset) ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Rename ${asset.originalName}`}
                onClick={() => openEditModal(asset)}
              >
                <Pencil className="size-4" />
              </Button>
            ) : null}
            {canDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Delete ${asset.originalName}`}
                onClick={() => openDeleteDialog(asset)}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </>
        )}
      />

      <EntityFormDialog
        open={uploadFormState.isOpen}
        onOpenChange={(open) => {
          if (!open) uploadFormState.close();
        }}
        title={canUploadOnBehalfOf ? 'Upload Asset' : 'Upload System Asset'}
        fileField={{
          label: 'File',
          value: selectedFile,
          onChange: (file) => {
            setSelectedFile(file);
            if (file) setFileError(undefined);
          },
          error: fileError,
          required: true
        }}
        fields={uploadFormFields}
        values={uploadFormState.values}
        errors={uploadFormState.errors}
        onChange={uploadFormState.setValue}
        onSubmit={handleUploadSubmit}
        onCancel={uploadFormState.close}
        isSubmitting={isUploading}
        submitLabel="Upload"
      />

      <EntityFormDialog
        open={renameFormState.isOpen}
        onOpenChange={(open) => {
          if (!open) renameFormState.close();
        }}
        title="Rename Asset"
        fields={[{ key: 'originalName', label: 'Name', type: 'text', required: true }]}
        values={renameFormState.values}
        errors={renameFormState.errors}
        onChange={renameFormState.setValue}
        onSubmit={handleRenameSubmit}
        onCancel={renameFormState.close}
        isSubmitting={isRenaming}
        submitLabel="Save"
      />

      <ConfirmDeleteDialog
        open={assetsPendingDelete.length > 0}
        onOpenChange={(open) => {
          if (!open) setAssetsPendingDelete([]);
        }}
        title={assetsPendingDelete.length === 1 ? 'Delete Asset' : 'Delete Assets'}
        description={
          <>
            {assetsPendingDelete.length === 1
              ? `This will permanently delete "${assetsPendingDelete[0]?.originalName}". `
              : assetsPendingDelete.length > 1
                ? `This will permanently delete ${assetsPendingDelete.length} assets. `
                : ''}
            This action cannot be undone.
          </>
        }
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

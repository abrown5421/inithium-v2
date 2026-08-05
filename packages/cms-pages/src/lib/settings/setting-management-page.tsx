import * as React from 'react';
import { z } from 'zod';
import { Pencil, Trash2 } from 'lucide-react';
import { PageLayoutComponent, useCrudFormState } from '@inithium/pages';
import { canPerformSettingAction } from '@inithium/types';
import type { AssetCategory, Setting } from '@inithium/models';
import { createSettingSchema, updateSettingSchema } from '@inithium/validators';
import {
  openAlert,
  selectCurrentUser,
  useAppDispatch,
  useAppSelector,
  useCreateSettingMutation,
  useDeleteSettingMutation,
  useDeleteSettingsMutation,
  useReadAllSettingsQuery,
  useUpdateSettingMutation
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
  SETTING_VALUE_TYPES,
  SettingValueEditor,
  type SettingValueEditorValue,
  type SettingValueType,
  Text,
  createEmptySettingValue,
  hasUnresolvedAssetCategory,
  hydrateSettingValue,
  toJsonValue,
  useEntityListState
} from '@inithium/ui';
import { SettingFormValues } from './setting-management-page.types.js';

const SUBMISSION_ERROR_MESSAGE = 'There was a problem with your submission';
const DELETE_ERROR_MESSAGE = 'There was a problem deleting the selected setting(s)';
const PAGE_LIMIT = 10;

const EMPTY_SETTING_FORM_VALUES: SettingFormValues = { settingName: '', settingType: 'string' };

const TYPE_LABELS: Record<SettingValueType, string> = {
  string: 'String',
  number: 'Number',
  boolean: 'Boolean',
  color: 'Color',
  asset: 'Asset',
  array: 'Array',
  object: 'Object'
};

const TYPE_OPTIONS = SETTING_VALUE_TYPES.map((type) => ({ value: type, label: TYPE_LABELS[type] }));

const SEARCHABLE_FIELDS: readonly SearchFieldConfig[] = [{ value: 'settingName', label: 'Setting Name', type: 'string' }];

const previewSettingValue = (setting: Setting): string => {
  const preview = JSON.stringify(setting.settingValue);
  return preview.length > 80 ? `${preview.slice(0, 80)}…` : preview;
};

const SETTING_COLUMNS: readonly DataTableColumn<Setting>[] = [
  { key: 'settingName', header: 'Setting Name', render: (setting) => setting.settingName },
  { key: 'settingValue', header: 'Value', render: previewSettingValue }
];

export const SettingManagementPage: PageLayoutComponent = () => {
  const dispatch = useAppDispatch();
  const actingRole = useAppSelector(selectCurrentUser)?.role ?? 'user';
  const canCreate = canPerformSettingAction(actingRole, 'create');
  const canEdit = canPerformSettingAction(actingRole, 'update');
  const canDelete = canPerformSettingAction(actingRole, 'delete');

  const listState = useEntityListState(SEARCHABLE_FIELDS[0].value);
  const { data, isLoading, isFetching } = useReadAllSettingsQuery({
    page: listState.currentPage,
    limit: PAGE_LIMIT,
    field: listState.searchField,
    search: listState.searchValue,
    fieldType: 'string'
  });
  const [createSetting, { isLoading: isCreating }] = useCreateSettingMutation();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();
  const [deleteSetting, { isLoading: isDeletingOne }] = useDeleteSettingMutation();
  const [deleteSettings, { isLoading: isDeletingMany }] = useDeleteSettingsMutation();
  const isDeleting = isDeletingOne || isDeletingMany;

  const formState = useCrudFormState<SettingFormValues>(EMPTY_SETTING_FORM_VALUES);
  const [selectedSetting, setSelectedSetting] = React.useState<Setting | null>(null);
  const [valueTree, setValueTree] = React.useState<SettingValueEditorValue>('');
  const [assetCategory, setAssetCategory] = React.useState<AssetCategory | undefined>(undefined);
  const [assetCategoryLocked, setAssetCategoryLocked] = React.useState(false);
  const [settingsPendingDelete, setSettingsPendingDelete] = React.useState<readonly Setting[]>([]);

  const settings = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const formFields: readonly FormFieldConfig[] = [
    { key: 'settingName', label: 'Setting Name', type: 'text', required: true },
    { key: 'settingType', label: 'Setting Type', type: 'select', required: true, options: TYPE_OPTIONS },
    {
      key: 'settingValue',
      label: 'Setting Value',
      type: 'custom',
      fullWidth: true,
      renderCustom: ({ error }) => (
        <div className="flex flex-col gap-1.5">
          <Label>Setting Value</Label>
          <SettingValueEditor
            type={formState.values.settingType as SettingValueType}
            value={valueTree}
            onChange={setValueTree}
            assetCategory={assetCategory}
            onAssetCategoryChange={setAssetCategory}
            assetCategoryLocked={assetCategoryLocked}
          />
          {error ? (
            <Text as="span" size="xs" tone="destructive">
              {error}
            </Text>
          ) : null}
        </div>
      )
    }
  ];

  const handleFieldChange = (key: string, nextValue: string) => {
    if (key === 'settingType') {
      setValueTree(createEmptySettingValue(nextValue as SettingValueType));
      setAssetCategory(undefined);
      setAssetCategoryLocked(false);
    }
    formState.setValue(key, nextValue);
  };

  const openCreateModal = () => {
    setSelectedSetting(null);
    setValueTree('');
    setAssetCategory(undefined);
    setAssetCategoryLocked(false);
    formState.openCreate(EMPTY_SETTING_FORM_VALUES);
  };

  const openEditModal = (setting: Setting) => {
    setSelectedSetting(setting);
    const inferred = hydrateSettingValue(setting.settingType, setting.settingSubType, setting.settingValue);
    setValueTree(inferred.value);
    setAssetCategory(inferred.assetCategory);
    setAssetCategoryLocked(Boolean(setting.settingSubType));
    formState.openEdit({ settingName: setting.settingName, settingType: inferred.type });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = formState.values;
    const settingType = values.settingType as SettingValueType;

    if (hasUnresolvedAssetCategory(settingType, valueTree, assetCategory)) {
      formState.setErrors({ settingValue: 'Choose which type of asset every asset field accepts before saving' });
      return;
    }

    const settingValue = toJsonValue(settingType, valueTree);
    const settingSubType = settingType === 'asset' ? assetCategory : undefined;

    if (formState.mode === 'create') {
      const result = createSettingSchema.safeParse({
        settingName: values.settingName,
        settingType,
        settingSubType,
        settingValue
      });
      if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);
        formState.setErrors({
          settingName: fieldErrors.settingName?.[0],
          settingValue: fieldErrors.settingValue?.[0] ?? fieldErrors.settingSubType?.[0]
        });
        return;
      }

      formState.setErrors({});
      try {
        await createSetting(result.data).unwrap();
        dispatch(openAlert({ severity: 'success', message: 'Setting created' }));
        formState.close();
      } catch {
        dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
      }
      return;
    }

    if (!selectedSetting) return;

    const result = updateSettingSchema.safeParse({
      settingName: values.settingName,
      settingType,
      settingSubType,
      settingValue
    });
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      formState.setErrors({
        settingName: fieldErrors.settingName?.[0],
        settingValue: fieldErrors.settingValue?.[0] ?? fieldErrors.settingSubType?.[0]
      });
      return;
    }

    formState.setErrors({});
    try {
      await updateSetting({ id: selectedSetting._id, data: result.data }).unwrap();
      dispatch(openAlert({ severity: 'success', message: 'Setting updated' }));
      formState.close();
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
    }
  };

  const openDeleteDialog = (setting: Setting) => setSettingsPendingDelete([setting]);

  const openBulkDeleteDialog = () =>
    setSettingsPendingDelete(settings.filter((setting) => listState.selectedIds.has(setting._id)));

  const handleConfirmDelete = async () => {
    if (settingsPendingDelete.length === 0) return;
    try {
      if (settingsPendingDelete.length === 1) {
        await deleteSetting(settingsPendingDelete[0]._id).unwrap();
      } else {
        await deleteSettings(settingsPendingDelete.map((setting) => setting._id)).unwrap();
      }
      dispatch(
        openAlert({
          severity: 'success',
          message:
            settingsPendingDelete.length === 1 ? 'Setting deleted' : `${settingsPendingDelete.length} settings deleted`
        })
      );
      listState.removeFromSelection(settingsPendingDelete.map((setting) => setting._id));
      setSettingsPendingDelete([]);
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: DELETE_ERROR_MESSAGE }));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Heading font='secondary' level={1}>Settings</Heading>
        <div className="flex items-center gap-2">
          {canDelete && listState.selectedIds.size > 1 ? (
            <Button type="button" variant="default"  onClick={openBulkDeleteDialog}>
              Delete Selected ({listState.selectedIds.size})
            </Button>
          ) : null}
          {canCreate ? (
            <Button type="button" onClick={openCreateModal}>
              Create New Setting
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
        columns={SETTING_COLUMNS}
        rows={settings}
        getRowId={(setting) => setting._id}
        getRowLabel={(setting) => setting.settingName}
        selectAllLabel="Select all settings on this page"
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
            settings.map((setting) => setting._id)
          )
        }
        renderRowActions={(setting) => (
          <>
            {canEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Edit ${setting.settingName}`}
                onClick={() => openEditModal(setting)}
              >
                <Pencil className="size-4" />
              </Button>
            ) : null}
            {canDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Delete ${setting.settingName}`}
                onClick={() => openDeleteDialog(setting)}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </>
        )}
      />

      <EntityFormDialog
        open={formState.isOpen}
        onOpenChange={(open) => {
          if (!open) formState.close();
        }}
        title={formState.mode === 'create' ? 'Create New Setting' : 'Edit Setting'}
        fields={formFields}
        values={formState.values}
        errors={formState.errors}
        onChange={handleFieldChange}
        onSubmit={handleFormSubmit}
        onCancel={formState.close}
        isSubmitting={isCreating || isUpdating}
        submitLabel={formState.mode === 'create' ? 'Create' : 'Save'}
      />

      <ConfirmDeleteDialog
        open={settingsPendingDelete.length > 0}
        onOpenChange={(open) => {
          if (!open) setSettingsPendingDelete([]);
        }}
        title={settingsPendingDelete.length === 1 ? 'Delete Setting' : 'Delete Settings'}
        description={
          <>
            {settingsPendingDelete.length === 1
              ? `This will permanently delete "${settingsPendingDelete[0]?.settingName}". `
              : settingsPendingDelete.length > 1
                ? `This will permanently delete ${settingsPendingDelete.length} settings. `
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

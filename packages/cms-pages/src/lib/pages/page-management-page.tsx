import * as React from 'react';
import { z } from 'zod';
import { Pencil, Trash2 } from 'lucide-react';
import { PageLayoutComponent, useCrudFormState, useEntityListState } from '@inithium/pages';
import {
  ANIMATE_ENTRIES,
  ANIMATE_EXITS,
  NAV_LOCATIONS,
  USER_ROLES,
  canEditPageLayoutField,
  canPerformPageAction,
  getEditablePageFields,
  type PageEditableField
} from '@inithium/types';
import type { Page } from '@inithium/models';
import { createPageSchema, updatePageSchema } from '@inithium/validators';
import {
  openAlert,
  selectCurrentUser,
  useAppDispatch,
  useAppSelector,
  useCreatePageMutation,
  useDeletePageMutation,
  useDeletePagesMutation,
  useReadAllPagesQuery,
  useUpdatePageMutation
} from '@inithium/store';
import {
  Button,
  Checkbox,
  ConfirmDeleteDialog,
  DataTable,
  type DataTableColumn,
  EntityFormDialog,
  type FormFieldConfig,
  Heading,
  Label,
  type SearchFieldConfig,
  SearchFilterBar,
  Text
} from '@inithium/ui';
import { PageFormValues } from './page-management-page.types.js';

const SUBMISSION_ERROR_MESSAGE = 'There was a problem with your submission';
const DELETE_ERROR_MESSAGE = 'There was a problem deleting the selected page(s)';
const PAGE_LIMIT = 10;

/** Pages default to being visible to every CMS-facing role, mirroring the existing seeded pages. */
const CMS_ROLES = ['super-admin', 'admin', 'editor', 'writer'] as const;

const EMPTY_PAGE_FORM_VALUES: PageFormValues = {
  id: '',
  pageName: '',
  route: '',
  app: 'cms',
  theme_backgroundColor: '#ffffff',
  theme_foregroundColor: '#000000',
  animations_entrance: 'fadeIn',
  animations_exit: 'fadeOut',
  accessControl_authenticated: 'true',
  accessControl_anonymousOnly: 'false',
  accessControl_roles: CMS_ROLES.join(','),
  flags_isActive: 'true',
  flags_isSystem: 'false',
  metadata_title: '',
  metadata_description: '',
  metadata_layout: 'default',
  navigation_enabled: 'false',
  navigation_label: '',
  navigation_location: 'cms',
  navigation_order: '',
  navigation_isButton: 'false'
};

const formatCamelCase = (value: string): string => {
  const spaced = value.replace(/([A-Z])/g, ' $1').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const formatToken = (token: string): string =>
  token
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const ENTRANCE_OPTIONS = ANIMATE_ENTRIES.map((value) => ({ value, label: formatCamelCase(value) }));
const EXIT_OPTIONS = ANIMATE_EXITS.map((value) => ({ value, label: formatCamelCase(value) }));
const APP_OPTIONS = [
  { value: 'cms', label: 'CMS' },
  { value: 'web', label: 'Web' }
];
const NAV_LOCATION_LABELS: Record<string, string> = { main: 'Main', profile: 'Profile', footer: 'Footer', cms: 'CMS' };
const NAV_LOCATION_OPTIONS = NAV_LOCATIONS.map((value) => ({ value, label: NAV_LOCATION_LABELS[value] ?? value }));

const SEARCHABLE_FIELDS: readonly SearchFieldConfig[] = [
  { value: 'pageName', label: 'Name', type: 'string' },
  { value: 'route', label: 'Route', type: 'string' },
  { value: 'app', label: 'App', type: 'enum', options: APP_OPTIONS }
];

const PAGE_COLUMNS: readonly DataTableColumn<Page>[] = [
  { key: 'pageName', header: 'Name', render: (page) => page.pageName },
  { key: 'route', header: 'Route', render: (page) => page.route },
  { key: 'app', header: 'App', render: (page) => (page.app === 'cms' ? 'CMS' : page.app) },
  { key: 'isActive', header: 'Active', render: (page) => (page.flags.isActive ? 'Yes' : 'No') }
];

/** Flattens a nested Zod error into `group_field` keys matching `PageFormValues`, dropping the numeric array index from the single navigation entry's path (e.g. `navigation.0.label` -> `navigation_label`). */
const flattenPageErrors = (error: z.ZodError): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.filter((segment) => typeof segment === 'string').join('_');
    if (key && !(key in result)) {
      result[key] = issue.message;
    }
  }
  return result;
};

const buildPageDto = (values: PageFormValues) => {
  const roles = values.accessControl_roles ? values.accessControl_roles.split(',').filter(Boolean) : [];
  const trimmedOrder = values.navigation_order.trim();
  const navigation =
    values.navigation_enabled === 'true'
      ? [
          {
            label: values.navigation_label,
            location: values.navigation_location,
            order: trimmedOrder === '' ? undefined : Number(trimmedOrder),
            isButton: values.navigation_isButton === 'true',
            resolveNavPath: null
          }
        ]
      : [];

  return {
    id: values.id,
    pageName: values.pageName,
    route: values.route,
    app: values.app,
    theme: { backgroundColor: values.theme_backgroundColor, foregroundColor: values.theme_foregroundColor },
    animations: { entrance: values.animations_entrance, exit: values.animations_exit },
    accessControl: {
      authenticated: values.accessControl_authenticated === 'true',
      anonymousOnly: values.accessControl_anonymousOnly === 'true',
      roles
    },
    flags: { isActive: values.flags_isActive === 'true', isSystem: values.flags_isSystem === 'true' },
    metadata: { title: values.metadata_title, description: values.metadata_description, layout: values.metadata_layout },
    navigation
  };
};

/** Only includes the top-level groups `editableFields` allows — `id` is never sent, since it's create-only by design. */
const buildUpdateDto = (
  values: PageFormValues,
  editableFields: readonly PageEditableField[]
): Record<string, unknown> => {
  const full = buildPageDto(values);
  const editable = new Set(editableFields);
  const dto: Record<string, unknown> = {};
  if (editable.has('pageName')) dto.pageName = full.pageName;
  if (editable.has('route')) dto.route = full.route;
  if (editable.has('app')) dto.app = full.app;
  if (editable.has('theme')) dto.theme = full.theme;
  if (editable.has('animations')) dto.animations = full.animations;
  if (editable.has('accessControl')) dto.accessControl = full.accessControl;
  if (editable.has('flags')) dto.flags = full.flags;
  if (editable.has('metadata')) dto.metadata = full.metadata;
  if (editable.has('navigation')) dto.navigation = full.navigation;
  return dto;
};

export const PageManagementPage: PageLayoutComponent = () => {
  const dispatch = useAppDispatch();
  const actingRole = useAppSelector(selectCurrentUser)?.role ?? 'user';
  const canCreate = canPerformPageAction(actingRole, 'create');
  const canDelete = canPerformPageAction(actingRole, 'delete');
  const editableFields = getEditablePageFields(actingRole);
  const canEditField = (field: PageEditableField) => editableFields.includes(field);
  const canEditLayout = canEditPageLayoutField(actingRole);

  const listState = useEntityListState(SEARCHABLE_FIELDS[0].value);
  const activeSearchField =
    SEARCHABLE_FIELDS.find((option) => option.value === listState.searchField) ?? SEARCHABLE_FIELDS[0];
  const { data, isLoading, isFetching } = useReadAllPagesQuery({
    page: listState.currentPage,
    limit: PAGE_LIMIT,
    field: listState.searchField,
    search: listState.searchValue,
    fieldType: activeSearchField.type
  });
  const [createPage, { isLoading: isCreating }] = useCreatePageMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();
  const [deletePage, { isLoading: isDeletingOne }] = useDeletePageMutation();
  const [deletePages, { isLoading: isDeletingMany }] = useDeletePagesMutation();
  const isDeleting = isDeletingOne || isDeletingMany;

  const formState = useCrudFormState<PageFormValues>(EMPTY_PAGE_FORM_VALUES);
  const [selectedPage, setSelectedPage] = React.useState<Page | null>(null);
  const [pagesPendingDelete, setPagesPendingDelete] = React.useState<readonly Page[]>([]);

  const pages = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const navigationEnabled = formState.values.navigation_enabled === 'true';

  const formFields: readonly FormFieldConfig[] = [
    { key: 'id', label: 'Page ID', type: 'text', required: true, visible: formState.mode === 'create' },
    { key: 'pageName', label: 'Page Name', type: 'text', required: true, visible: canEditField('pageName') },
    { key: 'route', label: 'Route', type: 'text', required: true, visible: canEditField('route'), autoComplete: 'off' },
    {
      key: 'app',
      label: 'App',
      type: 'select',
      required: true,
      options: APP_OPTIONS,
      visible: canEditField('app')
    },
    {
      key: 'theme_backgroundColor',
      label: 'Background Color',
      type: 'color',
      required: true,
      visible: canEditField('theme')
    },
    {
      key: 'theme_foregroundColor',
      label: 'Foreground Color',
      type: 'color',
      required: true,
      visible: canEditField('theme')
    },
    {
      key: 'animations_entrance',
      label: 'Entrance Animation',
      type: 'select',
      required: true,
      options: ENTRANCE_OPTIONS,
      visible: canEditField('animations')
    },
    {
      key: 'animations_exit',
      label: 'Exit Animation',
      type: 'select',
      required: true,
      options: EXIT_OPTIONS,
      visible: canEditField('animations')
    },
    {
      key: 'accessControl_authenticated',
      label: 'Requires Authentication',
      type: 'switch',
      visible: canEditField('accessControl')
    },
    {
      key: 'accessControl_anonymousOnly',
      label: 'Anonymous Only',
      type: 'switch',
      visible: canEditField('accessControl')
    },
    {
      key: 'accessControl_roles',
      label: 'Access Roles',
      type: 'custom',
      fullWidth: true,
      visible: canEditField('accessControl'),
      renderCustom: ({ value, onChange, error }) => {
        const selected = new Set(value ? value.split(',').filter(Boolean) : []);
        const toggleRole = (role: string, checked: boolean) => {
          const next = new Set(selected);
          if (checked) {
            next.add(role);
          } else {
            next.delete(role);
          }
          onChange(Array.from(next).join(','));
        };
        return (
          <div className="flex flex-col gap-1.5">
            <Label>Access Roles</Label>
            <div className="flex flex-wrap gap-3">
              {USER_ROLES.map((role) => (
                <label key={role} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selected.has(role)}
                    onCheckedChange={(checked) => toggleRole(role, checked === true)}
                  />
                  {formatToken(role)}
                </label>
              ))}
            </div>
            {error ? (
              <Text as="span" size="xs" tone="destructive">
                {error}
              </Text>
            ) : null}
          </div>
        );
      }
    },
    { key: 'flags_isActive', label: 'Active', type: 'switch', visible: canEditField('flags') },
    { key: 'flags_isSystem', label: 'System Page', type: 'switch', visible: canEditField('flags') },
    { key: 'metadata_title', label: 'Title', type: 'text', required: true, visible: canEditField('metadata') },
    {
      key: 'metadata_description',
      label: 'Description',
      type: 'text',
      fullWidth: true,
      visible: canEditField('metadata')
    },
    { key: 'metadata_layout', label: 'Layout', type: 'text', required: true, visible: canEditLayout },
    {
      key: 'navigation_enabled',
      label: 'Show in Navigation',
      type: 'switch',
      fullWidth: true,
      visible: canEditField('navigation')
    },
    {
      key: 'navigation_label',
      label: 'Navigation Label',
      type: 'text',
      required: true,
      visible: canEditField('navigation') && navigationEnabled
    },
    {
      key: 'navigation_location',
      label: 'Navigation Location',
      type: 'select',
      required: true,
      options: NAV_LOCATION_OPTIONS,
      visible: canEditField('navigation') && navigationEnabled
    },
    {
      key: 'navigation_order',
      label: 'Navigation Order',
      type: 'text',
      visible: canEditField('navigation') && navigationEnabled
    },
    {
      key: 'navigation_isButton',
      label: 'Show as Button',
      type: 'switch',
      visible: canEditField('navigation') && navigationEnabled
    }
  ];

  const openCreateModal = () => {
    setSelectedPage(null);
    formState.openCreate(EMPTY_PAGE_FORM_VALUES);
  };

  const openEditModal = (page: Page) => {
    setSelectedPage(page);
    const [navigationEntry] = page.navigation ?? [];
    formState.openEdit({
      id: page.id,
      pageName: page.pageName,
      route: page.route,
      app: page.app,
      theme_backgroundColor: page.theme.backgroundColor,
      theme_foregroundColor: page.theme.foregroundColor,
      animations_entrance: page.animations.entrance,
      animations_exit: page.animations.exit,
      accessControl_authenticated: String(page.accessControl.authenticated),
      accessControl_anonymousOnly: String(page.accessControl.anonymousOnly),
      accessControl_roles: page.accessControl.roles.join(','),
      flags_isActive: String(page.flags.isActive),
      flags_isSystem: String(page.flags.isSystem),
      metadata_title: page.metadata.title,
      metadata_description: page.metadata.description,
      metadata_layout: page.metadata.layout,
      navigation_enabled: navigationEntry ? 'true' : 'false',
      navigation_label: navigationEntry?.label ?? '',
      navigation_location: navigationEntry?.location ?? 'cms',
      navigation_order: navigationEntry?.order !== undefined ? String(navigationEntry.order) : '',
      navigation_isButton: navigationEntry?.isButton ? 'true' : 'false'
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.mode === 'create') {
      const result = createPageSchema.safeParse(buildPageDto(formState.values));
      if (!result.success) {
        formState.setErrors(flattenPageErrors(result.error));
        return;
      }

      formState.setErrors({});
      try {
        await createPage(result.data).unwrap();
        dispatch(openAlert({ severity: 'success', message: 'Page created' }));
        formState.close();
      } catch {
        dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
      }
      return;
    }

    if (!selectedPage) return;

    const result = updatePageSchema.safeParse(buildUpdateDto(formState.values, editableFields));
    if (!result.success) {
      formState.setErrors(flattenPageErrors(result.error));
      return;
    }

    formState.setErrors({});
    try {
      await updatePage({ id: selectedPage._id, data: result.data }).unwrap();
      dispatch(openAlert({ severity: 'success', message: 'Page updated' }));
      formState.close();
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: SUBMISSION_ERROR_MESSAGE }));
    }
  };

  const openDeleteDialog = (page: Page) => setPagesPendingDelete([page]);

  const openBulkDeleteDialog = () =>
    setPagesPendingDelete(pages.filter((page) => listState.selectedIds.has(page._id)));

  const handleConfirmDelete = async () => {
    if (pagesPendingDelete.length === 0) return;
    try {
      if (pagesPendingDelete.length === 1) {
        await deletePage(pagesPendingDelete[0]._id).unwrap();
      } else {
        await deletePages(pagesPendingDelete.map((page) => page._id)).unwrap();
      }
      dispatch(
        openAlert({
          severity: 'success',
          message: pagesPendingDelete.length === 1 ? 'Page deleted' : `${pagesPendingDelete.length} pages deleted`
        })
      );
      listState.removeFromSelection(pagesPendingDelete.map((page) => page._id));
      setPagesPendingDelete([]);
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: DELETE_ERROR_MESSAGE }));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Heading level={1}>Pages</Heading>
        <div className="flex items-center gap-2">
          {canDelete && listState.selectedIds.size > 1 ? (
            <Button type="button" variant="destructive" onClick={openBulkDeleteDialog}>
              Delete Selected ({listState.selectedIds.size})
            </Button>
          ) : null}
          {canCreate ? (
            <Button type="button" onClick={openCreateModal}>
              Create New Page
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
        columns={PAGE_COLUMNS}
        rows={pages}
        getRowId={(page) => page._id}
        getRowLabel={(page) => page.pageName}
        selectAllLabel="Select all pages on this page"
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
            pages.map((page) => page._id)
          )
        }
        renderRowActions={(page) => (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Edit ${page.pageName}`}
              onClick={() => openEditModal(page)}
            >
              <Pencil className="size-4" />
            </Button>
            {canDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Delete ${page.pageName}`}
                onClick={() => openDeleteDialog(page)}
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
        title={formState.mode === 'create' ? 'Create New Page' : 'Edit Page'}
        fields={formFields}
        values={formState.values}
        errors={formState.errors}
        onChange={formState.setValue}
        onSubmit={handleFormSubmit}
        onCancel={formState.close}
        isSubmitting={isCreating || isUpdating}
        submitLabel={formState.mode === 'create' ? 'Create' : 'Save'}
      />

      <ConfirmDeleteDialog
        open={pagesPendingDelete.length > 0}
        onOpenChange={(open) => {
          if (!open) setPagesPendingDelete([]);
        }}
        title={pagesPendingDelete.length === 1 ? 'Delete Page' : 'Delete Pages'}
        description={
          <>
            {pagesPendingDelete.length === 1
              ? `This will permanently delete "${pagesPendingDelete[0]?.pageName}". `
              : pagesPendingDelete.length > 1
                ? `This will permanently delete ${pagesPendingDelete.length} pages. `
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

import { CrudRepository, CrudService, createService } from '@inithium/crud-engine';
import { Setting, SettingValue } from '@inithium/models';
import { CreateSettingDTO, UpdateSettingDTO, createSettingSchema, updateSettingSchema } from '@inithium/validators';

export type SettingService = CrudService<Setting, CreateSettingDTO, UpdateSettingDTO>;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);

export const deserializeSettingValue = (value: unknown): SettingValue => {
  if (value instanceof Date) return value;
  if (typeof value === 'string') return ISO_DATE_PATTERN.test(value) ? new Date(value) : value;
  if (Array.isArray(value)) return value.map(deserializeSettingValue);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, deserializeSettingValue(entry)]));
  }
  return value as SettingValue;
};

export const serializeSettingValue = (value: SettingValue): unknown => {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serializeSettingValue);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, serializeSettingValue(entry as SettingValue)]));
  }
  return value;
};

const withDeserializedValue = <T extends { readonly settingValue?: unknown }>(dto: T): T =>
  dto.settingValue === undefined ? dto : ({ ...dto, settingValue: deserializeSettingValue(dto.settingValue) } as T);

const withSerializedValue = (setting: Setting): Setting => ({
  ...setting,
  settingValue: serializeSettingValue(setting.settingValue) as SettingValue
});

export const createSettingService = (repo: CrudRepository<Setting>): SettingService => {
  const baseCrud = createService<Setting, CreateSettingDTO, UpdateSettingDTO>(repo, createSettingSchema, updateSettingSchema);

  return {
    createOne: (dto) => baseCrud.createOne(withDeserializedValue(dto)).map(withSerializedValue),

    createMany: (dtos) => baseCrud.createMany(dtos.map(withDeserializedValue)).map((settings) => settings.map(withSerializedValue)),

    readOne: (id) => baseCrud.readOne(id).map(withSerializedValue),

    readMany: (ids) => baseCrud.readMany(ids).map((settings) => settings.map(withSerializedValue)),

    readAll: (page, limit, filter) =>
      baseCrud.readAll(page, limit, filter).map((result) => ({ ...result, data: result.data.map(withSerializedValue) })),

    updateOne: (id, dto) => baseCrud.updateOne(id, withDeserializedValue(dto)).map(withSerializedValue),

    updateMany: (items) =>
      baseCrud
        .updateMany(items.map((item) => ({ ...item, data: withDeserializedValue(item.data) })))
        .map((settings) => settings.map(withSerializedValue)),

    deleteOne: baseCrud.deleteOne,

    deleteMany: baseCrud.deleteMany
  };
};

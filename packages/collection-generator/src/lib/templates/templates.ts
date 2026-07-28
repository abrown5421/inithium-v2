import { CollectionFieldDefinition, CollectionFieldType } from '@inithium/models';
import { CollectionNames } from '../naming/naming.js';

const TS_TYPE_BY_FIELD_TYPE: Record<CollectionFieldType, string> = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'Date',
  objectId: 'string',
  'string-array': 'readonly string[]'
};

const ZOD_EXPRESSION_BY_FIELD_TYPE: Record<CollectionFieldType, string> = {
  string: 'z.string()',
  number: 'z.number()',
  boolean: 'z.boolean()',
  date: 'z.coerce.date()',
  objectId: 'z.string()',
  'string-array': 'z.array(z.string())'
};

const buildModelField = (field: CollectionFieldDefinition): string =>
  `  readonly ${field.name}${field.required ? '' : '?'}: ${TS_TYPE_BY_FIELD_TYPE[field.type]};`;

const buildValidatorField = (field: CollectionFieldDefinition): string =>
  `  ${field.name}: ${ZOD_EXPRESSION_BY_FIELD_TYPE[field.type]}${field.required ? '' : '.optional()'},`;

export const buildModelFileContent = (names: CollectionNames, fields: readonly CollectionFieldDefinition[]): string => {
  const fieldLines = fields.map(buildModelField).join('\n');
  return `import { BaseEntity } from '@inithium/types';

export interface ${names.pascalName} extends BaseEntity {
${fieldLines}
}
`;
};

export const buildValidatorsFileContent = (names: CollectionNames, fields: readonly CollectionFieldDefinition[]): string => {
  const fieldLines = fields.map(buildValidatorField).join('\n');
  return `import { z } from 'zod';

export const create${names.pascalName}Schema = z.object({
${fieldLines}
});

export const update${names.pascalName}Schema = create${names.pascalName}Schema.partial();

export type Create${names.pascalName}DTO = z.infer<typeof create${names.pascalName}Schema>;
export type Update${names.pascalName}DTO = z.infer<typeof update${names.pascalName}Schema>;
`;
};

export const buildCollectionFileContent = (names: CollectionNames): string => `import { Db } from 'mongodb';
import { Router } from 'express';
import { createRepository, createService, createCrudRouter, CrudRouterOptions } from '@inithium/crud-engine';
import { ${names.pascalName} } from '@inithium/models';
import {
  create${names.pascalName}Schema,
  update${names.pascalName}Schema,
  Create${names.pascalName}DTO,
  Update${names.pascalName}DTO
} from '@inithium/validators';

export interface ${names.pascalName}Collection {
  readonly service: ReturnType<typeof createService<${names.pascalName}, Create${names.pascalName}DTO, Update${names.pascalName}DTO>>;
  readonly router: Router;
}

export const create${names.pascalName}Collection = (db: Db, config: CrudRouterOptions): ${names.pascalName}Collection => {
  const repository = createRepository<${names.pascalName}>(db, '${names.pluralKebabName}');
  const service = createService<${names.pascalName}, Create${names.pascalName}DTO, Update${names.pascalName}DTO>(
    repository,
    create${names.pascalName}Schema,
    update${names.pascalName}Schema
  );
  const router = createCrudRouter(service, config);
  return { service, router };
};
`;

export const buildRtkQueryApiFileContent = (names: CollectionNames): string => `import { createApi } from '@reduxjs/toolkit/query/react';
import type { Create${names.pascalName}DTO, Update${names.pascalName}DTO } from '@inithium/validators';
import type { ${names.pascalName} } from '@inithium/models';
import { unwrappingBaseQuery } from './base-query.js';
import { createCrudEndpoints } from './crud-endpoints.js';

export const ${names.camelName}Api = createApi({
  reducerPath: '${names.camelName}Api',
  baseQuery: unwrappingBaseQuery,
  tagTypes: ['${names.pascalName}'],
  endpoints: (builder) =>
    createCrudEndpoints<${names.pascalName}, Create${names.pascalName}DTO, Update${names.pascalName}DTO, '${names.pascalName}', '${names.camelName}Api'>(
      builder,
      '${names.pluralKebabName}',
      '${names.pascalName}'
    )
});

export const {
  useReadAllQuery: useReadAll${names.pluralPascalName}Query,
  useReadOneQuery: useRead${names.pascalName}Query,
  useReadManyQuery: useRead${names.pluralPascalName}ByIdsQuery,
  useCreateOneMutation: useCreate${names.pascalName}Mutation,
  useCreateManyMutation: useCreate${names.pluralPascalName}Mutation,
  useUpdateOneMutation: useUpdate${names.pascalName}Mutation,
  useUpdateManyMutation: useUpdate${names.pluralPascalName}Mutation,
  useDeleteOneMutation: useDelete${names.pascalName}Mutation,
  useDeleteManyMutation: useDelete${names.pluralPascalName}Mutation
} = ${names.camelName}Api;
`;

export const buildBarrelIndexContent = (fileName: string): string => `export * from './${fileName}';\n`;
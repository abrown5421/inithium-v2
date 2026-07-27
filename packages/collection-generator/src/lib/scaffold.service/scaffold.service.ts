import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { FileManagerService } from '@inithium/file-manager';
import { CollectionDefinition } from '@inithium/models';
import { buildCollectionNames, CollectionNames } from '../naming/naming.js';
import { buildBarrelIndexContent, buildCollectionFileContent, buildModelFileContent, buildValidatorsFileContent } from '../templates/templates.js';
import { appendLine, insertBeforeMarker, removeLineContaining } from '../file-patcher/file-patcher.js';

export interface CollectionGeneratorConfig {
  readonly fileManagerService: FileManagerService;
}

const MAIN_TS_PATH = 'apps/api/src/main.ts';
const MODELS_BARREL_PATH = 'packages/models/src/index.ts';
const VALIDATORS_BARREL_PATH = 'packages/validators/src/index.ts';
const COLLECTIONS_BARREL_PATH = 'packages/collections/src/index.ts';

const IMPORTS_MARKER = '// collection-generator:imports';
const INSTANCES_MARKER = '// collection-generator:instances';
const ROUTES_MARKER = '// collection-generator:routes';

const modelFilePath = (names: CollectionNames): string => `packages/models/src/lib/${names.kebabName}/${names.kebabName}.model.ts`;
const modelIndexPath = (names: CollectionNames): string => `packages/models/src/lib/${names.kebabName}/index.ts`;
const validatorsFilePath = (names: CollectionNames): string => `packages/validators/src/lib/${names.kebabName}/${names.kebabName}.validators.ts`;
const validatorsIndexPath = (names: CollectionNames): string => `packages/validators/src/lib/${names.kebabName}/index.ts`;
const collectionFilePath = (names: CollectionNames): string => `packages/collections/src/lib/${names.kebabName}/${names.kebabName}.collection.ts`;
const collectionIndexPath = (names: CollectionNames): string => `packages/collections/src/lib/${names.kebabName}/index.ts`;

const toBase64 = (content: string): string => Buffer.from(content).toString('base64');

export const scaffoldCollection = (
  definition: CollectionDefinition,
  config: CollectionGeneratorConfig
): ResultAsync<void, AppError> => {
  const names = buildCollectionNames(definition.name, definition.pluralName);
  const { fileManagerService } = config;

  return fileManagerService
    .createFile({ filePath: modelFilePath(names), fileContent: toBase64(buildModelFileContent(names, definition.fields)) })
    .andThen(() =>
      fileManagerService.createFile({
        filePath: modelIndexPath(names),
        fileContent: toBase64(buildBarrelIndexContent(`${names.kebabName}.model.js`))
      })
    )
    .andThen(() =>
      fileManagerService.createFile({
        filePath: validatorsFilePath(names),
        fileContent: toBase64(buildValidatorsFileContent(names, definition.fields))
      })
    )
    .andThen(() =>
      fileManagerService.createFile({
        filePath: validatorsIndexPath(names),
        fileContent: toBase64(buildBarrelIndexContent(`${names.kebabName}.validators.js`))
      })
    )
    .andThen(() =>
      fileManagerService.createFile({ filePath: collectionFilePath(names), fileContent: toBase64(buildCollectionFileContent(names)) })
    )
    .andThen(() =>
      fileManagerService.createFile({
        filePath: collectionIndexPath(names),
        fileContent: toBase64(buildBarrelIndexContent(`${names.kebabName}.collection.js`))
      })
    )
    .andThen(() => appendLine(fileManagerService, MODELS_BARREL_PATH, `export * from './lib/${names.kebabName}/index.js';`))
    .andThen(() => appendLine(fileManagerService, VALIDATORS_BARREL_PATH, `export * from './lib/${names.kebabName}/index.js';`))
    .andThen(() => appendLine(fileManagerService, COLLECTIONS_BARREL_PATH, `export * from './lib/${names.kebabName}/index.js';`))
    .andThen(() =>
      insertBeforeMarker(fileManagerService, MAIN_TS_PATH, IMPORTS_MARKER, `import { create${names.pascalName}Collection } from '@inithium/collections';`)
    )
    .andThen(() =>
      insertBeforeMarker(
        fileManagerService,
        MAIN_TS_PATH,
        INSTANCES_MARKER,
        `  const ${names.camelName}Collection = create${names.pascalName}Collection(db, { authenticate, publicRoutes: [] });`
      )
    )
    .andThen(() =>
      insertBeforeMarker(fileManagerService, MAIN_TS_PATH, ROUTES_MARKER, `  app.use('/${names.pluralKebabName}', ${names.camelName}Collection.router);`)
    );
};

export const rescaffoldCollection = (
  definition: CollectionDefinition,
  config: CollectionGeneratorConfig
): ResultAsync<void, AppError> => {
  const names = buildCollectionNames(definition.name, definition.pluralName);
  const { fileManagerService } = config;

  return fileManagerService
    .updateFile({ filePath: modelFilePath(names), fileContent: toBase64(buildModelFileContent(names, definition.fields)) })
    .andThen(() =>
      fileManagerService.updateFile({
        filePath: validatorsFilePath(names),
        fileContent: toBase64(buildValidatorsFileContent(names, definition.fields))
      })
    )
    .map(() => undefined);
};

export const unscaffoldCollection = (
  definition: CollectionDefinition,
  config: CollectionGeneratorConfig
): ResultAsync<void, AppError> => {
  const names = buildCollectionNames(definition.name, definition.pluralName);
  const { fileManagerService } = config;

  return fileManagerService
    .deleteFile({ filePath: modelFilePath(names) })
    .andThen(() => fileManagerService.deleteFile({ filePath: modelIndexPath(names) }))
    .andThen(() => fileManagerService.deleteFile({ filePath: validatorsFilePath(names) }))
    .andThen(() => fileManagerService.deleteFile({ filePath: validatorsIndexPath(names) }))
    .andThen(() => fileManagerService.deleteFile({ filePath: collectionFilePath(names) }))
    .andThen(() => fileManagerService.deleteFile({ filePath: collectionIndexPath(names) }))
    .andThen(() => removeLineContaining(fileManagerService, MODELS_BARREL_PATH, `/${names.kebabName}/index.js`))
    .andThen(() => removeLineContaining(fileManagerService, VALIDATORS_BARREL_PATH, `/${names.kebabName}/index.js`))
    .andThen(() => removeLineContaining(fileManagerService, COLLECTIONS_BARREL_PATH, `/${names.kebabName}/index.js`))
    .andThen(() => removeLineContaining(fileManagerService, MAIN_TS_PATH, `create${names.pascalName}Collection`))
    .andThen(() => removeLineContaining(fileManagerService, MAIN_TS_PATH, `${names.camelName}Collection`));
};
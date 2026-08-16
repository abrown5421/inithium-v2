import { ResultAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { CollectionDefinitionService } from '@inithium/collection-generator';

export const STATIC_REPORTABLE_COLLECTIONS = ['users', 'assets', 'pages'] as const;

const REPORTABLE_COLLECTIONS_PAGE_LIMIT = 500;

export interface ReportableCollectionsResolverConfig {
  readonly staticCollections: readonly string[];
  readonly collectionDefinitionService: CollectionDefinitionService;
}

export interface ReportableCollectionsResolver {
  readonly listAll: () => ResultAsync<readonly string[], AppError>;
  readonly isAllowed: (collectionName: string) => ResultAsync<boolean, AppError>;
}

export const createReportableCollectionsResolver = (
  config: ReportableCollectionsResolverConfig
): ReportableCollectionsResolver => {
  const listAll = (): ResultAsync<readonly string[], AppError> =>
    config.collectionDefinitionService
      .readAll(1, REPORTABLE_COLLECTIONS_PAGE_LIMIT)
      .map((page) => [
        ...new Set([...config.staticCollections, ...page.data.map((definition) => definition.pluralName)])
      ]);

  return {
    listAll,
    isAllowed: (collectionName) => listAll().map((names) => names.includes(collectionName))
  };
};

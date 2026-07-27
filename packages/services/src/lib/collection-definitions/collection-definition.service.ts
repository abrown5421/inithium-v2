import { errAsync } from 'neverthrow';
import { AppError } from '@inithium/types';
import { CrudRepository, CrudService, createService } from '@inithium/crud-engine';
import { CollectionDefinition } from '@inithium/models';
import {
  CreateCollectionDefinitionDTO,
  UpdateCollectionDefinitionDTO,
  createCollectionDefinitionSchema,
  updateCollectionDefinitionSchema
} from '@inithium/validators';
import { scaffoldCollection, rescaffoldCollection, unscaffoldCollection, CollectionGeneratorConfig } from '@inithium/collection-generator';

export type CollectionDefinitionService = CrudService<CollectionDefinition, CreateCollectionDefinitionDTO, UpdateCollectionDefinitionDTO>;

export const createCollectionDefinitionService = (
  repo: CrudRepository<CollectionDefinition>,
  generatorConfig: CollectionGeneratorConfig
): CollectionDefinitionService => {
  const baseCrud = createService<CollectionDefinition, CreateCollectionDefinitionDTO, UpdateCollectionDefinitionDTO>(
    repo,
    createCollectionDefinitionSchema,
    updateCollectionDefinitionSchema
  );

  return {
    ...baseCrud,

    createOne: (dto) =>
      baseCrud.createOne(dto).andThen((definition) =>
        scaffoldCollection(definition, generatorConfig)
          .map(() => definition)
          .orElse((scaffoldError: AppError) =>
            repo
              .deleteOne(definition._id)
              .orElse((cleanupError) => {
                console.error(
                  `Failed to roll back orphaned collection-definition "${definition.name}" after a scaffold failure`,
                  cleanupError
                );
                return errAsync(scaffoldError);
              })
              .andThen(() => errAsync(scaffoldError))
          )
      ),

    updateOne: (id, dto) =>
      baseCrud.updateOne(id, dto).andThen((definition) => rescaffoldCollection(definition, generatorConfig).map(() => definition)),

    deleteOne: (id) =>
      baseCrud
        .readOne(id)
        .andThen((definition) => unscaffoldCollection(definition, generatorConfig).andThen(() => baseCrud.deleteOne(id)))
  };
};
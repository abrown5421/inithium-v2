import { z } from 'zod';

export const collectionFieldTypeSchema = z.enum(['string', 'number', 'boolean', 'date', 'objectId', 'string-array']);

export const crudOperationSchema = z.enum([
  'createOne',
  'createMany',
  'readOne',
  'readMany',
  'readAll',
  'updateOne',
  'updateMany',
  'deleteOne',
  'deleteMany'
]);

const collectionNamePattern = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

export const collectionFieldDefinitionSchema = z.object({
  name: z.string().min(1).regex(/^[a-zA-Z][a-zA-Z0-9]*$/),
  type: collectionFieldTypeSchema,
  required: z.boolean(),
  unique: z.boolean().optional()
});

export const createCollectionDefinitionSchema = z.object({
  name: z.string().min(1).regex(collectionNamePattern),
  pluralName: z.string().min(1).regex(collectionNamePattern),
  fields: z.array(collectionFieldDefinitionSchema).min(1),
  publicRoutes: z.array(crudOperationSchema).optional()
});

export const updateCollectionDefinitionSchema = z.object({
  fields: z.array(collectionFieldDefinitionSchema).min(1).optional(),
  publicRoutes: z.array(crudOperationSchema).optional()
});

export type CreateCollectionDefinitionDTO = z.infer<typeof createCollectionDefinitionSchema>;
export type UpdateCollectionDefinitionDTO = z.infer<typeof updateCollectionDefinitionSchema>;
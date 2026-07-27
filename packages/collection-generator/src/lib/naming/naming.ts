export const toPascalCase = (kebab: string): string =>
  kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

export const toCamelCase = (kebab: string): string => {
  const pascal = toPascalCase(kebab);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

export interface CollectionNames {
  readonly kebabName: string;
  readonly pascalName: string;
  readonly camelName: string;
  readonly pluralKebabName: string;
}

export const buildCollectionNames = (name: string, pluralName: string): CollectionNames => ({
  kebabName: name,
  pascalName: toPascalCase(name),
  camelName: toCamelCase(name),
  pluralKebabName: pluralName
});
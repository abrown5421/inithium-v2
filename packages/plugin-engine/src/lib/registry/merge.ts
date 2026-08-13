/** Merges a core registry map with plugin-contributed entries; later (plugin) keys win on collision. */
export const mergeRegistryMaps = <T>(
  core: Readonly<Record<string, T>>,
  contributed: Readonly<Record<string, T>>
): Readonly<Record<string, T>> => ({ ...core, ...contributed });

export const mergeRegistryLists = <T>(core: readonly T[], contributed: readonly T[]): readonly T[] => [
  ...core,
  ...contributed
];

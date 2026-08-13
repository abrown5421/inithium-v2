import { Result, ok, err } from 'neverthrow';
import { AppError, createValidationError } from '@inithium/types';
import type { PluginMeta } from '../contracts/plugin-meta.types.js';

/** Kahn's algorithm. Deterministic: ties are broken by plugin id so init order is reproducible. */
export const topologicallySortPlugins = <TModule extends PluginMeta>(
  plugins: readonly TModule[]
): Result<readonly TModule[], AppError> => {
  const byId = new Map(plugins.map((plugin) => [plugin.id, plugin] as const));

  for (const plugin of plugins) {
    for (const dependencyId of plugin.dependsOn ?? []) {
      if (!byId.has(dependencyId)) {
        return err(createValidationError(`Plugin "${plugin.id}" depends on unknown plugin "${dependencyId}"`));
      }
    }
  }

  const inDegree = new Map<string, number>(plugins.map((plugin) => [plugin.id, 0]));
  const dependents = new Map<string, string[]>(plugins.map((plugin) => [plugin.id, []]));

  for (const plugin of plugins) {
    for (const dependencyId of plugin.dependsOn ?? []) {
      inDegree.set(plugin.id, (inDegree.get(plugin.id) ?? 0) + 1);
      dependents.get(dependencyId)?.push(plugin.id);
    }
  }

  const queue = [...inDegree.entries()]
    .filter(([, degree]) => degree === 0)
    .map(([id]) => id)
    .sort();

  const sorted: TModule[] = [];

  while (queue.length > 0) {
    const id = queue.shift() as string;
    const plugin = byId.get(id);
    if (plugin) sorted.push(plugin);

    const nextReady: string[] = [];
    for (const dependentId of dependents.get(id) ?? []) {
      const remaining = (inDegree.get(dependentId) ?? 0) - 1;
      inDegree.set(dependentId, remaining);
      if (remaining === 0) nextReady.push(dependentId);
    }
    queue.push(...nextReady.sort());
  }

  if (sorted.length !== plugins.length) {
    return err(createValidationError('Circular dependency detected among plugin dependsOn declarations'));
  }

  return ok(sorted);
};

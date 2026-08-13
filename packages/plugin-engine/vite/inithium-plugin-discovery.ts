import path from 'node:path';
import type { Plugin } from 'vite';
import { discoverInstalledPluginPackageNames } from '../src/lib/server/discovery.server.js';

const VIRTUAL_MODULE_ID = 'virtual:inithium-plugins';
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

export interface InithiumPluginDiscoveryOptions {
  /** Absolute path to the workspace root whose `node_modules` should be scanned for plugin packages. */
  readonly workspaceRoot: string;
}

/**
 * Seeds a `virtual:inithium-plugins` module with a static `import` per discovered plugin's
 * `./client` entry point, so Rollup's static module graph picks up plugin UI with zero core-file
 * edits. Regenerated on dev-server start / build start — installing a new plugin package requires
 * a restart, which is an inherent limit of static bundling, not a gap in this plugin.
 */
export const inithiumPluginDiscovery = (options: InithiumPluginDiscoveryOptions): Plugin => {
  const nodeModulesDir = path.join(options.workspaceRoot, 'node_modules');

  return {
    name: 'inithium-plugin-discovery',
    resolveId(id) {
      return id === VIRTUAL_MODULE_ID ? RESOLVED_VIRTUAL_MODULE_ID : undefined;
    },
    async load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return undefined;

      const packageNames = await discoverInstalledPluginPackageNames(nodeModulesDir);
      const imports = packageNames
        .map((name, index) => `import * as plugin_${index} from ${JSON.stringify(`${name}/client`)};`)
        .join('\n');
      const entries = packageNames.map((_, index) => `plugin_${index}.default`).join(', ');

      return `${imports}\nexport const plugins = [${entries}].filter(Boolean);\n`;
    }
  };
};

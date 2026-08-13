import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { PluginServerModule } from '../contracts/plugin-server.types.js';

interface PackageJsonWithPluginMarker {
  readonly name?: string;
  readonly inithium?: { readonly plugin?: boolean };
}

const readPackageJsonSafe = async (packageDir: string): Promise<PackageJsonWithPluginMarker | undefined> => {
  try {
    const raw = await readFile(path.join(packageDir, 'package.json'), 'utf-8');
    return JSON.parse(raw) as PackageJsonWithPluginMarker;
  } catch {
    return undefined;
  }
};

// npm workspace packages live in node_modules as symlinks — Dirent.isDirectory() reports `false`
// for a symlink on Windows (it doesn't follow the link), so symlink entries must be treated as
// directory candidates too; readPackageJsonSafe's try/catch discards anything that turns out not
// to be one.
const isDirectoryCandidate = (entry: { isDirectory(): boolean; isSymbolicLink(): boolean }): boolean =>
  entry.isDirectory() || entry.isSymbolicLink();

const listCandidatePackageDirs = async (nodeModulesDir: string): Promise<readonly string[]> => {
  const entries = await readdir(nodeModulesDir, { withFileTypes: true }).catch(() => []);
  const dirs: string[] = [];

  for (const entry of entries) {
    if (!isDirectoryCandidate(entry)) continue;

    if (entry.name.startsWith('@')) {
      const scopeDir = path.join(nodeModulesDir, entry.name);
      const scopedEntries = await readdir(scopeDir, { withFileTypes: true }).catch(() => []);
      for (const scopedEntry of scopedEntries) {
        if (isDirectoryCandidate(scopedEntry)) dirs.push(path.join(scopeDir, scopedEntry.name));
      }
    } else {
      dirs.push(path.join(nodeModulesDir, entry.name));
    }
  }

  return dirs;
};

/** Deploy-time discovery: every installed package whose package.json marks `inithium.plugin: true`. */
export const discoverInstalledPluginPackageNames = async (nodeModulesDir: string): Promise<readonly string[]> => {
  const candidateDirs = await listCandidatePackageDirs(nodeModulesDir);
  const packageNames: string[] = [];

  for (const dir of candidateDirs) {
    const packageJson = await readPackageJsonSafe(dir);
    if (packageJson?.inithium?.plugin && packageJson.name) {
      packageNames.push(packageJson.name);
    }
  }

  return packageNames;
};

/** Dynamically imports the `/server` entry point of every discovered plugin package. */
export const discoverInstalledServerPlugins = async (nodeModulesDir: string): Promise<readonly PluginServerModule[]> => {
  const packageNames = await discoverInstalledPluginPackageNames(nodeModulesDir);

  const modules = await Promise.all(
    packageNames.map(async (packageName) => {
      const imported = (await import(/* @vite-ignore */ `${packageName}/server`)) as {
        readonly default?: PluginServerModule;
      };
      return imported.default;
    })
  );

  return modules.filter((module): module is PluginServerModule => Boolean(module));
};

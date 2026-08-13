import { describe, expect, it } from 'vitest';
import { registerPlugin, registerPlugins, ExtractCollisionKeys } from './register.js';
import { createPluginRegistry } from './state.js';
import type { PluginMeta } from '../contracts/plugin-meta.types.js';

interface FakeModule extends PluginMeta {
  readonly routes: readonly string[];
}

const extractKeys: ExtractCollisionKeys<FakeModule> = (module) => ({ route: module.routes });

const plugin = (id: string, routes: readonly string[] = [], dependsOn?: readonly string[]): FakeModule => ({
  id,
  version: '1.0.0',
  routes,
  dependsOn
});

describe('registerPlugin', () => {
  it('registers a plugin and enables it by default', () => {
    const state = createPluginRegistry<FakeModule>();
    const result = registerPlugin(state, plugin('friends', ['/friends']), extractKeys);

    expect(result.isOk()).toBe(true);
    const next = result._unsafeUnwrap();
    expect(next.order).toEqual(['friends']);
    expect(next.enabledIds.has('friends')).toBe(true);
  });

  it('rejects a duplicate plugin id', () => {
    const state = createPluginRegistry<FakeModule>();
    const first = registerPlugin(state, plugin('friends'), extractKeys)._unsafeUnwrap();
    const result = registerPlugin(first, plugin('friends'), extractKeys);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().type).toBe('CONFLICT_ERROR');
  });

  it('rejects a colliding key across two different plugins', () => {
    const state = createPluginRegistry<FakeModule>();
    const first = registerPlugin(state, plugin('friends', ['/social']), extractKeys)._unsafeUnwrap();
    const result = registerPlugin(first, plugin('billing', ['/social']), extractKeys);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/duplicate route "\/social"/);
  });

  it('propagates a topo-sort failure (unknown dependency) as an error', () => {
    const state = createPluginRegistry<FakeModule>();
    const result = registerPlugin(state, plugin('friends', [], ['missing']), extractKeys);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().type).toBe('VALIDATION_ERROR');
  });
});

describe('registerPlugins', () => {
  it('registers a batch in the order given and short-circuits on the first failure', () => {
    const state = createPluginRegistry<FakeModule>();
    const ok = registerPlugins(state, [plugin('a', ['/a']), plugin('b', ['/b'])], extractKeys);
    expect(ok.isOk()).toBe(true);
    expect(ok._unsafeUnwrap().order).toEqual(['a', 'b']);

    const failing = registerPlugins(state, [plugin('a', ['/x']), plugin('b', ['/x'])], extractKeys);
    expect(failing.isErr()).toBe(true);
  });
});

import { describe, expect, it, vi } from 'vitest';
import { okAsync, errAsync } from 'neverthrow';
import { createConflictError } from '@inithium/types';
import { initServerHooks } from './lifecycle.server.js';
import { registerServerPlugins } from './register.server.js';
import { createPluginRegistry } from '../registry/state.js';
import type { PluginServerContext, PluginServerModule } from '../contracts/plugin-server.types.js';

const fakeContext = {} as PluginServerContext;

const buildState = (modules: readonly PluginServerModule[]) =>
  registerServerPlugins(createPluginRegistry<PluginServerModule>(), modules)._unsafeUnwrap();

describe('initServerHooks', () => {
  it('runs each enabled plugin onServerInit and collects returned teardowns', async () => {
    const teardown = vi.fn(() => okAsync(undefined));
    const onServerInit = vi.fn(() => okAsync(teardown));
    const state = buildState([{ id: 'friends', version: '1.0.0', onServerInit }]);

    const result = await initServerHooks(state, fakeContext);

    expect(result.isOk()).toBe(true);
    expect(onServerInit).toHaveBeenCalledWith(fakeContext);
    expect(result._unsafeUnwrap()).toEqual({ friends: teardown });
  });

  it('skips plugins with no onServerInit hook', async () => {
    const state = buildState([{ id: 'friends', version: '1.0.0' }]);
    const result = await initServerHooks(state, fakeContext);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({});
  });

  it('runs hooks in topological order and short-circuits on the first failure', async () => {
    const calls: string[] = [];
    const state = buildState([
      {
        id: 'friends',
        version: '1.0.0',
        dependsOn: ['billing'],
        onServerInit: () => {
          calls.push('friends');
          return okAsync(undefined);
        }
      },
      {
        id: 'billing',
        version: '1.0.0',
        onServerInit: () => {
          calls.push('billing');
          return errAsync(createConflictError('billing init failed'));
        }
      }
    ]);

    const result = await initServerHooks(state, fakeContext);

    expect(result.isErr()).toBe(true);
    expect(calls).toEqual(['billing']);
  });

  it('does not run hooks for a disabled plugin', async () => {
    const onServerInit = vi.fn(() => okAsync(undefined));
    let state = buildState([{ id: 'friends', version: '1.0.0', onServerInit }]);
    state = { ...state, enabledIds: new Set() };

    const result = await initServerHooks(state, fakeContext);

    expect(result.isOk()).toBe(true);
    expect(onServerInit).not.toHaveBeenCalled();
  });
});

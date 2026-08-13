import { describe, expect, it } from 'vitest';
import { topologicallySortPlugins } from './topo-sort.js';
import type { PluginMeta } from '../contracts/plugin-meta.types.js';

const meta = (id: string, dependsOn?: readonly string[]): PluginMeta => ({ id, version: '1.0.0', dependsOn });

describe('topologicallySortPlugins', () => {
  it('returns plugins as-is when there are no dependencies', () => {
    const result = topologicallySortPlugins([meta('a'), meta('b')]);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap().map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('orders a dependency before its dependent', () => {
    const result = topologicallySortPlugins([meta('friends', ['billing']), meta('billing')]);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap().map((p) => p.id)).toEqual(['billing', 'friends']);
  });

  it('breaks ties deterministically by plugin id', () => {
    const result = topologicallySortPlugins([meta('zeta'), meta('alpha'), meta('beta')]);
    expect(result._unsafeUnwrap().map((p) => p.id)).toEqual(['alpha', 'beta', 'zeta']);
  });

  it('fails when a plugin depends on an unknown plugin', () => {
    const result = topologicallySortPlugins([meta('friends', ['missing'])]);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().type).toBe('VALIDATION_ERROR');
  });

  it('fails on a circular dependency', () => {
    const result = topologicallySortPlugins([meta('a', ['b']), meta('b', ['a'])]);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/circular/i);
  });

  it('resolves a diamond dependency graph', () => {
    const result = topologicallySortPlugins([
      meta('d', ['b', 'c']),
      meta('b', ['a']),
      meta('c', ['a']),
      meta('a')
    ]);
    const order = result._unsafeUnwrap().map((p) => p.id);
    expect(order.indexOf('a')).toBeLessThan(order.indexOf('b'));
    expect(order.indexOf('a')).toBeLessThan(order.indexOf('c'));
    expect(order.indexOf('b')).toBeLessThan(order.indexOf('d'));
    expect(order.indexOf('c')).toBeLessThan(order.indexOf('d'));
  });
});

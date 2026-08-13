declare module 'virtual:inithium-plugins' {
  import type { PluginClientModule } from '@inithium/plugin-engine/client';

  export const plugins: readonly PluginClientModule[];
}

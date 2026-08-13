import type { PluginServerModule } from '../contracts/plugin-server.types.js';

/** Identity function kept purely for authoring ergonomics/type-inference — no runtime behavior. */
export const defineServerPlugin = <TModule extends PluginServerModule>(module: TModule): TModule => module;

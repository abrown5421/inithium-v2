import type { PluginClientModule } from '../contracts/plugin-client.types.js';

/** Identity function kept purely for authoring ergonomics/type-inference — no runtime behavior. */
export const defineClientPlugin = <TModule extends PluginClientModule>(module: TModule): TModule => module;

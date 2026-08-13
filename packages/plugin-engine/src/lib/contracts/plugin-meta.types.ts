export interface PluginMeta {
  readonly id: string;
  readonly version: string;
  readonly dependsOn?: readonly string[];
}

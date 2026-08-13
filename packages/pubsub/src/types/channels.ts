export type Channel = string;

export const userChannel = (userId: string): Channel => `user:${userId}`;

export const roomChannel = (roomId: string): Channel => `room:${roomId}`;

/** Collision-free channel naming for plugins — avoids exposing raw Socket.io namespaces. */
export const pluginChannel = (pluginId: string, name: string): Channel => `plugin:${pluginId}:${name}`;

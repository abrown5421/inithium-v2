export type Channel = string;

export const userChannel = (userId: string): Channel => `user:${userId}`;

export const roomChannel = (roomId: string): Channel => `room:${roomId}`;

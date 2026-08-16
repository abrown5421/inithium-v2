/** Structural, not imported from `@inithium/models` — keeps `packages/ui` domain-model agnostic, same as `NavbarUser`. */
export interface NotificationCenterItem {
  readonly _id: string;
  readonly title: string;
  readonly message: string;
  readonly link?: string;
  readonly read: boolean;
  readonly createdAt: string | Date;
}

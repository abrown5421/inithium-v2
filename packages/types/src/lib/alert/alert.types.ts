export const ALERT_SEVERITIES = ['destructive', 'success', 'warning', 'info'] as const;

export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const ALERT_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

export type AlertPosition = (typeof ALERT_POSITIONS)[number];

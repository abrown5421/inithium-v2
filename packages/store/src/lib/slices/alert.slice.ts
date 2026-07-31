import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { AlertPosition, AlertSeverity, AnimationConfig } from '@inithium/types';

export interface AlertItem {
  readonly id: string;
  readonly message: string;
  readonly title?: string;
  readonly severity?: AlertSeverity;
  readonly position: AlertPosition;
  readonly closeable: boolean;
  readonly autoCloseMs: number | null;
  readonly animation: AnimationConfig;
}

export type OpenAlertPayload = Partial<Omit<AlertItem, 'id'>> & Pick<AlertItem, 'message'>;

export interface AlertState {
  readonly alerts: readonly AlertItem[];
}

const initialState: AlertState = {
  alerts: []
};

const DEFAULT_POSITION: AlertPosition = 'bottom-right';
const DEFAULT_AUTO_CLOSE_MS = 5000;
const LEFT_POSITIONS = new Set<AlertPosition>(['top-left', 'bottom-left']);

const resolveDefaultAnimation = (position: AlertPosition): AnimationConfig =>
  LEFT_POSITIONS.has(position)
    ? { entry: 'slideInLeft', exit: 'slideOutLeft' }
    : { entry: 'slideInRight', exit: 'slideOutRight' };

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    openAlert: {
      reducer: (state, action: PayloadAction<AlertItem>) => {
        state.alerts.push(action.payload);
      },
      prepare: (payload: OpenAlertPayload) => {
        const position = payload.position ?? DEFAULT_POSITION;
        return {
          payload: {
            title: payload.title,
            severity: payload.severity,
            animation: payload.animation ?? resolveDefaultAnimation(position),
            closeable: payload.closeable ?? true,
            autoCloseMs: payload.autoCloseMs === undefined ? DEFAULT_AUTO_CLOSE_MS : payload.autoCloseMs,
            message: payload.message,
            position,
            id: nanoid()
          } satisfies AlertItem
        };
      }
    },
    closeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    }
  }
});

export const { openAlert, closeAlert } = alertSlice.actions;
export const alertReducer = alertSlice.reducer;

export const selectAlerts = (state: { alert: AlertState }): readonly AlertItem[] => state.alert.alerts;

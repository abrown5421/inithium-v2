import * as React from 'react';
import { ANONYMOUS_SESSION, PageSession } from './session.types.js';

const PageSessionContext = React.createContext<PageSession>(ANONYMOUS_SESSION);

export interface PageSessionProviderProps {
  readonly value: PageSession;
  readonly children: React.ReactNode;
}

export const PageSessionProvider: React.FC<PageSessionProviderProps> = ({ value, children }) => (
  <PageSessionContext.Provider value={value}>{children}</PageSessionContext.Provider>
);

export const usePageSession = (): PageSession => React.useContext(PageSessionContext);

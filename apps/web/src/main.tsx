import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, setApiBaseUrl, selectCurrentUser } from '@inithium/store';
import { initErrorCapture } from '@inithium/error-capture';
import { ErrorCaptureBoundary } from '@inithium/error-capture/react';
import App from './app/app';
import { ApiHealthGate } from './app/api-health-gate';

const apiOrigin = import.meta.env.VITE_API_ORIGIN ?? 'http://localhost:3000';
setApiBaseUrl(apiOrigin);
initErrorCapture({ appId: 'web', apiOrigin, getUserId: () => selectCurrentUser(store.getState())?.id ?? undefined });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <ErrorCaptureBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <ApiHealthGate>
            <App />
          </ApiHealthGate>
        </BrowserRouter>
      </Provider>
    </ErrorCaptureBoundary>
  </StrictMode>,
);
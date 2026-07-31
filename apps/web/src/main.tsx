import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, setApiBaseUrl } from '@inithium/store';
import App from './app/app';
import { ApiHealthGate } from './app/api-health-gate';

setApiBaseUrl(import.meta.env.VITE_API_ORIGIN ?? 'http://localhost:3000');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ApiHealthGate>
          <App />
        </ApiHealthGate>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
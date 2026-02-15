'use client';

import { store } from '@/redux/store/store';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      {/* <PersistGate
        loading={null}
        persistor={persistor}
      > */}
      <Toaster richColors position="top-right" />
      {children}
      {/* </PersistGate> */}
    </Provider>
  );
}
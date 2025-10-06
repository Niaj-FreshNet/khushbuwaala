'use client';

import { persistor, store } from '@/redux/store/store';
import { LucideLoader2 } from 'lucide-react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
              <LucideLoader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
        persistor={persistor}
      >
        <Toaster richColors position="top-right" />
        {children}
      </PersistGate>
    </Provider>
  );
}
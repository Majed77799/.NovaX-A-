import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n';

const queryClient = new QueryClient();

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
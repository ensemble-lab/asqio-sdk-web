import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { AsqioClient } from '../client/AsqioClient';
import type { AsqioConfig } from '../types/config';

const AsqioClientContext = createContext<AsqioClient | null>(null);

export interface AsqioProviderProps extends AsqioConfig {
  children: ReactNode;
}

export function AsqioProvider({
  children,
  baseUrl,
  tenantKey,
  getToken,
  appVersion,
}: AsqioProviderProps) {
  const client = useMemo(
    () => new AsqioClient({ baseUrl, tenantKey, getToken, appVersion }),
    [baseUrl, tenantKey, getToken, appVersion],
  );

  return (
    <AsqioClientContext.Provider value={client}>
      {children}
    </AsqioClientContext.Provider>
  );
}

export function useAsqioClient(): AsqioClient {
  const client = useContext(AsqioClientContext);
  if (!client) {
    throw new Error('useAsqioClient must be used within an <AsqioProvider>');
  }
  return client;
}

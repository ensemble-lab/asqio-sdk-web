export interface AsqioConfig {
  baseUrl: string;
  tenantKey: string;
  getToken: () => Promise<string>;
  appVersion?: string;
}

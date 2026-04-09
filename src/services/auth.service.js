import { PublicClientApplication } from '@azure/msal-browser';
import { MSAL_CONFIG } from '@/config/constants';

const msalInstance = new PublicClientApplication(MSAL_CONFIG);

// msalInstance needs to be initialized before use
export const initializeAuth = async () => {
  await msalInstance.initialize();
  return msalInstance;
};

export { msalInstance };

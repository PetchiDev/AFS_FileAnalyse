import axios from 'axios';
import { msalInstance } from '@/services/auth.service';
import { API } from '@/config/constants';

/**
 * Centralized Axios instance for all API communications.
 * Configured with base URL, timeout, and basic headers.
 */
const apiClient = axios.create({
  baseURL: API.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Inject Auth Token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const accounts = msalInstance.getAllAccounts();

      if (accounts.length > 0) {
        const response = await msalInstance.acquireTokenSilent({
          scopes: [`api://${import.meta.env.VITE_MSAL_CLIENT_ID || '954749a7-37b1-4118-b5c6-e1a12bac6795'}/access_as_user`], // backend scope
          account: accounts[0]
        });

        const jwtToken = response.accessToken;
        console.log(jwtToken, "jwtToken");
        if (jwtToken) {
          config.headers.Authorization = `Bearer ${jwtToken}`;
        }
      } else {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code out of 2xx range
      console.error('API Error Response:', error.response.data);

      // Handle 401 Unauthorized (optional: trigger logout)
      if (error.response.status === 401) {
        // localStorage.removeItem('auth_token');
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Network Error:', error.request);
    } else {
      // Something else happened in setting up the request
      console.error('API Configuration Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

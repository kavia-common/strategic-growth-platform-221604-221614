import axios from 'axios';
import { supabase } from '../lib/supabase';

/**
 * Resolve API base URL from multiple env options to be resilient to configuration differences.
 * Priority order:
 *  - REACT_APP_API_URL
 *  - REACT_APP_BACKEND_URL
 *  - REACT_APP_API_BASE
 */
const resolveBaseURL = () => {
  const candidates = [
    process.env.REACT_APP_API_URL,
    process.env.REACT_APP_BACKEND_URL,
    process.env.REACT_APP_API_BASE,
  ].filter(Boolean);

  const base = candidates[0];

  if (!base && typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      '[API] Missing base URL. Set REACT_APP_API_URL (preferred) or REACT_APP_BACKEND_URL/REACT_APP_API_BASE in .env'
    );
  }
  // Normalize: remove trailing slash to avoid double slashes when joining with /api/...
  if (base && base.endsWith('/')) {
    return base.slice(0, -1);
  }
  return base || '';
};

const api = axios.create({
  baseURL: resolveBaseURL(),
});

// Add a request interceptor to include the Auth token
api.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to surface backend errors clearly in the console during development
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(
        '[API] Request failed:',
        {
          url: error?.config?.url,
          method: error?.config?.method,
          baseURL: error?.config?.baseURL,
          status: error?.response?.status,
          data: error?.response?.data,
        }
      );
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export default api;

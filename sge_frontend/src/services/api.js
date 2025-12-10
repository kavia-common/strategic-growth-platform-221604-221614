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

  let base = candidates[0];

  // Fallback: derive from window.location if env vars are missing
  if (!base && typeof window !== 'undefined') {
    try {
      const url = new URL(window.location.href);
      // If running on port 3000 (standard React dev), assume backend is on 3001
      if (url.port === '3000') {
        url.port = '3001';
      }
      base = url.origin;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[API] Failed to derive base URL from window.location', e);
    }
  }

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

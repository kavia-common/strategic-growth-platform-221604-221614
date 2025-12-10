import axios from 'axios';
import { supabase } from '../lib/supabase';

/**
 * Resolve API base URL from multiple env options to be resilient to configuration differences.
 * Priority order:
 *  - REACT_APP_API_URL
 *  - REACT_APP_BACKEND_URL
 *  - REACT_APP_API_BASE
 * Fallbacks:
 *  - If on port 3000 (CRA dev), assume backend on 3001
 *  - Otherwise try same origin
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

/**
 * Extracts current session and org/tenant context from Supabase, safely handling null sessions.
 * Returns { token, orgId } where values may be undefined when not authenticated or not set.
 */
async function getAuthContext() {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data?.session ?? null;
    const token = session?.access_token;
    // Attempt to discover tenant/org from user metadata if present
    const orgId =
      session?.user?.app_metadata?.organization_id ||
      session?.user?.user_metadata?.organization_id ||
      session?.user?.app_metadata?.org_id ||
      session?.user?.user_metadata?.org_id ||
      undefined;
    return { token, orgId };
  } catch (e) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[API] Failed to read Supabase session', e);
    }
    return { token: undefined, orgId: undefined };
  }
}

// Add a request interceptor to include the Auth token and tenant context
api.interceptors.request.use(
  async (config) => {
    const { token, orgId } = await getAuthContext();

    // Always ensure headers object exists
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // In dev, log missing token for protected endpoints
      if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        if (config.url?.startsWith('/api/')) {
          // eslint-disable-next-line no-console
          console.debug('[API] No auth token present for request:', config.method, config.url);
        }
      }
    }

    // Include multi-tenant context header if available
    if (orgId) {
      config.headers['X-Org-Id'] = orgId;
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
      console.error('[API] Request failed:', {
        url: error?.config?.url,
        method: error?.config?.method,
        baseURL: error?.config?.baseURL,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export default api;

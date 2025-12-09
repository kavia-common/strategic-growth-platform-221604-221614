import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
});

// Add a request interceptor to include the Auth token
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// PUBLIC_INTERFACE
export default api;

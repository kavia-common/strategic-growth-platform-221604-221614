import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext({});

// PUBLIC_INTERFACE
export const useAuth = () => useContext(AuthContext);

// PUBLIC_INTERFACE
/**
 * AuthProvider
 * Provides authentication state and actions (signUp, signOut) backed by Supabase.
 * Children will render only after the initial auth state has been determined.
 *
 * Note: For email-based auth flows, the redirect URL should be set using
 * REACT_APP_SITE_URL from the environment. Example:
 *   const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
 *   supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${siteUrl}/login` } })
 */
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        // Ensure proper redirect in hosted environments
        emailRedirectTo: `${siteUrl}/login`,
      },
    });
  };

  const value = {
    session,
    user,
    signUp,
    signOut: () => supabase.auth.signOut(),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

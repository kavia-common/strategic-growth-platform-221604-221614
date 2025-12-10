# Supabase Integration - SGE Frontend

This document describes how the frontend integrates with Supabase and how to configure it.

## Environment Variables

Create a `.env` file in `sge_frontend/` based on `.env.example` and set:

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY

If you migrate to Vite, you can alternatively use:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Never commit real keys to source control.

## Supabase Client

The Supabase client is initialized in `src/lib/supabase.js`. It exports a default client and helper functions:

- default export: a configured client instance (singleton)
- getSupabaseClient(): returns the singleton instance
- getSupabaseEnv(): returns resolved env configuration

## Email Redirect URL (for signups)

When handling signups with email verification, set the redirectTo/emailRedirectTo to your site URL. In CRA:

- Provide `REACT_APP_SITE_URL` via deployment environment and pass it to Supabase auth actions where needed.

Example (when implementing signup):

```js
const redirectTo = process.env.REACT_APP_SITE_URL
  ? `${process.env.REACT_APP_SITE_URL}/auth/callback`
  : undefined;

await supabase.auth.signUp({
  email,
  password,
  options: { emailRedirectTo: redirectTo },
});
```

Ensure REACT_APP_SITE_URL is configured in the deployment environment.

# Supabase Integration (Frontend)

This app uses Supabase for authentication and data access via `@supabase/supabase-js`.

## Client Module

A shared client is created in:

- `src/lib/supabase.js`

Use it anywhere in the app:

```javascript
import { supabase } from '../lib/supabase';
```

## Environment Variables

Create a `.env` file in `sge_frontend/` with the following variables:

```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
REACT_APP_API_BASE=http://localhost:3001
REACT_APP_SITE_URL=http://localhost:3000
```

- `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are required for the Supabase client.
- `REACT_APP_API_BASE` is used by Axios to call the backend.
- `REACT_APP_SITE_URL` can be used for email redirect flows when implementing magic links or OAuth.

Restart the dev server after changing `.env` variables.

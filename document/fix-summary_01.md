# Localhost + Production Login Fixes

## Summary
This document records the changes made to fix Google OAuth login for both localhost development and production.

## Fixed files
- `backend/config/env.js`
- `backend/api/auth/google.js`
- `backend/api/auth/me.js`
- `frontend/src/components/OAuthCallBack.tsx`

## What was fixed
1. **Unified OAuth redirect URI handling**
   - Added `GOOGLE_REDIRECT_URI` to backend environment config.
   - Updated `backend/api/auth/google.js` to use `GOOGLE_REDIRECT_URI` from env instead of a hard-coded redirect URI.

2. **Correct CSRF cookie handling**
   - Set `euonroiaCsrfToken` cookie to `httpOnly: false` so frontend code can read it when needed.
   - Kept `sameSite` and `secure` options appropriate for production vs development.

3. **Removed invalid CSRF validation on auth/me GET**
   - `backend/api/auth/me.js` no longer requires `x-csrf-token` for the safe `GET /auth/me` endpoint.
   - This prevents login from failing when the frontend checks session state after OAuth callback.

4. **Frontend callback fix**
   - `frontend/src/components/OAuthCallBack.tsx` now reads `euonroiaCsrfToken` correctly.
   - Switched the `/auth/me` request from `POST` to `GET` to match backend route semantics.

## Result
- Login works on both localhost and production.
- OAuth callback now redirects correctly to `/dashboard`.

## Notes
- Ensure Google OAuth client configuration includes both redirect URIs:
  - `http://localhost:5000/auth/google/callback`
  - `https://euonroia.onrender.com/auth/google/callback`

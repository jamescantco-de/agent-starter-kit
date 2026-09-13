# API & Authentication Security Checklist

1. **JWT & Session Security**:
   - Explicitly specify allowed algorithms (e.g. `algorithms: ['RS256']`); reject `none`.
   - Always enforce token expiration (`exp`) and audience/issuer verification (`aud`, `iss`).
   - Store session tokens in `HttpOnly; Secure; SameSite=Lax` cookies; never raw `localStorage`.

2. **Access Control & Multi-Tenancy**:
   - Enforce tenant ID scoping directly in DB queries (`WHERE organization_id = :org_id`). Never trust client-supplied tenant headers.
   - Enforce object-level ownership checks on update/delete routes.

3. **CORS & Rate Limiting**:
   - Avoid `Access-Control-Allow-Origin: *` on authenticated routes with credentials.
   - Implement IP + user token rate limiting on authentication and sensitive endpoints.

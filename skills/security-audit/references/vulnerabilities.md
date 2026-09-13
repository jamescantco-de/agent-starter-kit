# OWASP Vulnerability Checklist

1. **Injection (SQL / NoSQL / Command)**:
   - Use parameterized queries and prepared statements exclusively.
   - Never concatenate user strings into raw SQL, Prisma `$queryRawUnsafe`, or shell commands (`exec`, `spawn`).

2. **SSRF (Server-Side Request Forgery)**:
   - Validate and whitelist URLs before making server-side fetch requests.
   - Block requests to private IP ranges (`127.0.0.1`, `10.0.0.0/8`, `169.254.169.254` cloud metadata).

3. **Information & Secret Disclosure**:
   - Sanitize error responses; never dump raw stack traces or DB errors to clients.
   - Verify that `.env*`, private keys, and API tokens are completely excluded from git tracking.

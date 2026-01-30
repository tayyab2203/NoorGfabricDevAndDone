# Phase 10 – Production Hardening: Use Cases

**Module:** Production Hardening  
**Requirements ref:** §9 Security, §10 Performance, §11–12 DevOps & Testing

## Use Cases

- **UC-1:** Rate limit (100 req/min auth, 20 req/min unauth); CORS whitelist; input sanitization; GDPR (privacy policy, export, deletion).
- **UC-2:** Health check GET /api/health for load balancer; Sentry for errors; CI/CD (lint, test, E2E); README and deployment docs.

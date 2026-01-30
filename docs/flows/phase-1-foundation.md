# Phase 1 – Foundation: Flows

**Module:** Project Foundation  
**Requirements ref:** §2 Tech Stack, §3 Architecture

## 1. Application startup flow

```mermaid
flowchart LR
  A[Start app] --> B[Load env]
  B --> C[Init React Query]
  C --> D[SessionProvider]
  D --> E[Render layout]
  E --> F[Header + main + Footer]
```

## 2. Health check flow

```mermaid
sequenceDiagram
  participant C as Client
  participant H as GET /api/health
  participant DB as Mongoose
  participant R as Redis

  C->>H: GET /api/health
  alt MONGODB_URI missing
    H-->>C: 200 { mongodb: missing_config, redis: ... }
  else MONGODB_URI set
    H->>DB: connectDB()
    alt success
      H->>R: getRedisClient()
      H-->>C: 200 { ok, mongodb: connected, redis: connected|skipped }
    else DB error
      H-->>C: 503 { ok: false, mongodb: error }
    end
  end
```

## 3. Page render flow (public)

```mermaid
flowchart TB
  subgraph layout [Root layout]
    P[Providers]
    Header[Header]
    Main[main]
    Footer[Footer]
  end
  Request[User request] --> layout
  P --> Header
  P --> Main
  P --> Footer
  Main --> Page[Page content]
```

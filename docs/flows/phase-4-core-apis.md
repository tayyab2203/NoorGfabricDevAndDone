# Phase 4 – Core APIs: Flows

**Module:** Core APIs  
**Requirements ref:** §8 API Endpoints, §3 Caching

## 1. GET product list (with cache)

```mermaid
sequenceDiagram
  participant C as Client
  participant H as GET /api/products
  participant R as Redis
  participant DB as MongoDB

  C->>H: GET ?category=&page=1
  H->>R: get(cacheKey)
  alt cache hit
    R-->>H: data
    H-->>C: 200 data
  else cache miss
    H->>DB: find + countDocuments
    DB-->>H: items, total
    H->>R: set(cacheKey, data, TTL 24h)
    H-->>C: 200 data
  end
```

## 2. Order creation flow

```mermaid
flowchart TB
  A[POST /api/orders] --> B[Validate body]
  B --> C[Resolve products + stock]
  C --> D{Stock OK?}
  D -->|No| E[400 Insufficient stock]
  D -->|Yes| F[Build order items snapshot]
  F --> G[Calculate subtotal, shipping, total]
  G --> H[Create Order]
  H --> I[Decrement variant stock]
  I --> J{User logged in?}
  J -->|Yes| K[Clear cart]
  J -->|No| L[Skip cart]
  K --> M[Return order]
  L --> M
```

## 3. Admin product update and cache invalidation

```mermaid
sequenceDiagram
  participant A as Admin
  participant API as PUT /api/admin/products/[id]
  participant DB as MongoDB
  participant R as Redis

  A->>API: PUT body
  API->>API: requireAdmin
  API->>DB: findByIdAndUpdate
  DB-->>API: product
  API->>R: del(products:id), del(products:slug)
  API-->>A: 200 product
```

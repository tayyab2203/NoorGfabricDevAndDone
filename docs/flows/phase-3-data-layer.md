# Phase 3 – Data Layer: Flows

**Module:** Data Layer  
**Requirements ref:** §4 Database Schema

## 1. Entity relationships

```mermaid
erDiagram
  User ||--o{ Order : places
  User ||--o{ Address : has
  User ||--o| Cart : has
  User ||--o{ Review : writes
  Category ||--o{ Product : categorizes
  Product ||--o{ Review : has
  Collection }o--o{ Product : contains
  Order }o--o{ Product : "items snapshot"
```

## 2. Seed script flow

```mermaid
flowchart TB
  A[Load env] --> B[Connect MongoDB]
  B --> C[Delete existing seed data]
  C --> D[Create Admin User]
  D --> E[Create Categories]
  E --> F[Create Products]
  F --> G[Create Collections]
  G --> H[Disconnect]
```

## 3. Cart TTL and Order rule

- **Cart:** expiresAt set to now + 30 days on create/update; TTL index (expireAfterSeconds: 0) deletes when expiresAt passed.
- **Order:** No delete; status transitions only (PLACED → PROCESSING → SHIPPED → DELIVERED | CANCELLED).

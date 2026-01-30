# Phase 2 – Authentication: Flows

**Module:** Authentication  
**Requirements ref:** §2 NextAuth, §9 Security

## 1. Google OAuth sign-in flow

```mermaid
sequenceDiagram
  participant U as User
  participant A as App
  participant N as NextAuth
  participant G as Google
  participant DB as MongoDB

  U->>A: Click Sign in
  A->>N: Redirect to provider
  N->>G: Redirect to Google
  G->>U: Consent screen
  U->>G: Approve
  G->>N: Callback with code
  N->>N: signIn callback
  N->>DB: Find or create User
  DB-->>N: User (userId, role)
  N->>N: jwt callback (add userId, role)
  N->>N: session callback (expose to client)
  N->>A: Redirect with session
```

## 2. Middleware – admin protection

```mermaid
flowchart TB
  A[Request to /admin/*] --> B{Has session?}
  B -->|No| C[Redirect to /]
  B -->|Yes| D{Role ADMIN or MANAGER?}
  D -->|No| C
  D -->|Yes| E[NextResponse.next]
```

## 3. API route auth check flow

```mermaid
sequenceDiagram
  participant C as Client
  participant H as API handler
  participant A as auth()

  C->>H: Request
  H->>A: auth()
  A-->>H: session
  alt requireAuth / requireAdmin
    H->>H: Check session
    alt No session
      H-->>C: 401 Unauthorized
    else Session ok
      alt requireAdmin and role not admin
        H-->>C: 403 Forbidden
      else OK
        H-->>C: 200 + data
      end
    end
  end
```

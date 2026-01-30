# Phase 6 – User Site Commerce: Flows

**Module:** User Site Commerce  
**Requirements ref:** §5 Pages 6–10, §7 Order Journey

## 1. Checkout step flow

```mermaid
flowchart LR
  S1[Step 1: Auth] --> S2[Step 2: Shipping]
  S2 --> S3[Step 3: Review]
  S3 --> S4[Step 4: Place Order]
  S4 --> Conf[Confirmation]
```

## 2. Order placement flow

```mermaid
sequenceDiagram
  participant U as User
  participant C as Checkout
  participant API as POST /api/orders
  participant DB as MongoDB

  U->>C: Review, Place Order
  C->>API: { items, shippingAddress }
  API->>API: Validate, resolve products
  API->>DB: Create Order (snapshots)
  API->>DB: Decrement stock
  alt User logged in
    API->>DB: Clear cart
  end
  API-->>C: orderNumber, order
  C-->>U: Confirmation page
```

## 3. Order status in history

- Order status: PLACED → PROCESSING → SHIPPED → DELIVERED (or CANCELLED).
- User sees status on list and detail; no delete.

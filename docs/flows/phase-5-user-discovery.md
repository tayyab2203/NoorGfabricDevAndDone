# Phase 5 – User Site Discovery: Flows

**Module:** User Site Discovery  
**Requirements ref:** §5 Pages 1–5

## 1. Navigation flow (discovery)

```mermaid
flowchart LR
  Home[/] --> Collections[/collections]
  Collections --> CollectionDetail["/collection/[slug]"]
  Home --> CollectionDetail
  CollectionDetail --> ProductDetail["/products/[slug]"]
  Home --> Search["/search?q="]
  ProductDetail --> Cart[/cart]
```

## 2. Home data flow

```mermaid
sequenceDiagram
  participant P as Home page
  participant API as API routes
  participant DB as MongoDB

  P->>API: GET /api/collections
  API-->>P: collections
  P->>API: GET /api/products/bestsellers
  API->>DB: Order aggregate + Product find
  API-->>P: bestsellers
  P->>P: Render FeaturedCollections, Bestsellers, Testimonials, Newsletter
```

## 3. Add to cart from product detail

```mermaid
sequenceDiagram
  participant U as User
  participant PD as Product detail
  participant API as POST /api/cart
  participant DB as MongoDB

  U->>PD: Select variant, quantity, Add to Cart
  PD->>API: POST { productId, variantSKU, quantity }
  API->>API: auth()
  API->>DB: Cart find/update
  API-->>PD: 200 cart
  PD->>PD: Invalidate cart query
```

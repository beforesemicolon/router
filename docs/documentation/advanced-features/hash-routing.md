---
name: Hash Routing
order: 8.2
title: Hash Routing - Router by Before Semicolon
description: Learn how to set up URL hash-based routing (#/path) for static hosting environments.
layout: document
---

## Hash Routing

The router supports both standard HTML5 History API routing (pathnames) and Hash-based routing (`#/path`).

Hash routing is perfect for static file hosting environments (like GitHub Pages or Netlify static deploys) because it bypasses the need for server-side redirection fallback configurations.

---

### `setRoutingMode`

Configures the router's active mode. Accepts `"history"` (default) or `"hash"`.

```typescript
function setRoutingMode(mode: 'history' | 'hash'): void
```

#### Example

```javascript
import { setRoutingMode } from '@beforesemicolon/router'

// Enable Hash Routing
setRoutingMode('hash')

// URLs will now format as: domain.com/#/dashboard
// <page-link path="/todos"> renders as: <a href="#/todos">
```

---

### `getRoutingMode`

Retrieves the currently active routing mode.

```typescript
function getRoutingMode(): 'history' | 'hash'
```

#### Example

```javascript
import { getRoutingMode } from '@beforesemicolon/router'

const mode = getRoutingMode() // "history" or "hash"
```

---

### Benefits of Hash Routing

-   **Zero Server Config:** Standard servers return a 404 error when accessing a direct path like `/about` on page refresh unless configured to rewrite to `index.html`. Hash routing is fully client-side and requires no server-side fallback rules.
-   **Static Hosting:** Highly compatible with static environments like AWS S3 buckets, GitHub Pages, or Netlify.
-   **Legacy Compatibility:** Works flawlessly in older web browser engines.

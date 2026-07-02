---
name: Route Registration
order: 7.4
title: Route Registration APIs - Router by Before Semicolon
description: Learn how to register pathname patterns and compile paths using JavaScript.
layout: document
---

## Route Registration APIs

These utilities allow you to manage registered route patterns and compile parameterized paths dynamically.

---

### `registerRoute`

Manually registers a route pattern with the central matching engine. This is performed automatically by `<page-route>` tags but can be done imperatively in JS.

```typescript
interface RegisterRouteOptions {
    exact?: boolean
    meta?: Record<string, unknown>
    name?: string
}

function registerRoute(
    pattern: string,
    options?: RegisterRouteOptions | boolean
): void
```

-   If a boolean is passed as the second argument, it is treated as the `exact` configuration.

#### Example

```javascript
import { registerRoute } from '@beforesemicolon/router'

registerRoute('/dashboard')
registerRoute('/admin', { exact: false })
registerRoute('/users/:userId', {
    exact: true,
    name: 'user-routes',
    meta: { title: 'User Details', requiresAuth: true },
})
```

---

### `isRegisteredRoute`

Checks whether a concrete pathname matches any registered route pattern.

```typescript
function isRegisteredRoute(pathname: string): boolean
```

#### Example

```javascript
import { isRegisteredRoute } from '@beforesemicolon/router'

isRegisteredRoute('/dashboard') // true
isRegisteredRoute('/users/42') // true, when /users/:userId is registered
isRegisteredRoute('/invalid-path') // false
```

---

### `parsePathname`

Takes a path pattern containing parameters and compiles it into a full URL path using values from the current active location.

```typescript
function parsePathname(pattern: string): string
```

#### Example

```javascript
// Browser location is: /users/42
// Current parameters: { userId: '42' }

import { parsePathname } from '@beforesemicolon/router'

const path = parsePathname('/users/:userId/details')
// Returns: "/users/42/details"
```

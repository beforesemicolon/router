---
name: Route Guards
order: 8.1
title: Route Guards - Router by Before Semicolon
description: Learn how to secure paths and perform checks before transitioning using route guards.
layout: document
---

## Route Guards

Route Guards allow you to protect routes with authentication checks, authorization, or other custom logic.

Guards can block navigation entirely or redirect the user to a different location.

---

### Guard Return Values

A guard function can return:

-   `true`: Allow the navigation.
-   `false`: Block the navigation (remains on the current page).
-   `string`: Redirects the user to the specified path string.
-   `Promise<boolean | string>`: Async checks (e.g. database fetches) are fully supported.

---

### Global Guards

Global guards execute on _every_ navigation event, before any route-specific guards.

```typescript
function registerGlobalGuard(
    guard: (
        pathname: string,
        query: Record<string, unknown>,
        data: Record<string, unknown>
    ) => boolean | string | Promise<boolean | string>
): void
```

#### Example

```javascript
import { registerGlobalGuard } from '@beforesemicolon/router'

// Authentication guard
registerGlobalGuard((pathname, query, state) => {
    const publicPages = ['/login', '/register', '/404']

    if (!publicPages.includes(pathname) && !userIsLoggedIn()) {
        return '/login' // Redirect to login
    }

    return true // Allow navigation
})
```

---

### Route-Specific Guards

Route-specific guards run only when navigating to a path that matches the registered pattern.

```typescript
function registerRouteGuard(
    pattern: string,
    guard: (
        pathname: string,
        query: Record<string, unknown>,
        data: Record<string, unknown>
    ) => boolean | string | Promise<boolean | string>
): void
```

#### Example

```javascript
import { registerRouteGuard } from '@beforesemicolon/router'

// Role-based authorization guard (Async)
registerRouteGuard('/admin/:section', async (pathname, query, state) => {
    try {
        const hasAccess = await checkAdminPermissions()
        return hasAccess ? true : '/unauthorized'
    } catch {
        return false // Block navigation on error
    }
})
```

---

### Guard Execution Order

1. **Global Guards:** Executed in the order they were registered.
2. **Route-Specific Guards:** Executed in the order they were registered.
3. The _first_ guard that returns `false` or a redirect `string` stops execution immediately; subsequent guards are skipped.

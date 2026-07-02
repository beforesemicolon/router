---
name: Route Metadata
order: 8.4
title: Route Metadata - Router by Before Semicolon
description: Learn how to attach permissions, layouts, or custom page properties to routes.
layout: document
---

## Route Metadata

You can attach custom metadata (such as page layouts, breadcrumbs, permissions, or access roles) when registering routes.

Metadata is stored by the registered route pattern. Use the same pattern when calling `getRouteMeta`.

---

### Attaching Metadata

Pass metadata inside the options configuration of `registerRoute`:

```javascript
import { registerRoute } from '@beforesemicolon/router'

registerRoute('/admin/:section', {
    exact: true,
    meta: {
        title: 'Admin Console',
        requiresAuth: true,
        allowedRoles: ['admin', 'moderator'],
        breadcrumb: 'Home > Admin > Dashboard',
    },
})
```

---

### Retrieving Metadata (`getRouteMeta`)

Retrieves the metadata object associated with a registered path pattern.

```typescript
function getRouteMeta(pattern: string): RouteMeta | undefined
```

#### Example

```javascript
import { getRouteMeta } from '@beforesemicolon/router'

const meta = getRouteMeta('/admin/:section')
console.log(meta.title) // "Admin Console"
console.log(meta.requiresAuth) // true
```

---

### Common Use Cases

#### 1. Dynamic Document Titles

Update the browser document title dynamically upon page transitions:

```javascript
import { onPage, getRouteMeta } from '@beforesemicolon/router'

onPage('/admin/:section', (active) => {
    if (active) {
        const meta = getRouteMeta('/admin/:section')
        document.title = meta?.title
            ? `${meta.title} | My App`
            : 'Admin | My App'
    }
})
```

#### 2. Guarding Permissions

Check permissions dynamically inside a route guard:

```javascript
import { registerRouteGuard, getRouteMeta } from '@beforesemicolon/router'

registerRouteGuard('/admin/:section', () => {
    const meta = getRouteMeta('/admin/:section')

    if (meta?.requiresAuth && !userIsLoggedIn()) {
        return '/login' // Redirect
    }

    if (meta?.allowedRoles && !userHasRoles(meta.allowedRoles)) {
        return '/unauthorized' // Redirect
    }

    return true // Allow
})
```

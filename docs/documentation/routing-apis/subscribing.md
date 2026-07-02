---
name: Subscribing APIs
order: 7.2
title: Subscription Observers - Router by Before Semicolon
description: Learn how to observe route patterns or listen to global navigation events.
layout: document
---

## Subscribing APIs

These APIs notify your JavaScript code when URL modifications or navigation events occur.

---

### `onPage`

Subscribes to a specific route pattern. The callback triggers whenever the matched state transitions (e.g., active to inactive, or parameters change).

```typescript
function onPage(
    pattern: string,
    callback: (active: boolean, location: PageLocation) => void,
    exact: boolean = true,
    matchGroup?: string
): () => void
```

-   Returns a **cleanup function** to unsubscribe.
-   **`active`:** `true` if the current location matches the pattern.
-   **`location`:** Object containing `pathname`, `query` (search params), `data` (history state), and parsed `params`.

#### Example

```javascript
import { onPage } from '@beforesemicolon/router'

const unsubscribe = onPage('/users/:userId', (active, location) => {
    if (active) {
        console.log(`Now viewing user: ${location.params.userId}`)
        console.log('State payload:', location.data)
    } else {
        console.log('Navigated away from user profile')
    }
})

// Later: clean up listener
// unsubscribe();
```

Use `exact = false` to subscribe to a layout path and its descendants:

```javascript
onPage(
    '/docs',
    (active) => {
        docsShell.hidden = !active
    },
    false
)
```

---

### `onPageChange`

Subscribes to all global location transitions. Triggered after any navigation event, regardless of which paths are active.

```typescript
type PageChangeCallback = (
    pathname: string,
    searchParams: Record<string, string>,
    pageData: Record<string, unknown>
) => void

function onPageChange(callback: PageChangeCallback): () => void
```

-   Returns a **cleanup function** to unsubscribe.

#### Example

```javascript
import { onPageChange } from '@beforesemicolon/router'

onPageChange((pathname, query, state) => {
    // Send analytics view event
    trackPageView(pathname)
})
```

---

### `isOnPage`

Helper to verify if a specific path matches the current browser location.

```typescript
function isOnPage(pathname: string, exact: boolean = true): boolean
```

-   **`exact`:** If `false`, evaluates to `true` if the browser location starts with the specified path (treating subpaths as matches).

#### Examples

```javascript
// Browser is at: /todos/123?filter=all

isOnPage('/todos') // false (not exact)
isOnPage('/todos', false) // true  (subpath match)
isOnPage('/todos/123') // true  (exact path match)
isOnPage('/todos/123?filter=all') // true  (exact match including queries)
```

> [!NOTE]
> Search query matches inside `isOnPage` are order-sensitive. Parameters must appear in the exact order specified.

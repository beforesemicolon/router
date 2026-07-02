---
name: Navigation APIs
order: 7.1
title: Programmatic Navigation - Router by Before Semicolon
description: Learn how to transition paths, pass payloads, and go back/forward in history using JavaScript.
layout: document
---

## Navigation APIs

These functions trigger state updates in the browser's history session, allowing you to transition between pages programmatically.

---

### `goToPage`

Adds a new entry to the browser's history stack.

```typescript
function goToPage(
    pathname: string,
    pageData: Record<string, unknown> = {},
    title: string = document.title
): Promise<void>
```

#### Example

```javascript
import { goToPage } from '@beforesemicolon/router'

await goToPage(
    '/users/42',
    { role: 'admin', scrollPosition: 0 },
    'User Profile'
)
```

---

### `replacePage`

Updates the current entry in the history stack instead of creating a new one. This is ideal for redirections so clicking the browser's back button doesn't trap the user in a redirect loop.

```typescript
function replacePage(
    pathname: string,
    pageData: Record<string, unknown> = {},
    title: string = document.title
): Promise<void>
```

#### Example

```javascript
import { replacePage } from '@beforesemicolon/router'

if (!isAuthenticated) {
    await replacePage('/login', { from: '/dashboard' }, 'Please Login')
}
```

---

### `previousPage`

Navigates back to the previous entry in the browser session. Identical to clicking the browser's back button.

```typescript
function previousPage(): void
```

---

### `nextPage`

Navigates forward to the next entry in the browser session. Identical to clicking the browser's forward button.

```typescript
function nextPage(): void
```

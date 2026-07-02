---
name: Params & Queries
order: 7.3
title: Params & Queries APIs - Router by Before Semicolon
description: Learn how to retrieve pathname parameters, read search queries, and update search queries.
layout: document
---

## Params & Queries APIs

These functions allow you to read and write parameters or history states programmatically.

---

### `getPageParams`

Retrieves an object containing all parameters parsed from the current URL pathname.

```typescript
function getPageParams<T extends Record<string, string>>(): T
```

#### Example

```javascript
// Browser location: /projects/marketing/dashboard
// Route pattern: /projects/:category/:tab

import { getPageParams } from '@beforesemicolon/router'

const params = getPageParams()
// Returns: { category: 'marketing', tab: 'dashboard' }
```

---

### `getSearchParams`

Retrieves parsed URL query parameters as a key-value object. Supports automatic JSON parsing for complex query objects.

```typescript
function getSearchParams<T extends Record<string, string>>(): T
```

#### Example

```javascript
// Browser location: /search?query=hello&tags=%5B%22js%22%2C%22web%22%5D

import { getSearchParams } from '@beforesemicolon/router'

const query = getSearchParams()
// Returns: { query: 'hello', tags: ['js', 'web'] }
```

---

### `updateSearchQuery`

Updates or clears URL search parameters. Updates are made in-place using history replacement (does not add a new entry to the browser back stack).

```typescript
function updateSearchQuery(searchObject: Record<string, unknown> | null): void
```

-   Pass `null` to clear all query parameters from the URL.

#### Example

```javascript
import { updateSearchQuery } from '@beforesemicolon/router'

// Add page parameters to current URL
updateSearchQuery({ page: 2, filter: 'active' })
// Browser updates to: ?page=2&filter=active

// Clear queries
updateSearchQuery(null)
// Browser updates to: (query parameters removed)
```

---

### `getPageData`

Retrieves the current history state payload object.

```typescript
function getPageData<T extends Record<string, unknown>>(): T
```

#### Example

```javascript
import { getPageData } from '@beforesemicolon/router'

const data = getPageData()
console.log('User Role:', data.role)
```

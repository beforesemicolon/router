# onPage / onPageChange / isOnPage

`@beforesemicolon/router@1.5.0` · `router/subscriptions`

Subscribe to matching routes or all resolved location changes.

- Keep the unsubscribe function and call it on teardown. Use onPage when only one route matters.
- Window router:change has detail { pathname, query, data }.

## Setup

### npm

The npm root registers its custom elements automatically.

````js
import { onPage, onPageChange, isOnPage } from '@beforesemicolon/router'
````

### Classic scripts

- `https://cdn.jsdelivr.net/npm/@beforesemicolon/web-component@1.22.0/dist/client.js`
- `https://cdn.jsdelivr.net/npm/@beforesemicolon/router@1.5.0/dist/client.js`

**Available globals for this record:** `BFS.ROUTER.onPage`, `BFS.ROUTER.onPageChange`, `BFS.ROUTER.isOnPage`.

Load scripts in the listed order. No bundler is needed.

## Public values

### `onPage`

````typescript
onPage: (pathname: string, sub: PageListener, exact?: boolean, matchGroup?: string) => () => void
````

Subscribe to one route pattern. Receives active state plus pathname, query, data, and params. Pass exact=false to match descendants. Returns an unsubscribe function.

````js
const stop = onPage('/projects/:id', (active, { params }) => { if (active) console.log(params.id) })
// Call stop() when the view is destroyed.
````

### `onPageChange`

````typescript
onPageChange: (sub: PathChangeListener) => () => void
````

Subscribe to resolved navigation across the app. Route-scoped listeners run first. Store and call the returned cleanup function.

````js
const stop = onPageChange((pathname, query, data) => console.log(pathname, query, data))
// Call stop() on teardown.
````

### `isOnPage`

````typescript
isOnPage: (path: string, exact?: boolean) => boolean
````

Compare a path pattern with the current URL. Supply false as the second argument to include descendant paths.

````js
const inProjects = isOnPage('/projects', false)
````

## Type-only exports

Import these with `import type` in TypeScript. They are not runtime values.

### `PageListener`

````typescript
export type PageListener = (active: boolean, location: PageLocation) => void;
````

### `PageLocation`

````typescript
export interface PageLocation {
    pathname: string;
    query: Record<string, string>;
    data: Record<string, unknown>;
    params: Record<string, string>;
}
````

Data given to a route listener after matching. The params belong to the subscribed pattern.

### `PathChangeListener`

````typescript
export type PathChangeListener = (pathname: string, query: Record<string, string>, data: Record<string, unknown>) => void;
````

## Examples

````js
import { onPage, onPageChange, isOnPage } from '@beforesemicolon/router'

const stop = onPage('/about', (active, { pathname }) => {
    if (active) console.log(pathname)
})
// Call stop() on teardown.
````

### Classic

````js
const stop = BFS.ROUTER.onPageChange((pathname) => console.log(pathname))
````

[Back to the offline reference index](../index.md)

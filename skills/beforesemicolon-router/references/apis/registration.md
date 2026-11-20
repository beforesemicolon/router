# registerRoute / getRouteMeta

`@beforesemicolon/router@1.5.0` · `router/registration`

Register a route or read its metadata; declarative routes register on mount.

## Setup

### npm

The npm root registers its custom elements automatically.

````js
import { registerRoute, isRegisteredRoute, getRouteMeta } from '@beforesemicolon/router'
````

### Classic scripts

- `https://cdn.jsdelivr.net/npm/@beforesemicolon/web-component@1.22.0/dist/client.js`
- `https://cdn.jsdelivr.net/npm/@beforesemicolon/router@1.5.0/dist/client.js`

**Available globals for this record:** `BFS.ROUTER.registerRoute`, `BFS.ROUTER.isRegisteredRoute`, `BFS.ROUTER.getRouteMeta`.

Load scripts in the listed order. No bundler is needed.

## Public values

### `registerRoute`

````typescript
registerRoute: (pathname: string, exactOrOptions?: boolean | RouteOptions) => void
````

Add a route pattern to the route registry; does not render a view. Page routes call this on mount. Register metadata via the options object when using it in app navigation.

````js
registerRoute('/projects/:id', { exact: true, meta: { breadcrumb: 'Project' } })
````

### `isRegisteredRoute`

````typescript
isRegisteredRoute: (pathname: string) => boolean
````

Check whether the given location matches a registered pattern. Useful for unknown routes, not a permission check.

````js
if (!isRegisteredRoute('/missing')) console.log('Unknown route')
````

### `getRouteMeta`

````typescript
getRouteMeta: (pathname: string) => RouteMeta | undefined
````

Read metadata by the exact registered pathname key, often the pattern rather than a concrete URL.

````js
const title = getRouteMeta('/projects/:id')?.title
````

## Type-only exports

Import these with `import type` in TypeScript. They are not runtime values.

### `KnownRoute`

````typescript
export interface KnownRoute {
    pathname: string;
    exact: boolean;
    meta?: RouteMeta;
    name?: string;
}
````

### `RouteMeta`

````typescript
export interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    breadcrumb?: string;
    [key: string]: unknown;
}
````

Use optional labels or app-specific metadata on registered routes. The router does not make authorization decisions from metadata itself.

### `RouteOptions`

````typescript
export interface RouteOptions {
    exact?: boolean;
    meta?: RouteMeta;
    name?: string;
}
````

## Examples

````js
import { registerRoute, isRegisteredRoute, getRouteMeta } from '@beforesemicolon/router'

registerRoute('/about', { meta: { title: 'About' } })
console.log(getRouteMeta('/about'))
````

### Classic

````js
BFS.ROUTER.registerRoute('/about', { meta: { title: 'About' } })
````

[Back to the offline reference index](../index.md)

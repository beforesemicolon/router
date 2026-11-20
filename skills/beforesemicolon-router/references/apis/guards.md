# registerGlobalGuard / registerRouteGuard

`@beforesemicolon/router@1.5.0` · `router/guards`

Accept, block, or redirect router navigation, with async support.

- Return true to allow, false to block, or an internal path to redirect. UI guards do not replace server-side authorization.

## Setup

### npm

The npm root registers its custom elements automatically.

````js
import { registerGlobalGuard, registerRouteGuard } from '@beforesemicolon/router'
````

### Classic scripts

- `https://cdn.jsdelivr.net/npm/@beforesemicolon/web-component@1.22.0/dist/client.js`
- `https://cdn.jsdelivr.net/npm/@beforesemicolon/router@1.5.0/dist/client.js`

**Available globals for this record:** `BFS.ROUTER.registerGlobalGuard`, `BFS.ROUTER.registerRouteGuard`.

Load scripts in the listed order. No bundler is needed.

## Public values

### `registerGlobalGuard`

````typescript
registerGlobalGuard: (guard: RouteGuard) => void
````

Register a guard for all navigations. Call once during bootstrap. Return true, false, or a redirect path; each may be asynchronous.

````js
registerGlobalGuard((path) => path === '/obsolete' ? '/archive' : true)
````

### `registerRouteGuard`

````typescript
registerRouteGuard: (pathname: string, guard: RouteGuard) => void
````

Register a guard for a route pattern. Keep the destination outside the blocked pattern to avoid redirect loops.

````js
registerRouteGuard('/retired', () => '/archive')
````

## Type-only exports

Import these with `import type` in TypeScript. They are not runtime values.

### `RouteGuard`

````typescript
export type RouteGuard = (pathname: string, query: Record<string, unknown>, data: Record<string, unknown>) => boolean | Promise<boolean> | string | Promise<string>;
````

Return an internal destination path for redirects; a guard controls navigation, not API access.

## Examples

````js
import { registerGlobalGuard, registerRouteGuard } from '@beforesemicolon/router'

registerRouteGuard('/retired', () => '/archive')
````

### Classic

````js
BFS.ROUTER.registerRouteGuard('/retired', () => '/archive')
````

[Back to the offline reference index](../index.md)

# registerRouteModules / preloadRouteModule

`@beforesemicolon/router@1.5.0` · `router/route-modules`

Register lazy route modules for bundlers, resolve, or preload them.

## Setup

### npm

The npm root registers its custom elements automatically.

````js
import { registerRouteModules, getRouteModule, resolveRouteModule, preloadRouteModule, preloadRouteModules } from '@beforesemicolon/router'
````

### Classic scripts

- `https://cdn.jsdelivr.net/npm/@beforesemicolon/web-component@1.22.0/dist/client.js`
- `https://cdn.jsdelivr.net/npm/@beforesemicolon/router@1.5.0/dist/client.js`

**Available globals for this record:** `BFS.ROUTER.registerRouteModules`, `BFS.ROUTER.getRouteModule`, `BFS.ROUTER.resolveRouteModule`, `BFS.ROUTER.preloadRouteModule`, `BFS.ROUTER.preloadRouteModules`.

Load scripts in the listed order. No bundler is needed.

## Public values

### `registerRouteModules`

````typescript
registerRouteModules: (modules: Record<string, () => Promise<unknown>>) => void
````

Associate exact src keys with asynchronous importers. Match relative paths exactly, including the file extension.

````js
registerRouteModules({ './views/projects.js': async () => ({ default: '<h1>Projects</h1>' }) })
````

### `getRouteModule`

````typescript
getRouteModule: (path: string) => (() => Promise<unknown>) | undefined
````

Return the registered asynchronous loader without running it, or undefined if none exists.

````js
const loader = getRouteModule('./views/projects.js')
````

### `resolveRouteModule`

````typescript
resolveRouteModule: (path: string) => Promise<unknown | undefined>
````

Run and cache a registered module loader. Concurrent calls for the same key share a pending promise. Returns the default export when present.

````js
const result = await resolveRouteModule('./views/projects.js')
````

### `preloadRouteModule`

````typescript
preloadRouteModule: (path: string) => Promise<void>
````

Resolve one registered module in advance. This does not navigate or mount the route.

````js
await preloadRouteModule('./views/projects.js')
````

### `preloadRouteModules`

````typescript
preloadRouteModules: (paths: string[]) => Promise<void>
````

Resolve a set of registered module keys in parallel. Preload only likely next pages rather than the entire app.

````js
await preloadRouteModules(['./views/projects.js', './views/about.js'])
````

## Examples

````js
import { registerRouteModules, getRouteModule, resolveRouteModule, preloadRouteModule, preloadRouteModules } from '@beforesemicolon/router'

registerRouteModules({ './about.js': () => Promise.resolve({ default: '<h1>About</h1>' }) })
await preloadRouteModule('./about.js')
````

### Classic

````js
BFS.ROUTER.registerRouteModules({ './about.js': () => Promise.resolve({ default: '<h1>About</h1>' }) })
````

[Back to the offline reference index](../index.md)

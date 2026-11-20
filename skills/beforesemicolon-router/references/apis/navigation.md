# goToPage / replacePage / history

`@beforesemicolon/router@1.5.0` · `router/navigation`

Navigate, replace a location, or move through browser history.

- Use page-link in history mode. For hash mode, use an anchor with href="#/path".
- Use goToPage to push a history entry; replacePage changes the current entry. Set mode before creating the UI.

## Setup

### npm

The npm root registers its custom elements automatically.

````js
import { goToPage, replacePage, previousPage, nextPage, setRoutingMode, getRoutingMode } from '@beforesemicolon/router'
````

### Classic scripts

- `https://cdn.jsdelivr.net/npm/@beforesemicolon/web-component@1.22.0/dist/client.js`
- `https://cdn.jsdelivr.net/npm/@beforesemicolon/router@1.5.0/dist/client.js`

**Available globals for this record:** `BFS.ROUTER.goToPage`, `BFS.ROUTER.replacePage`, `BFS.ROUTER.previousPage`, `BFS.ROUTER.nextPage`, `BFS.ROUTER.setRoutingMode`, `BFS.ROUTER.getRoutingMode`.

Load scripts in the listed order. No bundler is needed.

## Public values

### `goToPage`

````typescript
goToPage: (pathname: string, state?: Record<string, unknown>, title?: string) => Promise<void>
````

Push a location and optional object payload. Guards run before history changes; the promise resolves after the navigation is allowed, blocked, or redirected. Supply a slash-prefixed path with no hash prefix.

````js
await goToPage('/about', { from: 'home' }, 'About')
````

### `replacePage`

````typescript
replacePage: (pathname: string, state?: Record<string, unknown>, title?: string) => Promise<void>
````

Replace the current entry, preserving prior history length. Use for a URL correction, not every user-initiated navigation.

````js
await replacePage('/projects', {}, 'Projects')
````

### `previousPage`

````typescript
previousPage: () => void
````

Go back through browser history. Wait for the location or view to change before asserting on the UI.

````js
previousPage()
````

### `nextPage`

````typescript
nextPage: () => void
````

Go forward through browser history.

````js
nextPage()
````

### `setRoutingMode`

````typescript
setRoutingMode: (mode: RoutingMode) => void
````

Select history or hash before mounting route elements. Use native anchors for hash mode in this release.

````js
setRoutingMode('hash')
````

### `getRoutingMode`

````typescript
getRoutingMode: () => RoutingMode
````

Read the selected mode. The initial mode is history.

````js
console.log(getRoutingMode())
````

## Type-only exports

Import these with `import type` in TypeScript. They are not runtime values.

### `RoutingMode`

````typescript
export type RoutingMode = 'history' | 'hash';
````

Use history for server-fallback apps and hash for plain static hosting. The chosen mode changes how paths are read and written.

## Examples

````js
import { goToPage, replacePage, previousPage, nextPage, setRoutingMode, getRoutingMode } from '@beforesemicolon/router'

setRoutingMode('hash')
await goToPage('/about', { from: 'home' }, 'About')
````

### Classic

````html
<script type="module">
BFS.ROUTER.setRoutingMode('hash')
await BFS.ROUTER.goToPage('/about')
</script>
````

## Related local reference

[router/page-route](page-route.md) · [router/page-link](page-link.md)

[Back to the offline reference index](../index.md)

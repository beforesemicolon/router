# pathStringToPattern / getPathMatchParams / hash helpers

`@beforesemicolon/router@1.5.0` · `router/path-utils`

Inspect and transform path patterns and hash paths in npm apps.

- These helpers are not properties of BFS.ROUTER. Use supported browser navigation and subscriptions instead.

These helpers are useful when adapting legacy URL code. The npm package is a browser router and its root is not a Node-only utility package.

## Setup

### npm

The npm root registers its custom elements automatically.

````js
import { pathStringToPattern, getPathMatchParams, getHashPathname, getHashSearch, getHashPath, pathnameToHash } from '@beforesemicolon/router'
````

### Classic scripts

This record does not expose a classic-script API.

## Public values

### `pathStringToPattern`

````typescript
pathStringToPattern: (path: string, exact?: boolean) => { pattern: RegExp; params: string[]; }
````

Compile a slash path into a regular expression for a path match. Use exact=false to allow a descendant match.

````js
const pattern = pathStringToPattern('/projects/:id')
````

### `getPathMatchParams`

````typescript
getPathMatchParams: <T extends Record<string, string>>(path: string, { pattern, params }: { pattern: RegExp; params: string[]; }) => T | null
````

Read named captures from a matching URL and compiled pattern. Returns null on a non-match.

````js
const params = getPathMatchParams('/projects/42', pathStringToPattern('/projects/:id'))
````

### `getHashPathname`

````typescript
getHashPathname: () => string
````

Extract the pathname portion of the URL fragment. Returns slash for an empty hash.

````js
console.log(getHashPathname())
````

### `getHashSearch`

````typescript
getHashSearch: () => string
````

Extract the fragment query, including its leading question mark when present.

````js
const params = new URLSearchParams(getHashSearch())
````

### `getHashPath`

````typescript
getHashPath: () => string
````

Return the fragment path plus query without the hash marker.

````js
console.log(getHashPath())
````

### `pathnameToHash`

````typescript
pathnameToHash: (pathname: string) => string
````

Prefix a plain path with a hash marker and required slash. Do not pass a path already containing the hash marker.

````js
const href = pathnameToHash('/about')
````

## Examples

````js
import { pathStringToPattern, getPathMatchParams, getHashPathname, getHashSearch, getHashPath, pathnameToHash } from '@beforesemicolon/router'

console.log(getPathMatchParams('/team/42', pathStringToPattern('/team/:id')))
````

[Back to the offline reference index](../index.md)

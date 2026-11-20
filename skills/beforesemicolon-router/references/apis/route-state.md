# getPageParams / getSearchParams / getPageData

`@beforesemicolon/router@1.5.0` · `router/route-state`

Read active route parameters, query state, or navigation payload.

- getSearchParams reads location.search. Router query subscriptions also read location.search in this version. For hash query strings, use new URLSearchParams(getHashSearch()) with npm or choose history mode for built-in query handling.

## Setup

### npm

The npm root registers its custom elements automatically.

````js
import { getPageParams, getSearchParams, getPageData, updateSearchQuery, parsePathname } from '@beforesemicolon/router'
````

### Classic scripts

- `https://cdn.jsdelivr.net/npm/@beforesemicolon/web-component@1.22.0/dist/client.js`
- `https://cdn.jsdelivr.net/npm/@beforesemicolon/router@1.5.0/dist/client.js`

**Available globals for this record:** `BFS.ROUTER.getPageParams`, `BFS.ROUTER.getSearchParams`, `BFS.ROUTER.getPageData`, `BFS.ROUTER.updateSearchQuery`, `BFS.ROUTER.parsePathname`.

Load scripts in the listed order. No bundler is needed.

## Public values

### `getPageParams`

````typescript
getPageParams: <T extends Record<string, string>>() => T
````

Read parameters from the first registered route matching the current normalized pathname. An unmatched route returns an empty object.

````js
const { id } = getPageParams()
````

### `getSearchParams`

````typescript
getSearchParams: <T extends Record<string, string>>() => T
````

Read and decode values from location.search. Raw values that cannot be parsed as JSON remain strings. A hash query is not read by this API on 1.5.0.

````js
const { tab } = getSearchParams()
````

### `getPageData`

````typescript
getPageData: <T extends Record<string, unknown>>() => T
````

Read object-valued navigation history state. It is not app storage and does not reconstruct data on a new deep link.

````js
const { from } = getPageData()
````

### `updateSearchQuery`

````typescript
updateSearchQuery: (query: Record<string, unknown> | null) => void
````

Update search values with replaceState. A null key value deletes that key; a null query clears all. Choose a link instead if every tab change must add a new history entry.

````js
updateSearchQuery({ tab: 'members', filter: null })
````

### `parsePathname`

````typescript
parsePathname: (pathnamePattern: string) => string
````

Fill colon-marked path segments from the current URL by matching segment position. Use param lookup for custom URL construction.

````js
const href = parsePathname('/projects/:id/settings')
````

## Examples

````js
import { getPageParams, getSearchParams, getPageData, updateSearchQuery, parsePathname } from '@beforesemicolon/router'

updateSearchQuery({ tab: 'profile' })
console.log(getPageParams(), getPageData())
````

### Classic

````js
BFS.ROUTER.updateSearchQuery({ tab: 'profile' })
````

## Related local reference

[router/page-data](page-data.md) · [router/page-route-query](page-route-query.md) · [router/subscriptions](subscriptions.md)

[Back to the offline reference index](../index.md)

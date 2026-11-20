# page-redirect

`@beforesemicolon/router@1.5.0` · `router/page-redirect`

Redirect unknown URLs or choose a default child route.

- Pair a fallback redirect with a registered destination route. Use type="always" and a parent-relative path for a default child.

## Setup

### npm

The npm root registers its custom elements automatically.

````js
import '@beforesemicolon/router'
````

### Classic scripts

- `https://cdn.jsdelivr.net/npm/@beforesemicolon/web-component@1.22.0/dist/client.js`
- `https://cdn.jsdelivr.net/npm/@beforesemicolon/router@1.5.0/dist/client.js`

Load scripts in the listed order. No bundler is needed.

## Element `<page-redirect>`

Navigation without a user-visible control. The containing route limits where a local redirect can act. Use an existing destination and test that navigation does not repeat when Back returns to the source.

- `path`: Path to match or navigate to. A child route adds its local path to its parent path.
- `title`: Optional page title to set during navigation.
- `payload`: Navigation data as a JSON object in HTML. Use URL parameters for durable or shareable state.
- `type`: unknown (default) redirects unregistered paths. always can select a default child when the containing route itself has no query or child path.

````html
<page-route path="/404"><h1>Page not found</h1></page-route><page-redirect path="/404"></page-redirect>
````

## Type-only exports

Import these with `import type` in TypeScript. They are not runtime values.

### `PageRedirect`

````typescript
export interface PageRedirect extends PageLink {
    type: PageRedirectProps['type'];
}
````

### `PageRedirectProps`

````typescript
export interface PageRedirectProps extends Omit<PageLinkProps, 'search' | 'keepCurrentSearch'> {
    type: 'unknown' | 'always';
}
````

## Examples

````js
import '@beforesemicolon/router'
````

````html
<page-redirect path="/404"></page-redirect>
````

### Classic

````html
<page-redirect path="/404"></page-redirect>
````

[Back to the offline reference index](../index.md)

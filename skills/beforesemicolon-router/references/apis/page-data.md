# page-data

`@beforesemicolon/router@1.5.0` · `router/page-data`

Render path parameters, search values, or navigation state.

- Use param for a path parameter, search-param for a query key, or key for a navigation payload path. Omitted data uses slot content.

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

## Element `<page-data>`

Renders one selected route datum and updates on location changes. It checks param first, then search-param, then the navigation payload. Supply default slot content for empty data. Query reads use location.search on this release.

- `param`: Capture from a registered pathname pattern. Example: id from /projects/:id.
- `search-param`: Key in the URL search string, not the fragment query.
- `key`: Property path into transient navigation data. Use a valid dotted path and a fallback slot.

**Slots:** `default`.

````html
<page-route path="/projects/:id"><h1>Project <page-data param="id">unknown</page-data></h1></page-route>
````

## Type-only exports

Import these with `import type` in TypeScript. They are not runtime values.

### `PageData`

````typescript
export interface PageData extends WebComponent<PageDataProps> {
    key: PageDataProps['key'];
    param: PageDataProps['param'];
    searchParam: PageDataProps['searchParam'];
}
````

### `PageDataProps`

````typescript
export interface PageDataProps {
    key: string;
    param: string;
    searchParam: string;
}
````

## Examples

````js
import '@beforesemicolon/router'
````

````html
<page-data search-param="tab">overview</page-data>
````

### Classic

````html
<page-data search-param="tab">overview</page-data>
````

## Related local reference

[router/route-state](route-state.md)

[Back to the offline reference index](../index.md)

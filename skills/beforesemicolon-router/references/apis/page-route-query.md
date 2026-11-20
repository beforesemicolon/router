# page-route-query

`@beforesemicolon/router@1.5.0` · `router/page-route-query`

Render a view for a matching query key and value.

- Use history mode for query-dependent views. Pair key and value with the search string on page-link.

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

## Element `<page-route-query>`

Matches a query key/value in the active route. Pair with real navigable links or the query update API. Use history mode for built-in query matching in this version.

- `key`: Query parameter name.
- `value`: Expected value. Use plain string values such as activity or members.
- `src`: Optionally load the active panel from a route module or file.
- `name`: Matching group for mutually exclusive panels.

**Slots:** `default`, `loading`, `fallback`, `hidden`.

````html
<page-link search="tab=activity">Activity</page-link><page-route-query key="tab" value="activity"><h2>Recent activity</h2></page-route-query>
````

## Type-only exports

Import these with `import type` in TypeScript. They are not runtime values.

### `PageRouteQuery`

````typescript
export interface PageRouteQuery extends WebComponent<PageRouteQueryProps> {
    key: PageRouteQueryProps['key'];
    value: PageRouteQueryProps['value'];
    src: PageRouteQueryProps['src'];
}
````

### `PageRouteQueryProps`

````typescript
export interface PageRouteQueryProps extends PageRouteProps {
    key: string;
    value: string;
    src: string;
}
````

## Examples

````js
import '@beforesemicolon/router'
````

````html
<page-route-query key="tab" value="profile"><h2>Profile</h2></page-route-query>
````

### Classic

````html
<page-route-query key="tab" value="profile"><h2>Profile</h2></page-route-query>
````

## Related local reference

[router/page-link](page-link.md) · [router/route-state](route-state.md)

[Back to the offline reference index](../index.md)

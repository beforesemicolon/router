# page-link

`@beforesemicolon/router@1.5.0` · `router/page-link`

Navigate with a real anchor and expose active state.

- Use descriptive text for the anchor. The anchor is exposed as CSS part anchor.
- Use $ for nearest route path and ~ for current path; omit path to change query on the current view.
- The active marker is reflected by the component; do not set it to navigate.
- Use page-link with history routing. In this release, use a native anchor with href="#/path" in hash mode to avoid a second hash prefix.

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

## Element `<page-link>`

A history-mode navigation control that renders an anchor in its shadow root. The CSS part is anchor. The host reflects active state and emits an active event when that state changes; use the anchor slot for descriptive text.

- `path`: Path to match or navigate to. A child route adds its local path to its parent path.
- `search`: Query string, such as tab=members. Existing keys are replaced unless kept explicitly.
- `keep-current-search`: Retain current query values and merge the link query.
- `title`: Optional page title to set during navigation.
- `payload`: Navigation data as a JSON object in HTML. Use URL parameters for durable or shareable state.
- `exact`: Choose exact rather than descendant active matching; defaults to true.

**Slots:** `default`.

### Events

- `active`: detail type `{ value: boolean }`. Fires when the link active state changes.

### Properties

- `fullPath`: `() => string`.

````html
<page-link path="/projects/settings" search="tab=members">Project members</page-link>
````

## Type-only exports

Import these with `import type` in TypeScript. They are not runtime values.

### `PageLink`

````typescript
export interface PageLink extends WebComponent<PageLinkProps> {
    path: PageLinkProps['path'];
    search: PageLinkProps['search'];
    title: PageLinkProps['title'];
    exact: PageLinkProps['exact'];
    keepCurrentSearch: PageLinkProps['keepCurrentSearch'];
    payload: PageLinkProps['payload'];
    fullPath: string;
}
````

### `PageLinkProps`

````typescript
export interface PageLinkProps {
    path: string;
    search: string;
    keepCurrentSearch: boolean;
    exact: boolean;
    title: string;
    payload: Record<string, unknown>;
}
````

## Examples

````js
import '@beforesemicolon/router'
````

````html
<page-link path="/about">About</page-link>
````

### Classic

````html
<page-link path="/about">About</page-link>
````

## Related local reference

[router/page-route](page-route.md) · [router/route-state](route-state.md)

[Back to the offline reference index](../index.md)

# page-route

`@beforesemicolon/router@1.5.0` · `router/page-route`

Render one view when the URL matches a path.

- Choose hash mode before mounting routes in static apps and use native anchors with href="#/path". Use history mode with a server fallback for deep links.
- Add exact="false" to a parent route to match descendant paths. Child paths extend the parent pattern.
- Use the component property for an imported view or function. Use src for a file URL or registered module key.
- Inactive route content is detached and may be cached and remounted on revisit. Test component lifecycle on Back.

For lazy route failure, use <p slot="fallback">Could not load this page.</p> inside the route. A retry can happen after the route deactivates and is opened again.

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

## Element `<page-route>`

Defines route content. The router derives a full path from the closest parent route. Put one route-local heading inside it. Use slot content for synchronous markup, an imported component value for bundler-aware markup, or src for lazily loaded route content.

- `path`: Path to match or navigate to. A child route adds its local path to its parent path.
- `src`: A module key, JavaScript/TypeScript file, or fetchable HTML/text URL. Match a registry key exactly if using lazy modules.
- `component`: An imported Markup template, DOM node, trusted markup string, or callback passed as a value. Do not pass a component identifier as a literal HTML string.
- `title`: Optional page title to set during navigation.
- `exact`: Defaults to true. Use exact="false" on a parent layout so it remains active on child paths.
- `name`: Groups candidate routes that should not render together. Use a shared name for alternative matches.

**Slots:** `default`, `loading`, `fallback`, `hidden`.

````html
<page-route path="/projects" exact="false"><page-route path="/settings"><h1>Settings</h1></page-route></page-route>
````

## Type-only exports

Import these with `import type` in TypeScript. They are not runtime values.

### `PageRoute`

````typescript
export interface PageRoute extends WebComponent<PageRouteProps> {
    path: PageRouteProps['path'];
    src: PageRouteProps['src'];
    component: PageRouteProps['component'];
    title: PageRouteProps['title'];
    exact: PageRouteProps['exact'];
    name: PageRouteProps['name'];
    fullPath: string;
}
````

### `PageRouteProps`

````typescript
export interface PageRouteProps {
    path: string;
    src: string;
    component: unknown;
    exact: boolean;
    title: string;
    name: string;
}
````

## Examples

````js
import '@beforesemicolon/router'
````

````html
<page-route path="/about"><h1>About</h1></page-route>
````

### Classic

[Open the complete local example](../../examples/classic/two-views.html).

## Related local reference

[router/page-link](page-link.md) · [router/navigation](navigation.md)

[Back to the offline reference index](../index.md)

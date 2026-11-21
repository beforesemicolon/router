# Router workflows

[Public API, types, and elements](index.md) · [Runnable examples](../examples/README.md) · [Skill entry](../SKILL.md) · [Route ownership](route-ownership.md)

## Installation and mode selection

In a bundled application use one `import '@beforesemicolon/router'` in the
browser entry point. It is a registration side effect, not an app router
instance. Named APIs come from the same package. Do not invoke the browser
entry on the server; render accessible native shell links if you need
server-side HTML.

Use history mode when the host serves the app shell for route URLs. A request
for `/projects/settings?tab=activity` must return the same index as `/`.
Serving a file called `index.html` is not sufficient if the host responds 404
for every unmatched path. Keep API and asset routes outside the fallback.

Use hash mode for plain file hosting. Call `setRoutingMode('hash')` before
mounting route content. In 1.5.0, native hash anchors avoid double-prefixing;
programmatic calls take a path without `#`. Hash queries can be read with
`new URLSearchParams(getHashSearch())` in npm code, but built-in query panels,
page-data query values, and route listener query fields use document search.
Choose history mode for a query-driven interface.

For classic browser scripts load Web Component first, then Router. A compatible
Web Component client already supplies Markup. The classic client registers the
tags automatically and exposes the globals listed in the [entry matrix](index.md).

## Layout, named alternatives, and accessible links

Use `page-route` for views, and put a semantic heading in each active page.
A parent needs `exact="false"` to stay mounted while a child route is active.
A child's `path="/:id"` inside `path="/projects"` becomes `/projects/:id`.
Use the actual final URL in top-level links, or `path="$/settings"` inside the
owning route to derive a link from the closest router parent. `path="~/settings"`
uses the current URL path instead.

A `page-link` in history mode contains its own anchor. Do not put a button,
anchor, or other interactive element inside that link. Use text that says where
it goes. The host reflects the active attribute and exports CSS part
`anchor`; rely on that part rather than shadow DOM selectors.

Keep paths distinct where possible. If multiple layouts would match at once
but must not coexist, assign their route controls the same `name` and order
specific matches before broader matches. Do not use that grouping as a
permission check. Unmatched paths can redirect to a known `/404` view.

## Let URL and history own the right state

Use a path parameter for an object identifier, e.g. `/project/:projectId`.
Use a query key for shareable variations within that view, e.g. `?tab=members`.
Use a payload for transient data only. A URL opened in a new tab has no
previous payload. Keep session data in the application's own persistence.

For history-mode tabs, `<page-link search="tab=members">Members</page-link>`
adds navigation, while `updateSearchQuery({ tab: 'members' })` replaces the
current history entry. To remove one filter, pass `null` for its key; to clear
all query values, pass `null` as the query. Test Back after both operations.
Show fallback content in `page-data` for missing values.

## Loading and lifetime

Prefer slot content for small static views. For bundled views, assign a real
imported value to the `component` property. For lazy content, register import
functions in a registry and use the same key as the route's `src`. Route loading
deduplicates pending requests and caches resolved content. A revisited view can
reuse cached content; mounted components must still clean up observers and
subscriptions when detached.

```js
import {
    registerRouteModules,
    preloadRouteModule,
} from '@beforesemicolon/router'
registerRouteModules({
    '/views/about.js': async () => ({ default: '<h1>About</h1>' }),
})
await preloadRouteModule('/views/about.js')
```

```html
<page-route path="/about" src="/views/about.js">
    <p slot="loading" role="status">Loading about…</p>
    <p slot="fallback">Could not load the About page.</p>
</page-route>
```

The explicit loader above is self-contained. For real code splitting use
`() => import('./views/about.js')` and export the view as the module's default.
A route callback receives page state, pathname params and query in that order.
Do not use a route callback to apply side effects you cannot undo.

## Guards and subscriptions

Register once at app bootstrap; returning true allows, false blocks, and a
destination string redirects. Avoid redirects back into the same blocked
pattern. Apply authentication and authorization on the server too. A router
guard only controls browser behavior.

```js
import { registerRouteGuard, onPage } from '@beforesemicolon/router'
registerRouteGuard('/retired', () => '/archive')
const stop = onPage('/projects/:id', (active, { params }) => {
    if (active) document.title = `Project ${params.id}`
})
// Call stop() when the owner of this subscription disconnects.
```

Use `onPage` when only a particular route interests your component.
`onPageChange` receives every resolved navigation. The global
`router:change` CustomEvent carries the pathname, query and data.

## Debug and test

1. Confirm the installed version and actual script order.
2. Inspect the physical href and resulting pathname or hash. A matching
   location can still show no route if a parent did not allow descendants.
3. Verify that exactly the expected heading is visible; query panels may be
   empty when no account of the query has been specified.
4. Test click, Back, Forward, and a direct deep-link reload. If the URL updates
   but the view does not, inspect route registration and match patterns before
   changing HTML.
5. Test a lazy panel failure and retry. Check unsubscribe cleanup when a route
   goes inactive. Use the [record index](index.md) for the constructor-free
   contract, not private class internals.

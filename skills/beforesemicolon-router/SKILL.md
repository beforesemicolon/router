---
name: beforesemicolon-router
description: Build or debug URL navigation and route-aware views with @beforesemicolon/router. Use for layouts, route links, path parameters, query tabs, guards, and browser Back.
---

# Build with Before Semicolon Router

## Match the project

1. Determine the installed version from package metadata or the lockfile. In a
   no-build app, read the actual script URL or import map. If the version is
   unclear, report it instead of assuming latest.
2. Read that package's `ai/index.json` and one or two matching records. For
   browser-only access, use
   `https://cdn.jsdelivr.net/npm/@beforesemicolon/router@VERSION/ai/index.json`.
   If the index is absent, use source and docs for the installed release.
3. Preserve the existing installation mode. The npm root import automatically
   registers the routing elements. For a classic page, load the compatible Web
   Component client first, then the Router client. Router functions are under
   `BFS.ROUTER`; not every npm export exists in that namespace. Web Component
   already provides `BFS.MARKUP`; do not load another Markup runtime.

## Choose records by task

- Views, layouts, deep links, and local demos: `router/page-route` and
  `router/navigation`. The route record links a packed no-build example.
- Links, query tabs, and path data: `router/page-link`,
  `router/page-route-query`, `router/page-data`, or `router/route-state`.
- Lifecycle and programmatic route behavior: `router/subscriptions`,
  `router/guards`, and `router/route-modules`.

## Apply the patterns

- Prefer declarative routes. Use a clear heading in each view and descriptive
  anchor text. In history mode, pass `path` to `page-link`, not `href`.
  Configure a server fallback for direct loads of nested URLs.
- For a static host without a server fallback, set hash mode before mounting
  routes. In the 1.5 release, use native anchors such as
  `<a href="#/about">About</a>` in hash mode. The Router's JS API takes
  `goToPage('/about')` without the hash prefix. Use history mode for built-in
  query-dependent views on this release.
- Set `exact="false"` on a parent that must stay mounted for child routes.
  Use the child's path relative to that parent. Use URL params or queries for
  state a user needs to bookmark or share, not the navigation payload.
- Use `onPage` for a single route. Retain its unsubscribe function and call it
  on teardown. Inactive route content may be detached and reused; route-scoped
  work must not assume one mount for the life of the app.

## Verify the interaction

Open two routes over HTTP. Check the visible view and URL after clicking a link,
using Back, and opening a deep link directly when supported by the host. If the
Before Semicolon checker is installed, run it on the changed files. A passing
checker does not substitute for a browser interaction.

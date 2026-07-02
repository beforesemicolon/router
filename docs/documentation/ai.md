---
name: AI Guide
order: 5
title: AI Guide for Before Semicolon Router
description: A compact reference for AI assistants and developers generating Router code, with accurate components, APIs, patterns, and constraints.
layout: document
---

## AI Guide

Use this page as the compact reference when generating examples, tutorials, migrations, or application code for `@beforesemicolon/router`.

## Package Purpose

`@beforesemicolon/router` is an HTML-first routing library built with Web Components. It provides custom elements for navigation and route rendering, plus a small JavaScript API for programmatic navigation, subscriptions, guards, route modules, metadata, query updates, and hash routing.

## Required Imports

For bundled apps:

```javascript
import '@beforesemicolon/router'
```

When using exported APIs:

```javascript
import {
    goToPage,
    onPage,
    onPageChange,
    registerGlobalGuard,
    registerRouteGuard,
    registerRouteModules,
    updateSearchQuery,
} from '@beforesemicolon/router'
```

For direct browser use, load Web Component first:

```html
<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>
<script src="https://unpkg.com/@beforesemicolon/router/dist/client.js"></script>
```

CDN APIs are available at `BFS.ROUTER`.

## Custom Elements

Use these elements exactly:

```html
<page-link path="/docs" title="Docs">Docs</page-link>
<page-route path="/docs" src="./pages/docs.html"></page-route>
<page-route-query key="tab" value="api">API tab</page-route-query>
<page-redirect path="/404"></page-redirect>
<page-data param="id">fallback</page-data>
```

## Route Patterns

Use `:name` for dynamic params:

```html
<page-route path="/users/:userId">
    User <page-data param="userId">unknown</page-data>
</page-route>
```

Set `exact="false"` for layout routes that should remain active for nested paths:

```html
<page-route path="/docs" exact="false">
    <page-route path="/intro">Intro</page-route>
    <page-route path="/api">API</page-route>
</page-route>
```

## Link Rules

Use `path` for path navigation and `search` for query updates. Use `keep-current-search` when updating one query key while preserving the others.

```html
<page-link path="/projects">Projects</page-link>
<page-link search="view=grid" keep-current-search>Grid</page-link>
```

Use `$` inside a nested route to reference the closest parent route path:

```html
<page-route path="/projects/:projectId" exact="false">
    <page-link path="$/settings">Settings</page-link>
</page-route>
```

Use `~` to reference the current browser pathname:

```html
<page-link path="~/edit">Edit current page</page-link>
```

## Lazy Route Content

`src` can load HTML, text, or JavaScript modules. JavaScript modules must default export a string, a DOM `Node`, a Markup `HtmlTemplate`, or a function that receives `(data, params, query)`.

```javascript
import { html } from '@beforesemicolon/web-component'

export default (data, params, query) => html`
    <h1>Project ${params.projectId}</h1>
    <p>Filter: ${query.filter || 'all'}</p>
    <p>Opened from: ${data.from || 'direct visit'}</p>
`
```

## Programmatic Navigation

`goToPage` and `replacePage` are async and accept an object-literal state payload.

```javascript
await goToPage('/users/42', { from: 'search' }, 'User 42')
await replacePage('/login', { reason: 'expired' }, 'Login')
```

## Guards

`registerGlobalGuard` and `registerRouteGuard` register guards and do not return cleanup functions. A guard returns:

-   `true` to allow navigation.
-   `false` to block navigation.
-   A path string to redirect.
-   A promise resolving to one of those values.

```javascript
registerGlobalGuard((pathname) => {
    if (pathname.startsWith('/account') && !auth.isSignedIn()) {
        return '/login'
    }

    return true
})
```

## Query Data

`getSearchParams` parses search values with the router JSON parser. Values written with `updateSearchQuery` round-trip through JSON stringification.

```javascript
updateSearchQuery({ page: 2, tags: ['router', 'web'] })
```

## Avoid These Mistakes

-   Do not use React Router syntax such as `<Route>` or `useNavigate`.
-   Do not claim route guard registration returns an unsubscribe function.
-   Do not use `href` on `<page-link>`; use `path` and `search`.
-   Do not use `component="..."` as a string in HTML. `component` is a property for JavaScript-rendered routes.
-   Do not use route state for permanent data. Prefer params, query strings, or application storage.

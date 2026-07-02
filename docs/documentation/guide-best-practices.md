---
name: Guide & Best Practices
order: 4
title: Router Guide & Best Practices - Router by Before Semicolon
description: Practical guidance for building maintainable HTML-first routing with Before Semicolon Router, including route structure, redirects, guards, links, and lazy loading.
layout: document
---

## Guide & Best Practices

Router works best when the URL is treated as the source of truth for navigation, filters, tabs, and shareable UI state. Keep route declarations close to the layout they control, then use the JavaScript API only for behavior that cannot be expressed cleanly in HTML.

## Start With Declarative Routes

For most pages, use `<page-route>`, `<page-link>`, and `<page-redirect>` directly in the document. This keeps the app understandable from the HTML structure alone.

```html
<nav>
    <page-link path="/" title="Home">Home</page-link>
    <page-link path="/projects" title="Projects">Projects</page-link>
    <page-link path="/settings" title="Settings">Settings</page-link>
</nav>

<main>
    <page-route path="/" src="./pages/home.html"></page-route>
    <page-route
        path="/projects"
        exact="false"
        src="./pages/projects.js"
    ></page-route>
    <page-route path="/settings" src="./pages/settings.html"></page-route>
    <page-route path="/404">Page not found.</page-route>
    <page-redirect path="/404"></page-redirect>
</main>
```

## Use Nested Routes For Layouts

Parent routes are useful for sections that share navigation, headings, or route data. Child paths extend the nearest parent route.

```html
<page-route path="/projects/:projectId" exact="false">
    <header>
        <h1>Project <page-data param="projectId">unknown</page-data></h1>
        <page-link path="$/overview">Overview</page-link>
        <page-link path="$/activity">Activity</page-link>
        <page-link path="$/settings">Settings</page-link>
    </header>

    <page-route path="/overview" src="./projects/overview.js"></page-route>
    <page-route path="/activity" src="./projects/activity.html"></page-route>
    <page-route path="/settings" src="./projects/settings.js"></page-route>
    <page-redirect path="$/overview" type="always"></page-redirect>
</page-route>
```

## Use Query Routes For UI State

Use `<page-route-query>` when the view is still the same page but a query value should choose a tab, drawer, filter, or modal.

```html
<page-link search="panel=details" keep-current-search>Details</page-link>
<page-link search="panel=activity" keep-current-search>Activity</page-link>

<page-route-query key="panel" value="details">
    <h2>Details</h2>
</page-route-query>

<page-route-query key="panel" value="activity" src="./panels/activity.html">
    <p slot="loading">Loading activity...</p>
</page-route-query>
```

## Prefer `component` For Typed Apps

If you are rendering routes from Markup or Web Component code, the `component` property avoids string-based dynamic imports and gives bundlers a direct reference.

```javascript
import { html } from '@beforesemicolon/web-component'
import HomePage from './pages/HomePage.js'
import ProjectPage from './pages/ProjectPage.js'

export const routes = html`
    <page-route path="/" component="${HomePage}"></page-route>
    <page-route
        path="/projects/:projectId"
        component="${ProjectPage}"
    ></page-route>
`
```

## Register Guards Before Navigation

Guards run before route listeners and route components are notified. Register them during application startup, before rendering protected routes or triggering navigation.

```javascript
import {
    registerGlobalGuard,
    registerRouteGuard,
} from '@beforesemicolon/router'

registerGlobalGuard((pathname) => {
    if (pathname.startsWith('/account') && !session.currentUser) {
        return '/login'
    }

    return true
})

registerRouteGuard('/admin/:section', async () => {
    return (await session.hasRole('admin')) || '/unauthorized'
})
```

## Keep 404s Last

`<page-redirect>` checks the routes that have been registered. Put fallback redirects after the valid `<page-route>` declarations they depend on.

```html
<page-route path="/">Home</page-route>
<page-route path="/docs" exact="false">Docs</page-route>
<page-route path="/404">Not found</page-route>

<page-redirect path="/404"></page-redirect>
```

## Choose History Or Hash Routing Early

History routing gives clean URLs and is the default. Hash routing is useful when your host cannot rewrite unknown paths back to `index.html`.

```javascript
import { setRoutingMode } from '@beforesemicolon/router'

setRoutingMode('hash')
```

## Production Checklist

-   Give every meaningful route a document `title` through `<page-link>`, `<page-route>`, or your own `onPageChange` handler.
-   Use route params for resource identity and search params for shareable view state.
-   Keep route modules small and lazy-load secondary screens.
-   Use `name` on overlapping route groups so only the first matching route renders.
-   Use `payload` only for transient navigation state. Persist important state in the URL or application data store.

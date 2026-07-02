---
name: Router
order: 0
title: Router by Before Semicolon
description: A tiny Web Component router for HTML-first apps. Declare links, routes, redirects, query routes, lazy pages, guards, and route data without framework lock-in.
layout: landing
---

::: layout landing-hero version="@beforesemicolon/router" title="Routing" title2="in plain HTML." primaryLabel="Get Started" secondaryLabel="$ npm i @beforesemicolon/router"

=== copy

A tiny Web Component router for HTML-first apps. Route by pathname or search query, lazy-load HTML/JS/TXT pages, nest route layouts, guard protected screens, and keep framework lock-in out of your navigation layer.

=== stat

## 5

WEB COMPONENTS

=== stat

## 0

CONFIG

=== stat

## HTML

JS - TXT PAGES

=== code filename=index.html lang=html

```html
<!-- index.html — zero JavaScript required -->
<nav>
    <page-link path="/" title="Home">Home</page-link>
    <page-link path="/todos" title="Todos">Todos</page-link>
    <page-link path="/contact" title="Contact">Contact</page-link>
</nav>

<page-route path="/">
    <h1>Welcome</h1>
</page-route>

<!-- lazy-load HTML, txt or JS files -->
<page-route path="/todos" src="./pages/todos.html"></page-route>
<page-route path="/contact" src="./pages/contact.js"></page-route>

<!-- redirect unknown paths -->
<page-redirect path="/404"></page-redirect>
```

:::

::: layout landing-ecosystem

=== header

`// THE ECOSYSTEM`

## Powered by Markup & Web Component.

Router is built on top of Web Component, which is built on top of Markup. Same engine, modular packages, zero lock-in.

=== product title="Markup" package="@beforesemicolon/markup" color=orange icon=reactive href="https://markup.beforesemicolon.com"

The 9Kb reactive templating system that powers everything. Tagged templates, state, effects, repeat, suspense.

=== product title="Web Component" package="@beforesemicolon/web-component" color=cyan icon=webComponents href="https://web-component.beforesemicolon.com"

A reactive layer over native Custom Elements — the foundation Router is built on. Props, state, scoped styles, lifecycles.

:::

::: layout landing-features

=== header

`// WHY THIS ROUTER`

## Routing that disappears into HTML.

Five web components, one central matcher, and a clean JS API for everything you can't express in markup.

=== feature icon=plug

### Plug & play

Drop in two script tags and route with HTML. No build step, no router config, no JavaScript required.

=== feature icon=tiny

### Tiny & focused

A small surface area: five web components and a JS API. Built on Markup + Web Component, with zero extra deps.

=== feature icon=sparkles

### Lazy-loaded pages

Point page-route at an HTML, txt or JS file. Modules load once, cache between visits, mount and unmount cleanly.

=== feature icon=webComponents

### Nested & named routes

Children extend their parent's path. Use the name attribute for switch-like, mutually exclusive matching.

=== feature icon=router

### Search-query routing

page-route-query renders content based on ?key=value — tabs, filters and modals without a single line of state.

=== feature icon=standards

### Smart redirects

page-redirect targets unknown paths only — or always, scoped to its parent route. Perfect for 404s and defaults.

=== feature icon=surgical

### One match, one render

A central matcher resolves each navigation once. Guards run once. Subscribers only fire when they're relevant.

=== feature icon=sparkles

### Cached remounts

Inactive routes are detached from the DOM but kept warm. Coming back is an instant remount, not a rebuild.

=== feature icon=plug

### Works with any builder

Vite, Webpack, esbuild, plain HTML, or a CDN script tag — it's just web components, so it slots in anywhere.

:::

::: layout landing-showcase

=== header

`// SEE IT IN ACTION`

## Five examples. Infinite sitemaps.

Compose page-route, page-link, page-route-query, page-redirect, page-data and the small JS API around them.

=== example label="Nested routes & params" color=cyan filename=app.html lang=html

```html
<!-- nested routes — child paths extend the parent -->
<page-route path="/projects" exact="false">
    <h1>Projects</h1>

    <!-- /projects -->
    <page-route src="./pages/projects-list.js"></page-route>

    <!-- /projects/:projectId — pathname params -->
    <page-route path="/:projectId" src="./pages/project.js">
        <div slot="loading">Loading project...</div>
        <div slot="fallback">Could not load this project.</div>
    </page-route>

    <!-- only redirects unknown CHILD routes of /projects -->
    <page-redirect path="/projects/not-found"></page-redirect>
</page-route>
```

=== example label="Search-query routes" color=orange filename=tabs.html lang=html

```html
<!-- routing by ?tab= — perfect for tabs, filters, modals -->
<div class="tabs">
    <div class="tab-header">
        <page-link search="tab=one">Tab 1</page-link>
        <page-link search="tab=two">Tab 2</page-link>
    </div>

    <div class="tab-content">
        <page-route-query key="tab" value="one">
            Tab One content
        </page-route-query>

        <page-route-query key="tab" value="two">
            Tab Two content
        </page-route-query>
    </div>
</div>
```

=== example label="Page metadata" color=cyan filename=user.html lang=html

```html
<!-- render location metadata: payload, params and search queries -->
<page-link path="/users/42" title="User profile" payload='{"role": "admin"}'
    >Open user 42</page-link
>

<page-route path="/users/:userId">
    <h1>User <page-data param="userId">unknown</page-data></h1>

    <!-- payload data passed via the link -->
    <p>Role: <page-data key="role">guest</page-data></p>

    <!-- current search query value (following router API search-param attribute) -->
    <p>Tab: <page-data search-param="tab">overview</page-data></p>
</page-route>
```

=== example label="Protected routes" color=green filename=guards.js lang=javascript

```javascript
import {
    registerGlobalGuard,
    registerRouteGuard,
} from '@beforesemicolon/router'

registerGlobalGuard((pathname) => {
    const publicPages = ['/', '/login', '/pricing', '/404']

    if (!publicPages.includes(pathname) && !auth.isSignedIn()) {
        return '/login'
    }

    return true
})

registerRouteGuard('/admin/:section', async () => {
    return (await auth.hasRole('admin')) || '/unauthorized'
})
```

=== example label="Bundler-friendly pages" color=orange filename=routes.js lang=javascript

```javascript
import { registerRouteModules } from '@beforesemicolon/router'

registerRouteModules(
    import.meta.glob('./pages/**/*.{js,html,txt}', {
        eager: false,
    })
)
```

```html
<page-route path="/" src="./pages/home.js"></page-route>
<page-route path="/docs" src="./pages/docs.html"></page-route>
<page-route path="/legal" src="./pages/legal.txt"></page-route>
```

:::

::: layout landing-install

=== header

`// quick start`

## Install in seconds.

Choose your preferred installation method. Works everywhere JavaScript runs.

=== tab key=cdn label=CDN command="<script src=&quot;https://unpkg.com/@beforesemicolon/router/dist/client.js&quot;></script>"

=== tab key=npm label=npm command="npm install @beforesemicolon/router"

=== tab key=yarn label=yarn command="yarn add @beforesemicolon/router"

=== tab key=pnpm label=pnpm command="pnpm add @beforesemicolon/router"

:::

::: layout landing-cta title="Build single and multi-page apps," title2="your way."

=== copy

Combine the simplicity of vanilla Web Standards with the power of declarative routing.

:::

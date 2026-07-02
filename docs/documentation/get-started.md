---
name: Get Started
order: 2
title: Get Started with Router - Before Semicolon
description: Build your first HTML-first Router app with page-link, page-route, page-data, lazy route files, and 404 redirects.
layout: document
---

## Get Started

Setting up routing does not require a route config file, wrapper framework, or build tool. A small app can be fully routed with HTML tags, and a larger app can move each view into lazy HTML or JavaScript route files.

Let's build a simple multi-tab dashboard step-by-step:

## Step 1: Add the Scripts

Import the required scripts. The Router relies on `@beforesemicolon/web-component` for the underlying custom element behavior:

```html
<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>
<script src="https://unpkg.com/@beforesemicolon/router/dist/client.js"></script>
```

## Step 2: Declare Navigation Links

Create navigation links using the `<page-link>` tag. Use the `path` attribute to point to specific URLs and `title` to specify the document title:

```html
<nav>
    <page-link path="/" title="Home Dashboard">Home</page-link>
    <page-link path="/todos" title="Todo Manager">Todos</page-link>
    <page-link path="/contact" title="Get in Touch">Contact</page-link>
</nav>
```

## Step 3: Define Page Routes

Wrap your page views inside `<page-route>` tags. The contents of these elements will only render when the browser pathname matches their `path` attribute:

```html
<!-- Home Page -->
<page-route path="/">
    <h1>Welcome Home</h1>
    <p>This is the default dashboard view.</p>
</page-route>

<!-- Todo Page (exact path matching) -->
<page-route path="/todos">
    <h1>Your Todos</h1>
    <p>Manage your daily activities here.</p>
</page-route>

<!-- Contact Page -->
<page-route path="/contact">
    <h1>Contact Us</h1>
    <p>Send us an email at contact@example.com</p>
</page-route>
```

## Step 4: Handle 404s and Redirects

To redirect users when they navigate to an unregistered or invalid URL, define a `404` route and a `<page-redirect>` at the bottom of your routing list:

```html
<!-- 404 Fallback page -->
<page-route path="/404">
    <h1>404 - Page Not Found</h1>
</page-route>

<!-- Redirects any unknown paths to the 404 page -->
<page-redirect path="/404"></page-redirect>
```

---

## Next Steps

Now that you have a basic routing layout, you can explore:

-   **[Guide & Best Practices](./guide-best-practices/)** for route structure, redirects, guards, and production conventions.
-   **[Page Route](./web-components/page-route/)** to render params, nested views, loading states, and lazy route files.
-   **[Navigation APIs](./routing-apis/navigation/)** to navigate programmatically inside JavaScript.
-   **[Route Guards](./advanced-features/route-guards/)** to secure pages with sync or async checks.

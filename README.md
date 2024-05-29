# Web Component Router (beta)

[![Static Badge](https://img.shields.io/badge/documentation-router-blue)](https://markup.beforesemicolon.com/documentation/router)
[![Test](https://github.com/beforesemicolon/router/actions/workflows/test.yml/badge.svg)](https://github.com/beforesemicolon/router/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/%40beforesemicolon%2Frouter)](https://www.npmjs.com/package/@beforesemicolon/router)
![npm](https://img.shields.io/npm/l/%40beforesemicolon%2Frouter)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c34e61bd-3c8f-4c01-a524-dcbcddfa78dd/deploy-status)](https://app.netlify.com/sites/bfs-router/deploys)

Web component router based on [Markup](https://markup.beforesemicolon.com/).

## Motivation
- web standards alone routing is hard to work with
- it takes time to implement a custom router
- most routers out there are framework specific
- routers out there require JavaScript code to be written and a powerful component tag simplifies that
- available routers dont handle both JavaScript and HTML files
- web components work with everything which makes it a perfect candidate for a router

```html
<nav>
    <page-link path="/">Home</page-link>
    <page-link path="/contact">Contact</page-link>
</nav>

<page-route path="/">
    Home content
</page-route>

<page-route path="/contact">
    Contact content
</page-route>

<page-route path="/404">
    404 - Page not found!
</page-route>

<page-redirect to="/404"></page-redirect>
```

## Examples

* [Demo Doc](https://bfs-router.netlify.app/)
* [Tabs](https://stackblitz.com/edit/stackblitz-starters-jrfnhm?file=index.html)

## Installation

```
npm install @beforesemicolon/router
```

via CDN:

```html
<!-- required WebComponent Markup to be present -->
<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>


<!-- use the latest version -->
<script src="https://unpkg.com/@beforesemicolon/router/dist/client.js"></script>

<!-- use a specific version -->
<script src="https://unpkg.com/@beforesemicolon/router@0.1.0/dist/client.js"></script>

<!-- link you app script after -->
<script>
    const { ... } = BFS.ROUTER
</script>

```

## Documentation

[Full Documentation](https://markup.beforesemicolon.com/documentation/router)
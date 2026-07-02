---
name: Installation
order: 3
title: Install Router - Before Semicolon
description: Install @beforesemicolon/router with npm, yarn, pnpm, or direct browser script tags for HTML-first Web Component routing.
layout: document
---

## Installation

`@beforesemicolon/router` works in bundled applications and directly in modern browsers through CDN script tags.

## Package Managers

Install the package via your preferred package manager to bundle it with Vite, Webpack, or Esbuild:

## npm

```sh
npm install @beforesemicolon/router
```

## yarn

```sh
yarn add @beforesemicolon/router
```

## pnpm

```sh
pnpm add @beforesemicolon/router
```

---

## Direct CDN (Zero-Build)

For simple HTML prototypes or build-less applications, load the compiled browser bundles directly from `unpkg.com` or `jsDelivr`:

```html
<!-- 1. Import the base web component library (Required dependency) -->
<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>

<!-- 2. Import the router browser bundle -->
<script src="https://unpkg.com/@beforesemicolon/router/dist/client.js"></script>
```

## Locking Versions

It is highly recommended to lock the version in production environments to avoid breaking changes when new updates are published:

```html
<script src="https://unpkg.com/@beforesemicolon/router@1.2.0/dist/client.js"></script>
```

---

## Global Namespace

When loaded via a script tag, all exported classes, routing functions, and utilities are available under the global `BFS` window object:

```javascript
// Access router components and APIs
const { goToPage, onPage, registerRouteGuard } = BFS.ROUTER
```

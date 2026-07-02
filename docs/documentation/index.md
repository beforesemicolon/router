---
name: What is Router?
order: 1
title: What is Router? - HTML-First Web Component Routing
description: Learn how Before Semicolon Router brings declarative, lazy, guarded, framework-agnostic routing to HTML, Web Components, SPAs, MPAs, and hybrid apps.
layout: document
---

## What is Router?

`@beforesemicolon/router` is a Web Component based routing solution for single-page apps, multi-page apps, and hybrid sites that want client-side navigation without adopting a framework router.

It uses custom elements, so routes live in the same HTML structure as the views they control. You can start with static markup, add lazy route files as the app grows, and reach for JavaScript APIs only when you need guards, analytics, programmatic navigation, or bundler integration.

## Execution Model

The router resolves page activations through a central matching engine:

-   **Single Matcher:** The URL is parsed and matched once per navigation event.
-   **Unified Guards:** Global and route-specific guards run exactly once for each transition, avoiding redundant checks.
-   **Surgical Notifications:** Only route-aware elements affected by the URL change are notified, preventing unnecessary re-renders.
-   **Cached Remounts:** When a route becomes inactive, its DOM nodes are detached and kept in memory. Navigating back remounts the cached content instantly instead of recreating it.

## Key Features

-   **Declarative Navigation:** Change pages and update document titles via the `<page-link>` tag.
-   **Path Matching:** Load inline views or external route files using `<page-route>` with dynamic parameters (e.g., `:id`).
-   **Search Parameter Rendering:** React to URL query strings cleanly using `<page-route-query>`.
-   **Intelligent Fallbacks:** Set up default locations or catch-all 404 pages using `<page-redirect>`.
-   **Metadata Accessibility:** Access pathname params, query values, or state payload details instantly using `<page-data>`.
-   **Advanced Control:** Secure routes with async Route Guards, swap between History and Hash routing modes, and integrate with module bundlers.

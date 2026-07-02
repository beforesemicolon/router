---
name: Module Registry
order: 8.3
title: Module Registry - Router by Before Semicolon
description: Learn how to pre-register page modules for code splitting and bundler integration.
layout: document
---

## Module Registry

When building large-scale applications with modern asset bundlers (like Vite or Webpack), dynamic string imports in the `src` attribute (e.g. `<page-route src="./pages/home.js">`) are difficult for bundlers to trace during static analysis.

The **Module Registry** allows you to pre-register a map of page paths to their loader functions, enabling proper code-splitting and asset tracing in your build pipeline.

---

### `registerRouteModules`

Registers a map of paths to their module loader functions.

```typescript
type ModuleLoader = () => Promise<any>

function registerRouteModules(modules: Record<string, ModuleLoader>): void
```

---

### Integration Examples

#### 1. Vite (`import.meta.glob`)

Vite supports importing multiple files matching a glob pattern automatically:

```javascript
import { registerRouteModules } from '@beforesemicolon/router'

// 1. Gather all page components (lazy loaders)
const modules = import.meta.glob('./pages/**/*.{ts,js,html}', { eager: false })

// 2. Register with router
registerRouteModules(modules)
```

#### 2. Webpack (`require.context`)

Webpack uses `require.context` to trace directory structures:

```javascript
import { registerRouteModules } from '@beforesemicolon/router'

const context = require.context('./pages', true, /\.(ts|js|html)$/)
const modules = {}

context.keys().forEach((key) => {
    // Map paths to loaders
    modules[key] = () => Promise.resolve(context(key))
})

registerRouteModules(modules)
```

#### 3. Manual Registration

You can also manually map imports:

```javascript
import { registerRouteModules } from '@beforesemicolon/router'

registerRouteModules({
    './pages/home.js': () => import('./pages/home.js'),
    './pages/about.js': () => import('./pages/about.js'),
})
```

---

### Usage in HTML

Once modules are registered, define your `<page-route>` tags as normal. The router will intercept the `src` string and resolve it using the pre-registered loader instead of triggering a generic browser fetch request:

```html
<!-- Uses the registered bundler import loader automatically -->
<page-route path="/" src="./pages/home.js"></page-route>
```

---

### `getRouteModule`

Retrieves a registered module loader by its path.

```typescript
function getRouteModule(path: string): ModuleLoader | undefined
```

### Preloading Registered Modules

Registered modules can be preloaded before the user navigates to them.

```typescript
function preloadRouteModule(path: string): Promise<void>
function preloadRouteModules(paths: string[]): Promise<void>
```

```javascript
import { preloadRouteModules } from '@beforesemicolon/router'

await preloadRouteModules(['./pages/dashboard.js', './pages/settings.js'])
```

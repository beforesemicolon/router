# Web Component based Router

[![Static Badge](https://img.shields.io/badge/documentation-blue)](https://markup.beforesemicolon.com/documentation/capabilities/router)
[![Test](https://github.com/beforesemicolon/router/actions/workflows/test.yml/badge.svg)](https://github.com/beforesemicolon/router/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/%40beforesemicolon%2Frouter)](https://www.npmjs.com/package/@beforesemicolon/router)
![npm](https://img.shields.io/npm/l/%40beforesemicolon%2Frouter)

Web component router based on [Markup](https://markup.beforesemicolon.com/).

## Motivation

-   a router that works for MPA, SPA, and hybrid Apps are rare
-   web standards alone routing is hard to work with
-   it takes time to implement a custom router
-   most routers out there are framework specific
-   routers out there require JavaScript code to be written and a powerful component tag simplifies that
-   available routers dont handle both JavaScript, text, and HTML files loading
-   web components work with everything which makes it a perfect candidate for a router

```html
<!-- index.html -->

<nav>
    <!-- navigate with ability to update title and pass data via payload attribute -->
    <page-link path="/" title="Welcome" payload='{"heading": "Home content"}'
    >Home</page-link
    >
    <page-link path="/todos" search="tab=one" title="Manage todos"
    >Todos</page-link
    >
    <page-link path="/contact" title="Contact">Contact</page-link>
</nav>

<!-- wrap the content to render based on url pathname -->
<page-route path="/">
    <h1>
        <!-- render page metadata like specified payload, 
            path and search query param values -->
        <page-data key="heading"> Home content </page-data>
    </h1>
    <p>This is home content</p>
    
    <div class="tabs">
        <div class="tab-header">
            <!-- update search query -->
            <page-link search="tab=one">Tab 1</page-link>
            <page-link search="tab=two">Tab 2</page-link>
        </div>
        
        <div class="tab-content">
            <!-- render content base on specific search query values -->
            <page-route-query key="tab" value="one">
                Tab One content
            </page-route-query>
            
            <page-route-query key="tab" value="two">
                Tab Two content
            </page-route-query>
        </div>
    </div>
    
    <!-- choose to ALWAYS redirect to a default location when no url match -->
    <page-redirect type="always" path="/?tab=one"></page-redirect>
</page-route>

<!-- nest routes to create complex sitemap
    by allowing path to not be matched exactly (default) -->
<page-route path="/todos" exact="false">
    <!-- child routes are aware of their parent routes
        no matter where they are rendered
        and will always extend their parent paths -->
    <page-route src="./pages/todos.js"></page-route>
    
    <!-- use pathname params to specify variables in the pathname -->
    <page-route path="/:todoId" src="./pages/todo-item.js"></page-route>
</page-route>

<!-- load content from text, HTML, or JavaScript files -->
<page-route path="/contact" src="./pages/contact.js"></page-route>

<page-route path="/404"> 404 - Page not found! </page-route>

<!-- force redirect when pathnames are unknown -->
<page-redirect path="/404" title="404 - Page not found!"></page-redirect>
```

## Features

-   **🌐 History & Hash Routing** - Support for both history API and hash-based routing
-   **🛡️ Route Guards** - Protect routes with authentication or permission checks (sync/async)
-   **⚡ Component Prop** - Use explicit imports for build-time optimization and type safety
-   **📦 Module Registry** - Register modules for bundler optimization (Vite, Webpack, etc.)
-   **🏷️ Route Metadata** - Attach metadata to routes (titles, breadcrumbs, permissions, custom data)
-   **✨ Active Route Detection** - Automatic active state for navigation links
-   **🎨 Markup Integration** - Seamless integration with Markup templates
-   **🔀 Nested Routes** - Full support for nested routing with path inheritance
-   **🔍 Path Parameters** - Dynamic route parameters with easy access via `page-data`
-   **🎯 Exact & Fuzzy Matching** - Control route matching behavior
-   **📡 Dynamic Loading** - Load route content from JavaScript, HTML, or text files
-   **🚀 No-JavaScript Routing** - Define complete routing with just HTML tags

## Table of Contents

-   [Installation](#installation)
-   [Quick Start](#quick-start)
-   [Core Concepts](#core-concepts)
    -   [Web Components](#web-components)
    -   [Routing APIs](#routing-apis)
-   [Advanced Features](#advanced-features)
    -   [Hash Routing](#hash-routing)
    -   [Route Guards](#route-guards)
    -   [Component Prop](#component-prop-build-friendly)
    -   [Module Registry](#module-registry-build-optimization)
    -   [Route Metadata](#route-metadata)
-   [Examples](#examples)

## Quick Start

```html
<!doctype html>
<html>
    <head>
        <script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>
        <script src="https://unpkg.com/@beforesemicolon/router/dist/client.js"></script>
    </head>
    <body>
        <nav>
            <page-link path="/">Home</page-link>
            <page-link path="/about">About</page-link>
            <page-link path="/contact">Contact</page-link>
        </nav>

        <page-route path="/">
            <h1>Welcome Home!</h1>
        </page-route>

        <page-route path="/about">
            <h1>About Us</h1>
        </page-route>

        <page-route path="/contact" src="./pages/contact.js"></page-route>

        <page-route path="/404">
            <h1>404 - Page Not Found</h1>
        </page-route>

        <page-redirect path="/404"></page-redirect>
    </body>
</html>
```

## Core Concepts

### Web Components

The router provides five web components:

#### `<page-route>`

Renders content based on URL pathname:

```html
<!-- Static content -->
<page-route path="/">Home Page</page-route>

<!-- With path parameters -->
<page-route path="/users/:userId">
    User ID: <page-data param="userId"></page-data>
</page-route>

<!-- Load from file -->
<page-route path="/about" src="./pages/about.js"></page-route>

<!-- Nested routes (non-exact matching) -->
<page-route path="/blog" exact="false">
    <page-route path="/recent">Recent Posts</page-route>
    <page-route path="/:slug">
        <page-data param="slug"></page-data>
    </page-route>
</page-route>
```

#### `<page-link>`

Navigation links with automatic active state:

```html
<!-- Basic link -->
<page-link path="/about">About</page-link>

<!-- With search params -->
<page-link path="/products" search="category=electronics"
    >Electronics</page-link
>

<!-- Keep existing search params -->
<page-link search="tab=profile" keep-current-search="true">Profile</page-link>

<!-- Pass data to next page -->
<page-link path="/user/123" payload='{"name": "John"}'>View User</page-link>

<!-- Use current pathname with ~ -->
<page-link path="~/settings">Settings</page-link>

<!-- Use parent route path with $ -->
<page-route path="/dashboard" exact="false">
    <page-link path="$/overview">Overview</page-link>
    <!-- Will navigate to /dashboard/overview -->
</page-route>
```

#### `<page-redirect>`

Automatic redirection for unknown or specific routes:

```html
<!-- Redirect unknown routes to 404 -->
<page-route path="/404">Not Found</page-route>
<page-redirect path="/404"></page-redirect>

<!-- Always redirect to default child route -->
<page-route path="/dashboard" exact="false">
    <page-route path="/home">Dashboard Home</page-route>
    <page-redirect path="$/home" type="always"></page-redirect>
</page-route>
```

#### `<page-route-query>`

Render content based on URL search parameters:

```html
<div class="tabs">
    <page-link search="tab=profile">Profile</page-link>
    <page-link search="tab=settings">Settings</page-link>

    <page-route-query key="tab" value="profile">
        Profile Content
    </page-route-query>

    <page-route-query key="tab" value="settings">
        Settings Content
    </page-route-query>
</div>
```

#### `<page-data>`

Display route data, params, or search params:

```html
<!-- Display path parameter -->
<page-data param="userId">Unknown</page-data>

<!-- Display search parameter -->
<page-data search-param="category">All</page-data>

<!-- Display page state data -->
<page-data key="user.name">Guest</page-data>
```

### Routing APIs

```javascript
import {
    goToPage,
    replacePage,
    previousPage,
    nextPage,
    onPageChange,
    isOnPage,
    getPageParams,
    getSearchParams,
    getPageData,
    updateSearchQuery,
    registerRoute,
    isRegisteredRoute,
    parsePathname,
} from '@beforesemicolon/router'

// Navigate to a new page
await goToPage('/users/123', { user: { name: 'John' } }, 'User Profile')

// Replace current page (no history entry)
await replacePage('/users/123/edit')

// Browser navigation
previousPage() // Go back
nextPage() // Go forward

// Subscribe to route changes
const unsubscribe = onPageChange((pathname, searchParams, pageData) => {
    console.log('Route changed:', pathname)
})

// Check if on a specific page
if (isOnPage('/users', false)) {
    // false = fuzzy match
    console.log('On users section')
}

// Get route data
const params = getPageParams() // { userId: '123' }
const search = getSearchParams() // { tab: 'profile' }
const data = getPageData() // { user: { name: 'John' } }

// Update search params without navigation
updateSearchQuery({ tab: 'settings', filter: 'active' })
```

## Advanced Features

### Hash Routing

The router supports both history API and hash-based routing:

```javascript
import { setRoutingMode, getRoutingMode } from '@beforesemicolon/router'

// Enable hash routing (#/team, #/customers)
setRoutingMode('hash')

// Check current mode
console.log(getRoutingMode()) // 'hash' or 'history'

// Use history routing (default)
setRoutingMode('history')
```

**Benefits of hash routing:**

-   Works without server configuration
-   Perfect for static hosting (GitHub Pages, Netlify, etc.)
-   Backward compatibility with older browsers
-   No server-side routing needed

With hash routing, all navigation uses hash paths:

```html
<page-link path="/team">Team</page-link>
<!-- Renders as: <a href="#/team">Team</a> -->

<page-route path="/team">Team Content</page-route>
<!-- Matches when location.hash is #/team -->
```

### Component Prop (Build-Friendly)

Use the `component` prop for explicit imports that work perfectly with modern bundlers and TypeScript:

```typescript
import { html } from '@beforesemicolon/web-component'
import { TeamPage } from './pages/team/TeamPage'
import { CustomersPage } from './pages/customers/CustomersPage'

// Direct component references
html`
    <page-route path="/team" component="${TeamPage}"></page-route>
    <page-route path="/customers" component="${CustomersPage}"></page-route>
`
```

**Benefits:**

-   ✅ **TypeScript type checking** - Catch errors at compile time
-   ✅ **Code splitting** - Automatic chunking by bundlers
-   ✅ **Tree shaking** - Remove unused code
-   ✅ **Build-time optimization** - Bundler knows about dependencies
-   ✅ **Fast HMR** - Hot module replacement in development
-   ✅ **Import analysis** - Static analysis tools work correctly

**Component format:**

Components can export:

```typescript
// 1. HTML string
export default `<h1>Welcome</h1>`

// 2. Markup template
import { html } from '@beforesemicolon/web-component'
export default html`<h1>Welcome ${userName}</h1>`

// 3. DOM Node
const div = document.createElement('div')
div.textContent = 'Welcome'
export default div

// 4. Function (receives route context)
export default (pageData, pathParams, searchParams) => {
    return html`
        <h1>Welcome ${pageData.user?.name}</h1>
        <p>User ID: ${pathParams.userId}</p>
        <p>Tab: ${searchParams.tab}</p>
    `
}
```

### Route Guards

Protect routes with guards that can redirect or block navigation. Guards are perfect for:

-   Authentication checks
-   Authorization/permissions
-   Data validation
-   Conditional redirects
-   Analytics and tracking

```typescript
import {
    registerRouteGuard,
    registerGlobalGuard,
} from '@beforesemicolon/router'
import { isAuthenticated, hasPermission } from './auth'

// Global guard runs for ALL routes
registerGlobalGuard(async (pathname, query, data) => {
    // Check authentication
    if (!(await isAuthenticated()) && pathname !== '/login') {
        return '/login' // Redirect to login
    }
    return true // Allow navigation
})

// Route-specific guard
registerRouteGuard('/admin', async (pathname, query, data) => {
    // Check permissions
    if (!(await hasPermission('admin'))) {
        return '/unauthorized' // Redirect
    }
    return true // Allow
})

// Multiple guards for same route
registerRouteGuard('/dashboard', (pathname) => {
    // Track page views
    analytics.track('page_view', { path: pathname })
    return true
})

// Guards receive full route context
registerRouteGuard('/users/:userId', (pathname, query, data) => {
    const params = getPageParams()
    if (!isValidUserId(params.userId)) {
        return '/404'
    }
    return true
})
```

**Guard return values:**

-   `true` - Allow navigation
-   `false` - Block navigation (stay on current page)
-   `string` - Redirect to that pathname
-   `Promise<boolean | string>` - Full async support

**Execution order:**

1. Global guards (in registration order)
2. Route-specific guards (in registration order)
3. First guard that blocks or redirects stops execution

### Module Registry (Build Optimization)

Register modules for build-time optimization with any bundler. This allows the bundler to analyze dependencies and optimize the bundle while still using the convenient `src` attribute:

```typescript
import { registerRouteModules } from '@beforesemicolon/router'

// With Vite - use import.meta.glob
const modules = import.meta.glob('./pages/**/*.{ts,js}', { eager: false })
registerRouteModules(modules)

// With Webpack - use require.context
const context = require.context('./pages', true, /\.(ts|js)$/)
const moduleMap = {}
context.keys().forEach((key) => {
    moduleMap[key] = () => context(key)
})
registerRouteModules(moduleMap)

// With other bundlers - manual registration
registerRouteModules({
    './pages/home.ts': () => import('./pages/home'),
    './pages/about.ts': () => import('./pages/about'),
    './pages/contact.ts': () => import('./pages/contact'),
})
```

**Then use the `src` attribute as normal:**

```html
<page-route path="/team" src="./pages/team.ts"></page-route>
<page-route path="/customers" src="./pages/customers.ts"></page-route>
```

**How it works:**

1. Router checks if module is registered
2. If registered, uses the provided loader function
3. If not registered, falls back to dynamic `import()`
4. Module is loaded once and cached

**Benefits:**

-   ✅ Bundler can analyze all dependencies
-   ✅ Better code splitting decisions
-   ✅ Proper source maps
-   ✅ Faster builds
-   ✅ Works with any bundler
-   ✅ Fallback to dynamic import if not registered

### Route Metadata

Attach metadata to routes for titles, breadcrumbs, permissions, or any custom data. Perfect for:

-   Page titles and SEO
-   Breadcrumb navigation
-   Permission checks
-   Analytics tags
-   Layout configuration
-   Custom route properties

```typescript
import {
    registerRoute,
    getRouteMeta,
    onPageChange,
} from '@beforesemicolon/router'

// Register routes with metadata
registerRoute('/dashboard', {
    exact: true,
    meta: {
        title: 'Dashboard',
        breadcrumb: 'Home > Dashboard',
        requiresAuth: true,
        layout: 'admin',
        icon: 'dashboard',
    },
})

registerRoute('/dashboard/users', {
    exact: true,
    meta: {
        title: 'User Management',
        breadcrumb: 'Home > Dashboard > Users',
        requiresAuth: true,
        requiredRole: 'admin',
        permissions: ['users:read', 'users:write'],
    },
})

// Access metadata
const meta = getRouteMeta('/dashboard')
console.log(meta?.title) // 'Dashboard'
console.log(meta?.requiresAuth) // true

// Use with page changes to update document title
onPageChange((pathname) => {
    const meta = getRouteMeta(pathname)
    if (meta?.title) {
        document.title = `${meta.title} | My App`
    }
})

// Use with guards for permission checks
registerGlobalGuard((pathname) => {
    const meta = getRouteMeta(pathname)
    if (meta?.requiresAuth && !isAuthenticated()) {
        return '/login'
    }
    if (meta?.requiredRole && !hasRole(meta.requiredRole)) {
        return '/unauthorized'
    }
    return true
})

// Build breadcrumbs from metadata
function getBreadcrumbs(pathname: string) {
    const meta = getRouteMeta(pathname)
    return meta?.breadcrumb?.split(' > ') || []
}
```

## Installation

### via npm

```bash
npm install @beforesemicolon/router
```

### via yarn

```bash
yarn add @beforesemicolon/router
```

### via CDN

```html
<!-- Required: WebComponent Markup library -->
<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>

<!-- Use the latest version -->
<script src="https://unpkg.com/@beforesemicolon/router/dist/client.js"></script>

<!-- Or use a specific version -->
<script src="https://unpkg.com/@beforesemicolon/router@1.2.0/dist/client.js"></script>

<!-- Access APIs via BFS.ROUTER -->
<script>
    const { goToPage, onPageChange, registerRouteGuard } = BFS.ROUTER
</script>
```

### Module Import

```javascript
// Import specific functions
import {
    goToPage,
    onPageChange,
    registerRouteGuard,
    setRoutingMode,
} from '@beforesemicolon/router'

// Web components are auto-registered when imported
import '@beforesemicolon/router'
```

## Examples

### Complete Examples

-   [SPA Example](https://stackblitz.com/edit/vitejs-vite-4jvsfp?file=index.html) - Single Page Application
-   [Documentation Site](https://markup.beforesemicolon.com) - Real-world usage

### Common Patterns

#### Protected Routes with Authentication

```typescript
import { registerGlobalGuard, goToPage } from '@beforesemicolon/router'
import { isAuthenticated } from './auth'

const publicRoutes = ['/login', '/register', '/forgot-password']

registerGlobalGuard((pathname) => {
    if (!publicRoutes.includes(pathname) && !isAuthenticated()) {
        return '/login'
    }
    return true
})
```

#### Dynamic Page Titles

```typescript
import { onPageChange, getRouteMeta } from '@beforesemicolon/router'

onPageChange((pathname) => {
    const meta = getRouteMeta(pathname)
    document.title = meta?.title || 'My App'
})
```

#### Nested Dashboard Routes

```html
<page-route path="/dashboard" exact="false">
    <header>
        <h1>Dashboard</h1>
        <nav>
            <page-link path="$/overview">Overview</page-link>
            <page-link path="$/analytics">Analytics</page-link>
            <page-link path="$/settings">Settings</page-link>
        </nav>
    </header>

    <main>
        <page-route path="/overview"> Overview content... </page-route>

        <page-route path="/analytics"> Analytics content... </page-route>

        <page-route path="/settings"> Settings content... </page-route>
    </main>

    <!-- Default to overview -->
    <page-redirect path="$/overview" type="always"></page-redirect>
</page-route>
```

#### Tabs with URL State

```html
<div class="tabs">
    <div class="tab-nav">
        <page-link search="tab=profile">Profile</page-link>
        <page-link search="tab=security">Security</page-link>
        <page-link search="tab=billing">Billing</page-link>
    </div>

    <div class="tab-content">
        <page-route-query key="tab" value="profile">
            <h2>Profile Settings</h2>
            <!-- Profile content -->
        </page-route-query>

        <page-route-query key="tab" value="security">
            <h2>Security Settings</h2>
            <!-- Security content -->
        </page-route-query>

        <page-route-query key="tab" value="billing">
            <h2>Billing Settings</h2>
            <!-- Billing content -->
        </page-route-query>
    </div>

    <!-- Default to profile tab -->
    <page-redirect path="~" type="always" search="?tab=profile"></page-redirect>
</div>
```

## API Reference

### Navigation Functions

-   `goToPage(pathname, data?, title?)` - Navigate to a new page
-   `replacePage(pathname, data?, title?)` - Replace current page (no history entry)
-   `previousPage()` - Go back in history
-   `nextPage()` - Go forward in history

### Route Information

-   `getPageParams<T>()` - Get current pathname parameters
-   `getSearchParams()` - Get current search parameters as object
-   `getPageData<T>()` - Get current page state data
-   `isOnPage(pathname, exact?)` - Check if on specific page
-   `parsePathname(patternWithParams)` - Fill pattern with current params

### Route Registration

-   `registerRoute(pathname, options?)` - Register a route with metadata
-   `isRegisteredRoute(pathname)` - Check if route is registered
-   `getRouteMeta(pathname)` - Get route metadata

### Guards

-   `registerRouteGuard(pathname, guard)` - Register route-specific guard
-   `registerGlobalGuard(guard)` - Register global guard for all routes

### Routing Mode

-   `setRoutingMode(mode)` - Set routing mode ('history' | 'hash')
-   `getRoutingMode()` - Get current routing mode

### Module Registry

-   `registerRouteModules(modules)` - Register route modules for optimization
-   `getRouteModule(path)` - Get registered module loader

### Search Management

-   `updateSearchQuery(query)` - Update search parameters without navigation

### Events

-   `onPageChange(callback)` - Subscribe to page changes (returns unsubscribe function)

## Browser Support

-   Modern browsers (Chrome, Firefox, Safari, Edge)
-   IE11+ (with polyfills for Web Components)

## Contributing

Contributions are welcome! Please read our [contributing guidelines](https://github.com/beforesemicolon/router/blob/main/CONTRIBUTING.md) first.

## License

BSD-3-Clause License - see [LICENSE](LICENSE) file for details

## Links

-   [Documentation](https://markup.beforesemicolon.com/documentation/capabilities/router)
-   [GitHub Repository](https://github.com/beforesemicolon/router)
-   [npm Package](https://www.npmjs.com/package/@beforesemicolon/router)
-   [Markup Library](https://markup.beforesemicolon.com)
-   [Before Semicolon](https://beforesemicolon.com)

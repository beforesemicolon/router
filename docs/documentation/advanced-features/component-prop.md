---
name: Component Prop
order: 8.5
title: Component Prop - Router by Before Semicolon
description: Learn how to pass component references directly to routes for type safety and bundler compilation.
layout: document
---

## Component Prop

Instead of using the `src` attribute with file path strings, `<page-route>` allows you to pass component constructor/class references directly using the `component` property.

This approach is highly recommended when bundling applications, as it provides compile-time type-checking and robust source mapping.

```typescript
import { html } from '@beforesemicolon/web-component'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'

// Render route tags using Component imports directly
html`
    <page-route path="/" component="${HomePage}"></page-route>
    <page-route path="/about" component="${AboutPage}"></page-route>
`
```

---

### Benefits of the `component` Prop

-   **Type Safety:** TypeScript validates class references at compile-time.
-   **IDE Assistance:** Autocomplete and symbol renaming work natively.
-   **Tree-Shaking:** Static imports allow bundlers to shake out unused code.
-   **HMR Support:** Faster hot-module replacements during development.

---

### Component Formats

The value passed to the `component` property can be:

#### 1. Plain HTML String

```typescript
export default '<h2>Welcome Home</h2>'
```

#### 2. Markup Template Literal

```typescript
import { html } from '@beforesemicolon/web-component'
export default html`<h2>Welcome Home</h2>`
```

#### 3. Native DOM Node

```typescript
const container = document.createElement('div')
container.textContent = 'Welcome Home'
export default container
```

#### 4. Contextual Loader Function

A function that receives navigation data, path params, and search queries, and returns any of the above formats:

```typescript
export default (data, params, query) => {
    return html`
        <h2>Welcome ${data.username}</h2>
        <p>Viewing item ID: ${params.itemId}</p>
        <p>Active filter: ${query.filter}</p>
    `
}
```

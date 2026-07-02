---
name: Page Link
order: 6.3
title: Page Link Component - Router by Before Semicolon
description: Learn how to manage active states, relative path resolution, and pass history payload data using `<page-link>`.
layout: document
---

## `<page-link>`

The `<page-link>` component renders a standard HTML anchor (`<a>`) tag wrapper that intercepts click events, updates browser history, and highlights itself with an `active` attribute when matching the current location.

```html
<page-link path="/dashboard" title="Admin Panel">Go to Dashboard</page-link>
```

---

### Attributes

| Attribute             | Type      | Default      | Description                                                              |
| :-------------------- | :-------- | :----------- | :----------------------------------------------------------------------- |
| `path`                | `string`  | Current Path | The destination pathname (e.g. `/home` or query-relative parameters).    |
| `search`              | `string`  | `undefined`  | Appends or updates search parameters (e.g. `tab=settings`).              |
| `keep-current-search` | `boolean` | `false`      | Retains existing URL search parameters when navigating to a new path.    |
| `exact`               | `boolean` | `true`       | When `true`, links are marked active only on an exact pathname match.    |
| `title`               | `string`  | `undefined`  | The document title to set upon successful navigation.                    |
| `payload`             | `object`  | `{}`         | History state payload. In HTML, provide a JSON-serialized object string. |

---

### Relative Path Resolution

To make page layout structures reusable, `<page-link>` automatically resolves shorthand prefixes:

-   **No `path` attribute:** Evaluates to the current browser pathname. Ideal when you only need to modify query parameters.
    ```html
    <page-link search="filter=completed">Completed Tasks</page-link>
    ```
-   **Dollar Prefix `$`:** Replaced by the path of the closest parent `<page-route>` element in the DOM tree.
    ```html
    <page-route path="/projects/:projectId">
        <!-- Resolves to: /projects/123/edit -->
        <page-link path="$/edit">Edit Project</page-link>
    </page-route>
    ```
-   **Tilde Prefix `~`:** Replaced by the current browser pathname. Useful for appending child sections.
    ```html
    <!-- If current page is /profile -->
    <!-- Resolves to: /profile/settings -->
    <page-link path="~/settings">Settings</page-link>
    ```

---

### Active State Styling

When the browser location matches the link's target, the component gains a native `active` attribute:

```html
<!-- Rendered active HTML element -->
<page-link path="/todos" active>Todos</page-link>
```

You can target this state in CSS using standard attributes or CSS shadow parts:

```css
/* Style the outer custom component element */
page-link[active] {
    font-weight: 700;
}

/* Style the inner anchor tag using shadow parts */
page-link::part(anchor) {
    color: var(--foreground);
    text-decoration: none;
    transition: border-color 0.2s;
}

page-link[active]::part(anchor) {
    border-bottom: 2px solid var(--primary);
    color: var(--primary);
}
```

---

### Passing Payloads

Use `payload` to pass history state data to the next page.

In plain HTML, attributes are strings, so `payload` must be a valid JSON-serialized object:

```html
<page-link path="/dashboard" payload='{"role": "admin", "userId": 42}'>
    Enter Panel
</page-link>
```

When rendering `<page-link>` through Markup, pass the value as an object property:

```javascript
import { html } from '@beforesemicolon/web-component'

const user = { role: 'admin', userId: 42 }

html` <page-link path="/dashboard" payload="${user}"> Enter Panel </page-link> `
```

The payload is available on the destination route through `getPageData()`, `onPage()`, `onPageChange()`, or `<page-data key="...">`.

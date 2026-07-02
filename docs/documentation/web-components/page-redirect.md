---
name: Page Redirect
order: 6.4
title: Page Redirect Component - Router by Before Semicolon
description: Learn how to manage default paths and handle 404 fallbacks using `<page-redirect>`.
layout: document
---

## `<page-redirect>`

The `<page-redirect>` component triggers programmatic redirection. It is used to handle unknown URLs (404 errors) or to route parent index paths to a default sub-route.

```html
<page-redirect path="/dashboard" type="always"></page-redirect>
```

---

### Attributes

| Attribute | Type                      | Default     | Description                                                              |
| :-------- | :------------------------ | :---------- | :----------------------------------------------------------------------- |
| `type`    | `"unknown"` \| `"always"` | `"unknown"` | Condition under which redirection triggers.                              |
| `path`    | `string`                  | `"/"`       | Destination path (supports parent prefixes like `$` and `~`).            |
| `title`   | `string`                  | `undefined` | The document title to set after redirecting.                             |
| `payload` | `object`                  | `{}`        | History state payload. In HTML, provide a JSON-serialized object string. |

---

### Redirection Types

#### 1. `unknown` (Default)

Redirection triggers only when the current browser path is not matched by any registered route. This is primarily used for defining global or local 404 fallbacks:

```html
<!-- Register valid routes first -->
<page-route path="/">Home</page-route>
<page-route path="/about">About</page-route>
<page-route path="/404">Not Found</page-route>

<!-- Redirect any other path to /404 -->
<page-redirect path="/404"></page-redirect>
```

> [!IMPORTANT]
> The order of tags in HTML matters. Make sure to define `<page-redirect>` elements **after** your `<page-route>` tags so all valid routes are registered first.

#### 2. `always`

Redirection triggers immediately when the parent route is matched exactly. This is helpful for assigning a default view or tab when visiting a parent layout:

```html
<page-route path="/projects/:projectId" exact="false">
    <h2>Project Dashboard</h2>

    <div class="sub-tabs">
        <page-link path="$/overview">Overview</page-link>
        <page-link path="$/analytics">Analytics</page-link>
    </div>

    <!-- Sub-Routes -->
    <page-route path="/overview">Overview Content</page-route>
    <page-route path="/analytics">Analytics Content</page-route>

    <!-- Redirects /projects/:projectId directly to /projects/:projectId/overview -->
    <page-redirect path="$/overview" type="always"></page-redirect>
</page-route>
```

---

### Scoped Redirection

Because `<page-redirect>` is aware of its placement in the DOM tree:

-   Placing it inside a parent `<page-route>` means it will only handle redirections for child paths within that route.
-   Unrelated root-level paths will not trigger the child redirect.

```html
<page-route path="/admin" exact="false">
    <h2>Admin Dashboard</h2>

    <page-route path="/settings">Settings</page-route>

    <!-- Redirects /admin/invalid-subpath to /admin/settings -->
    <page-redirect path="$/settings"></page-redirect>
</page-route>
```

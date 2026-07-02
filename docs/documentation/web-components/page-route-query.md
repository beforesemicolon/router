---
name: Page Route Query
order: 6.2
title: Page Route Query Component - Router by Before Semicolon
description: Learn how to render views conditionally based on search queries using `<page-route-query>`.
layout: document
---

## `<page-route-query>`

The `<page-route-query>` component mounts content conditionally based on URL search query parameter values (`?key=value`) instead of the URL pathname.

This component is ideal for creating tabbed navigation, filters, or modular modals without writing JavaScript state logic.

```html
<page-route-query key="modal" value="open">
    <div class="modal-dialog">
        <h3>System Settings</h3>
        <p>Modify application values here...</p>
    </div>
</page-route-query>
```

---

### Attributes

| Attribute | Type     | Default     | Description                                                          |
| :-------- | :------- | :---------- | :------------------------------------------------------------------- |
| `key`     | `string` | `undefined` | The search parameter name to watch (e.g. `"tab"`).                   |
| `value`   | `string` | `undefined` | The exact parameter value that triggers a match.                     |
| `src`     | `string` | `undefined` | Relative path to an external file (HTML, JS, TXT) to load on-demand. |
| `name`    | `string` | `undefined` | Mutually exclusive query-route group identifier.                     |

---

### Example: Tabbed Layout

Combine `<page-route-query>` with `<page-link>` to create fully declarative, active-state-aware tabs:

```html
<div class="tabs-container">
    <!-- 1. Tabs navigation -->
    <div class="tab-headers">
        <page-link search="tab=profile">Profile Settings</page-link>
        <page-link search="tab=security">Security Panel</page-link>
    </div>

    <!-- 2. Conditionally rendered views -->
    <div class="tab-contents">
        <page-route-query key="tab" value="profile" name="settings-tab">
            <h3>Profile Settings</h3>
            <p>Update your display name and email address...</p>
        </page-route-query>

        <page-route-query
            key="tab"
            value="security"
            name="settings-tab"
            src="./tabs/security.html"
        >
            <div slot="loading">Loading security module...</div>
        </page-route-query>
    </div>
</div>
```

---

### Behavior and Caching

-   Just like `<page-route>`, the query matcher detaches template views when the parameter doesn't match and caches them.
-   When the query matches again, the cached template is restored instantly.
-   Loader slots (`loading`) and fallbacks (`fallback`) are fully supported when using the `src` attribute.

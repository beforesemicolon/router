---
name: Page Data
order: 6.5
title: Page Data Component - Router by Before Semicolon
description: Learn how to display pathname params, search query values, and history state payload values in HTML using `<page-data>`.
layout: document
---

## `<page-data>`

The `<page-data>` component allows you to print current routing parameters, search queries, or history state directly in HTML without writing JavaScript selectors.

```html
<p>Viewing user ID: <page-data param="userId">unknown</page-data></p>
```

---

### Attributes

| Attribute      | Type     | Default     | Description                                                                          |
| :------------- | :------- | :---------- | :----------------------------------------------------------------------------------- |
| `param`        | `string` | `undefined` | The name of the path parameter to render (e.g. `userId` from `/users/:userId`).      |
| `search-param` | `string` | `undefined` | The name of the URL query parameter to render (e.g. `filter` from `?filter=active`). |
| `key`          | `string` | `undefined` | The dot-notation key path to display from the history state payload.                 |

---

### Fallback Values

Any content wrapped between `<page-data>` tags is treated as a default fallback value. It is rendered only if the requested property is `undefined` or unavailable:

```html
<!-- Renders: "Guest" if role is empty -->
<p>Role: <page-data key="role">Guest</page-data></p>
```

---

### Deep Key Resolution

When passing complex history payloads via `<page-link>`, use dot-notation in the `key` attribute to traverse nested objects:

```html
<!-- Navigation link -->
<page-link path="/dashboard" payload='{"user": {"profile": {"name": "Elson"}}}'>
    Dashboard
</page-link>

<!-- Extraction -->
<h3>Welcome, <page-data key="user.profile.name">Guest</page-data></h3>
```

---
name: "{{t.common.pageTitles.routeMetadata}}"
order: 8.4
title: "{{t.pages.documentation.advanced_features.route_metadata.meta.route_metadata_router_by_before_semicolon}}"
description: "{{t.pages.documentation.advanced_features.route_metadata.meta.learn_how_to_attach_permissions_layouts_or_custom_page_properties}}"
layout: document
---

## {{t.common.pageTitles.routeMetadata}}

{{t.pages.documentation.advanced_features.route_metadata.content.you_can_attach_custom_metadata_such_as_page_layouts_breadcrumbs}}

{{t.pages.documentation.advanced_features.route_metadata.content.metadata_is_stored_by_the_registered_route_pattern_use_the}}

---

### {{t.pages.documentation.advanced_features.route_metadata.content.attaching_metadata}}

{{t.pages.documentation.advanced_features.route_metadata.content.pass_metadata_inside_the_options_configuration_of_registerroute}}

```javascript
import { registerRoute } from '@beforesemicolon/router'

registerRoute('/admin/:section', {
    exact: true,
    meta: {
        title: 'Admin Console',
        requiresAuth: true,
        allowedRoles: ['admin', 'moderator'],
        breadcrumb: 'Home > Admin > Dashboard',
    },
})
```

---

### {{t.pages.documentation.advanced_features.route_metadata.content.retrieving_metadata_getroutemeta}}

{{t.pages.documentation.advanced_features.route_metadata.content.retrieves_the_metadata_object_associated_with_a_registered_path_pattern}}

```typescript
function getRouteMeta(pattern: string): RouteMeta | undefined
```

#### {{t.common.labels.example}}

```javascript
import { getRouteMeta } from '@beforesemicolon/router'

const meta = getRouteMeta('/admin/:section')
console.log(meta.title) // "Admin Console"
console.log(meta.requiresAuth) // true
```

---

### {{t.pages.documentation.advanced_features.route_metadata.content.common_use_cases}}

#### {{t.pages.documentation.advanced_features.route_metadata.content.text_1_dynamic_document_titles}}

{{t.pages.documentation.advanced_features.route_metadata.content.update_the_browser_document_title_dynamically_upon_page_transitions}}

```javascript
import { onPage, getRouteMeta } from '@beforesemicolon/router'

onPage('/admin/:section', (active) => {
    if (active) {
        const meta = getRouteMeta('/admin/:section')
        document.title = meta?.title
            ? `${meta.title} | My App`
            : 'Admin | My App'
    }
})
```

#### {{t.pages.documentation.advanced_features.route_metadata.content.text_2_guarding_permissions}}

{{t.pages.documentation.advanced_features.route_metadata.content.check_permissions_dynamically_inside_a_route_guard}}

```javascript
import { registerRouteGuard, getRouteMeta } from '@beforesemicolon/router'

registerRouteGuard('/admin/:section', () => {
    const meta = getRouteMeta('/admin/:section')

    if (meta?.requiresAuth && !userIsLoggedIn()) {
        return '/login' // Redirect
    }

    if (meta?.allowedRoles && !userHasRoles(meta.allowedRoles)) {
        return '/unauthorized' // Redirect
    }

    return true // Allow
})
```

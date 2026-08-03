---
name: "{{t.common.pageTitles.routeGuards}}"
order: 8.1
title: "{{t.pages.documentation.advanced_features.route_guards.meta.route_guards_router_by_before_semicolon}}"
description: "{{t.pages.documentation.advanced_features.route_guards.meta.learn_how_to_secure_paths_and_perform_checks_before_transitioning}}"
layout: document
---

## {{t.common.pageTitles.routeGuards}}

{{t.pages.documentation.advanced_features.route_guards.content.route_guards_allow_you_to_protect_routes_with_authentication_checks}}

{{t.pages.documentation.advanced_features.route_guards.content.guards_can_block_navigation_entirely_or_redirect_the_user_to}}

---

### {{t.pages.documentation.advanced_features.route_guards.content.guard_return_values}}

{{t.pages.documentation.advanced_features.route_guards.content.a_guard_function_can_return}}

-   {{t.pages.documentation.advanced_features.route_guards.content.true_allow_the_navigation}}
-   {{t.pages.documentation.advanced_features.route_guards.content.false_block_the_navigation_remains_on_the_current_page}}
-   {{t.pages.documentation.advanced_features.route_guards.content.string_redirects_the_user_to_the_specified_path_string}}
-   {{t.pages.documentation.advanced_features.route_guards.content.promise_async_checks_e_g_database_fetches_are_fully_supported}}

---

### {{t.pages.documentation.advanced_features.route_guards.content.global_guards}}

{{t.pages.documentation.advanced_features.route_guards.content.global_guards_execute_on_every_navigation_event_before_any_route}}

```typescript
function registerGlobalGuard(
    guard: (
        pathname: string,
        query: Record<string, unknown>,
        data: Record<string, unknown>
    ) => boolean | string | Promise<boolean | string>
): void
```

#### {{t.common.labels.example}}

```javascript
import { registerGlobalGuard } from '@beforesemicolon/router'

// Authentication guard
registerGlobalGuard((pathname, query, state) => {
    const publicPages = ['/login', '/register', '/404']

    if (!publicPages.includes(pathname) && !userIsLoggedIn()) {
        return '/login' // Redirect to login
    }

    return true // Allow navigation
})
```

---

### {{t.pages.documentation.advanced_features.route_guards.content.route_specific_guards}}

{{t.pages.documentation.advanced_features.route_guards.content.route_specific_guards_run_only_when_navigating_to_a_path}}

```typescript
function registerRouteGuard(
    pattern: string,
    guard: (
        pathname: string,
        query: Record<string, unknown>,
        data: Record<string, unknown>
    ) => boolean | string | Promise<boolean | string>
): void
```

#### {{t.common.labels.example}}

```javascript
import { registerRouteGuard } from '@beforesemicolon/router'

// Role-based authorization guard (Async)
registerRouteGuard('/admin/:section', async (pathname, query, state) => {
    try {
        const hasAccess = await checkAdminPermissions()
        return hasAccess ? true : '/unauthorized'
    } catch {
        return false // Block navigation on error
    }
})
```

---

### {{t.pages.documentation.advanced_features.route_guards.content.guard_execution_order}}

1. {{t.pages.documentation.advanced_features.route_guards.content.global_guards_executed_in_the_order_they_were_registered}}
2. {{t.pages.documentation.advanced_features.route_guards.content.route_specific_guards_executed_in_the_order_they_were_registered}}
3. {{t.pages.documentation.advanced_features.route_guards.content.the_first_guard_that_returns_false_or_a_redirect_string}}

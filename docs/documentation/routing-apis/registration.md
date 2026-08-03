---
name: "{{t.pages.documentation.routing_apis.registration.meta.route_registration}}"
order: 7.4
title: "{{t.pages.documentation.routing_apis.registration.meta.route_registration_apis_router_by_before_semicolon}}"
description: "{{t.pages.documentation.routing_apis.registration.meta.learn_how_to_register_pathname_patterns_and_compile_paths_using}}"
layout: document
---

## {{t.pages.documentation.routing_apis.registration.content.route_registration_apis}}

{{t.pages.documentation.routing_apis.registration.content.these_utilities_allow_you_to_manage_registered_route_patterns_and}}

---

### `registerRoute`

{{t.pages.documentation.routing_apis.registration.content.manually_registers_a_route_pattern_with_the_central_matching_engine}}

```typescript
interface RegisterRouteOptions {
    exact?: boolean
    meta?: Record<string, unknown>
    name?: string
}

function registerRoute(
    pattern: string,
    options?: RegisterRouteOptions | boolean
): void
```

-   {{t.pages.documentation.routing_apis.registration.content.if_a_boolean_is_passed_as_the_second_argument_it}}

#### {{t.common.labels.example}}

```javascript
import { registerRoute } from '@beforesemicolon/router'

registerRoute('/dashboard')
registerRoute('/admin', { exact: false })
registerRoute('/users/:userId', {
    exact: true,
    name: 'user-routes',
    meta: { title: 'User Details', requiresAuth: true },
})
```

---

### `isRegisteredRoute`

{{t.pages.documentation.routing_apis.registration.content.checks_whether_a_concrete_pathname_matches_any_registered_route_pattern}}

```typescript
function isRegisteredRoute(pathname: string): boolean
```

#### {{t.common.labels.example}}

```javascript
import { isRegisteredRoute } from '@beforesemicolon/router'

isRegisteredRoute('/dashboard') // true
isRegisteredRoute('/users/42') // true, when /users/:userId is registered
isRegisteredRoute('/invalid-path') // false
```

---

### `parsePathname`

{{t.pages.documentation.routing_apis.registration.content.takes_a_path_pattern_containing_parameters_and_compiles_it_into}}

```typescript
function parsePathname(pattern: string): string
```

#### {{t.common.labels.example}}

```javascript
// Browser location is: /users/42
// Current parameters: { userId: '42' }

import { parsePathname } from '@beforesemicolon/router'

const path = parsePathname('/users/:userId/details')
// Returns: "/users/42/details"
```

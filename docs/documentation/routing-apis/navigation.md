---
name: "{{t.common.pageTitles.navigationApis}}"
order: 7.1
title: "{{t.pages.documentation.routing_apis.navigation.meta.programmatic_navigation_router_by_before_semicolon}}"
description: "{{t.pages.documentation.routing_apis.navigation.meta.learn_how_to_transition_paths_pass_payloads_and_go_back}}"
layout: document
---

## {{t.common.pageTitles.navigationApis}}

{{t.pages.documentation.routing_apis.navigation.content.these_functions_trigger_state_updates_in_the_browser_s_history}}

---

### `goToPage`

{{t.pages.documentation.routing_apis.navigation.content.adds_a_new_entry_to_the_browser_s_history_stack}}

```typescript
function goToPage(
    pathname: string,
    pageData: Record<string, unknown> = {},
    title: string = document.title
): Promise<void>
```

#### {{t.common.labels.example}}

```javascript
import { goToPage } from '@beforesemicolon/router'

await goToPage(
    '/users/42',
    { role: 'admin', scrollPosition: 0 },
    'User Profile'
)
```

---

### `replacePage`

{{t.pages.documentation.routing_apis.navigation.content.updates_the_current_entry_in_the_history_stack_instead_of}}

```typescript
function replacePage(
    pathname: string,
    pageData: Record<string, unknown> = {},
    title: string = document.title
): Promise<void>
```

#### {{t.common.labels.example}}

```javascript
import { replacePage } from '@beforesemicolon/router'

if (!isAuthenticated) {
    await replacePage('/login', { from: '/dashboard' }, 'Please Login')
}
```

---

### `previousPage`

{{t.pages.documentation.routing_apis.navigation.content.navigates_back_to_the_previous_entry_in_the_browser_session}}

```typescript
function previousPage(): void
```

---

### `nextPage`

{{t.pages.documentation.routing_apis.navigation.content.navigates_forward_to_the_next_entry_in_the_browser_session}}

```typescript
function nextPage(): void
```

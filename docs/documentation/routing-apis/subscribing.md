---
name: "{{t.common.pageTitles.subscribingApis}}"
order: 7.2
title: "{{t.pages.documentation.routing_apis.subscribing.meta.subscription_observers_router_by_before_semicolon}}"
description: "{{t.pages.documentation.routing_apis.subscribing.meta.learn_how_to_observe_route_patterns_or_listen_to_global}}"
layout: document
---

## {{t.common.pageTitles.subscribingApis}}

{{t.pages.documentation.routing_apis.subscribing.content.these_apis_notify_your_javascript_code_when_url_modifications_or}}

---

### `onPage`

{{t.pages.documentation.routing_apis.subscribing.content.subscribes_to_a_specific_route_pattern_the_callback_triggers_whenever}}

```typescript
function onPage(
    pattern: string,
    callback: (active: boolean, location: PageLocation) => void,
    exact: boolean = true,
    matchGroup?: string
): () => void
```

-   {{t.common.messages.unsubscribeCleanup}}
-   {{t.pages.documentation.routing_apis.subscribing.content.active_true_if_the_current_location_matches_the_pattern}}
-   {{t.pages.documentation.routing_apis.subscribing.content.location_object_containing_pathname_query_search_params_data_history_state}}

#### {{t.common.labels.example}}

```javascript
import { onPage } from '@beforesemicolon/router'

const unsubscribe = onPage('/users/:userId', (active, location) => {
    if (active) {
        console.log(`Now viewing user: ${location.params.userId}`)
        console.log('State payload:', location.data)
    } else {
        console.log('Navigated away from user profile')
    }
})

// Later: clean up listener
// unsubscribe();
```

{{t.pages.documentation.routing_apis.subscribing.content.use_exact_false_to_subscribe_to_a_layout_path_and}}

```javascript
onPage(
    '/docs',
    (active) => {
        docsShell.hidden = !active
    },
    false
)
```

---

### `onPageChange`

{{t.pages.documentation.routing_apis.subscribing.content.subscribes_to_all_global_location_transitions_triggered_after_any_navigation}}

```typescript
type PageChangeCallback = (
    pathname: string,
    searchParams: Record<string, string>,
    pageData: Record<string, unknown>
) => void

function onPageChange(callback: PageChangeCallback): () => void
```

-   {{t.common.messages.unsubscribeCleanup}}

#### {{t.common.labels.example}}

```javascript
import { onPageChange } from '@beforesemicolon/router'

onPageChange((pathname, query, state) => {
    // Send analytics view event
    trackPageView(pathname)
})
```

---

### `isOnPage`

{{t.pages.documentation.routing_apis.subscribing.content.helper_to_verify_if_a_specific_path_matches_the_current}}

```typescript
function isOnPage(pathname: string, exact: boolean = true): boolean
```

-   {{t.pages.documentation.routing_apis.subscribing.content.exact_if_false_evaluates_to_true_if_the_browser_location}}

#### {{t.pages.documentation.routing_apis.subscribing.content.examples}}

```javascript
// Browser is at: /todos/123?filter=all

isOnPage('/todos') // false (not exact)
isOnPage('/todos', false) // true  (subpath match)
isOnPage('/todos/123') // true  (exact path match)
isOnPage('/todos/123?filter=all') // true  (exact match including queries)
```

> [!NOTE]
> {{t.pages.documentation.routing_apis.subscribing.content.search_query_matches_inside_isonpage_are_order_sensitive_parameters_must}}

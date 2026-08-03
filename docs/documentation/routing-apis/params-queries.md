---
name: "{{t.pages.documentation.routing_apis.params_queries.meta.params_queries}}"
order: 7.3
title: "{{t.pages.documentation.routing_apis.params_queries.meta.params_queries_apis_router_by_before_semicolon}}"
description: "{{t.pages.documentation.routing_apis.params_queries.meta.learn_how_to_retrieve_pathname_parameters_read_search_queries_and}}"
layout: document
---

## {{t.pages.documentation.routing_apis.params_queries.content.params_queries_apis}}

{{t.pages.documentation.routing_apis.params_queries.content.these_functions_allow_you_to_read_and_write_parameters_or}}

---

### `getPageParams`

{{t.pages.documentation.routing_apis.params_queries.content.retrieves_an_object_containing_all_parameters_parsed_from_the_current}}

```typescript
function getPageParams<T extends Record<string, string>>(): T
```

#### {{t.common.labels.example}}

```javascript
// Browser location: /projects/marketing/dashboard
// Route pattern: /projects/:category/:tab

import { getPageParams } from '@beforesemicolon/router'

const params = getPageParams()
// Returns: { category: 'marketing', tab: 'dashboard' }
```

---

### `getSearchParams`

{{t.pages.documentation.routing_apis.params_queries.content.retrieves_parsed_url_query_parameters_as_a_key_value_object}}

```typescript
function getSearchParams<T extends Record<string, string>>(): T
```

#### {{t.common.labels.example}}

```javascript
// Browser location: /search?query=hello&tags=%5B%22js%22%2C%22web%22%5D

import { getSearchParams } from '@beforesemicolon/router'

const query = getSearchParams()
// Returns: { query: 'hello', tags: ['js', 'web'] }
```

---

### `updateSearchQuery`

{{t.pages.documentation.routing_apis.params_queries.content.updates_or_clears_url_search_parameters_updates_are_made_in}}

```typescript
function updateSearchQuery(searchObject: Record<string, unknown> | null): void
```

-   {{t.pages.documentation.routing_apis.params_queries.content.pass_null_to_clear_all_query_parameters_from_the_url}}

#### {{t.common.labels.example}}

```javascript
import { updateSearchQuery } from '@beforesemicolon/router'

// Add page parameters to current URL
updateSearchQuery({ page: 2, filter: 'active' })
// Browser updates to: ?page=2&filter=active

// Clear queries
updateSearchQuery(null)
// Browser updates to: (query parameters removed)
```

---

### `getPageData`

{{t.pages.documentation.routing_apis.params_queries.content.retrieves_the_current_history_state_payload_object}}

```typescript
function getPageData<T extends Record<string, unknown>>(): T
```

#### {{t.common.labels.example}}

```javascript
import { getPageData } from '@beforesemicolon/router'

const data = getPageData()
console.log('User Role:', data.role)
```

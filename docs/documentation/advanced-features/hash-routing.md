---
name: "{{t.common.pageTitles.hashRouting}}"
order: 8.2
title: "{{t.pages.documentation.advanced_features.hash_routing.meta.hash_routing_router_by_before_semicolon}}"
description: "{{t.pages.documentation.advanced_features.hash_routing.meta.learn_how_to_set_up_url_hash_based_routing_path}}"
layout: document
---

## {{t.common.pageTitles.hashRouting}}

{{t.pages.documentation.advanced_features.hash_routing.content.the_router_supports_both_standard_html5_history_api_routing_pathnames}}

{{t.pages.documentation.advanced_features.hash_routing.content.hash_routing_is_perfect_for_static_file_hosting_environments_like}}

---

### `setRoutingMode`

{{t.pages.documentation.advanced_features.hash_routing.content.configures_the_router_s_active_mode_accepts_history_default_or}}

```typescript
function setRoutingMode(mode: 'history' | 'hash'): void
```

#### {{t.common.labels.example}}

```javascript
import { setRoutingMode } from '@beforesemicolon/router'

// Enable Hash Routing
setRoutingMode('hash')

// URLs will now format as: domain.com/#/dashboard
// <page-link path="/todos"> renders as: <a href="#/todos">
```

---

### `getRoutingMode`

{{t.pages.documentation.advanced_features.hash_routing.content.retrieves_the_currently_active_routing_mode}}

```typescript
function getRoutingMode(): 'history' | 'hash'
```

#### {{t.common.labels.example}}

```javascript
import { getRoutingMode } from '@beforesemicolon/router'

const mode = getRoutingMode() // "history" or "hash"
```

---

### {{t.pages.documentation.advanced_features.hash_routing.content.benefits_of_hash_routing}}

-   {{t.pages.documentation.advanced_features.hash_routing.content.zero_server_config_standard_servers_return_a_404_error_when}}
-   {{t.pages.documentation.advanced_features.hash_routing.content.static_hosting_highly_compatible_with_static_environments_like_aws_s3}}
-   {{t.pages.documentation.advanced_features.hash_routing.content.legacy_compatibility_works_flawlessly_in_older_web_browser_engines}}

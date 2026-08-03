---
name: "{{t.common.pageTitles.aiGuide}}"
order: 5
title: "{{t.pages.documentation.ai.meta.ai_guide_for_before_semicolon_router}}"
description: "{{t.pages.documentation.ai.meta.a_compact_reference_for_ai_assistants_and_developers_generating_router}}"
layout: document
---

## {{t.common.pageTitles.aiGuide}}

{{t.pages.documentation.ai.content.use_this_page_as_the_compact_reference_when_generating_examples}}

## {{t.pages.documentation.ai.content.package_purpose}}

{{t.pages.documentation.ai.content.beforesemicolon_router_is_an_html_first_routing_library_built_with}}

## {{t.pages.documentation.ai.content.required_imports}}

{{t.pages.documentation.ai.content.for_bundled_apps}}

```javascript
import '@beforesemicolon/router'
```

{{t.pages.documentation.ai.content.when_using_exported_apis}}

```javascript
import {
    goToPage,
    onPage,
    onPageChange,
    registerGlobalGuard,
    registerRouteGuard,
    registerRouteModules,
    updateSearchQuery,
} from '@beforesemicolon/router'
```

{{t.pages.documentation.ai.content.for_direct_browser_use_load_web_component_first}}

```html
<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>
<script src="https://unpkg.com/@beforesemicolon/router/dist/client.js"></script>
```

{{t.pages.documentation.ai.content.cdn_apis_are_available_at_bfs_router}}

## {{t.pages.documentation.ai.content.custom_elements}}

{{t.pages.documentation.ai.content.use_these_elements_exactly}}

```html
<page-link path="/docs" title="Docs">Docs</page-link>
<page-route path="/docs" src="./pages/docs.html"></page-route>
<page-route-query key="tab" value="api">API tab</page-route-query>
<page-redirect path="/404"></page-redirect>
<page-data param="id">fallback</page-data>
```

## {{t.pages.documentation.ai.content.route_patterns}}

{{t.pages.documentation.ai.content.use_name_for_dynamic_params}}

```html
<page-route path="/users/:userId">
    User <page-data param="userId">unknown</page-data>
</page-route>
```

{{t.pages.documentation.ai.content.set_exact_false_for_layout_routes_that_should_remain_active}}

```html
<page-route path="/docs" exact="false">
    <page-route path="/intro">Intro</page-route>
    <page-route path="/api">API</page-route>
</page-route>
```

## {{t.pages.documentation.ai.content.link_rules}}

{{t.pages.documentation.ai.content.use_path_for_path_navigation_and_search_for_query_updates}}

```html
<page-link path="/projects">Projects</page-link>
<page-link search="view=grid" keep-current-search>Grid</page-link>
```

{{t.pages.documentation.ai.content.use_inside_a_nested_route_to_reference_the_closest_parent}}

```html
<page-route path="/projects/:projectId" exact="false">
    <page-link path="$/settings">Settings</page-link>
</page-route>
```

{{t.pages.documentation.ai.content.use_to_reference_the_current_browser_pathname}}

```html
<page-link path="~/edit">Edit current page</page-link>
```

## {{t.pages.documentation.ai.content.lazy_route_content}}

{{t.pages.documentation.ai.content.src_can_load_html_text_or_javascript_modules_javascript_modules}}

```javascript
import { html } from '@beforesemicolon/web-component'

export default (data, params, query) => html`
    <h1>Project ${params.projectId}</h1>
    <p>Filter: ${query.filter || 'all'}</p>
    <p>Opened from: ${data.from || 'direct visit'}</p>
`
```

## {{t.pages.documentation.ai.content.programmatic_navigation}}

{{t.pages.documentation.ai.content.gotopage_and_replacepage_are_async_and_accept_an_object_literal}}

```javascript
await goToPage('/users/42', { from: 'search' }, 'User 42')
await replacePage('/login', { reason: 'expired' }, 'Login')
```

## {{t.pages.documentation.ai.content.guards}}

{{t.pages.documentation.ai.content.registerglobalguard_and_registerrouteguard_register_guards_and_do_not_return_cleanup}}

-   {{t.pages.documentation.ai.content.true_to_allow_navigation}}
-   {{t.pages.documentation.ai.content.false_to_block_navigation}}
-   {{t.pages.documentation.ai.content.a_path_string_to_redirect}}
-   {{t.pages.documentation.ai.content.a_promise_resolving_to_one_of_those_values}}

```javascript
registerGlobalGuard((pathname) => {
    if (pathname.startsWith('/account') && !auth.isSignedIn()) {
        return '/login'
    }

    return true
})
```

## {{t.pages.documentation.ai.content.query_data}}

{{t.pages.documentation.ai.content.getsearchparams_parses_search_values_with_the_router_json_parser_values}}

```javascript
updateSearchQuery({ page: 2, tags: ['router', 'web'] })
```

## {{t.pages.documentation.ai.content.avoid_these_mistakes}}

-   {{t.pages.documentation.ai.content.do_not_use_react_router_syntax_such_as_or_usenavigate}}
-   {{t.pages.documentation.ai.content.do_not_claim_route_guard_registration_returns_an_unsubscribe_function}}
-   {{t.pages.documentation.ai.content.do_not_use_href_on_use_path_and_search}}
-   {{t.pages.documentation.ai.content.do_not_use_component_as_a_string_in_html_component}}
-   {{t.pages.documentation.ai.content.do_not_use_route_state_for_permanent_data_prefer_params}}

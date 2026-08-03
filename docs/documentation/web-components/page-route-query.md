---
name: "{{t.pages.documentation.web_components.page_route_query.meta.page_route_query}}"
order: 6.2
title: "{{t.pages.documentation.web_components.page_route_query.meta.page_route_query_component_router_by_before_semicolon}}"
description: "{{t.pages.documentation.web_components.page_route_query.meta.learn_how_to_render_views_conditionally_based_on_search_queries}}"
layout: document
---

## `<page-route-query>`

{{t.pages.documentation.web_components.page_route_query.content.the_component_mounts_content_conditionally_based_on_url_search_query}}

{{t.pages.documentation.web_components.page_route_query.content.this_component_is_ideal_for_creating_tabbed_navigation_filters_or}}

```html
<page-route-query key="modal" value="open">
    <div class="modal-dialog">
        <h3>System Settings</h3>
        <p>Modify application values here...</p>
    </div>
</page-route-query>
```

---

### {{t.common.labels.attributes}}

{{t.pages.documentation.web_components.page_route_query.content.attribute_type_default_description}}
{{t.pages.documentation.web_components.page_route_query.content.line_29}}
{{t.pages.documentation.web_components.page_route_query.content.key_string_undefined_the_search_parameter_name_to_watch_e}}
{{t.pages.documentation.web_components.page_route_query.content.value_string_undefined_the_exact_parameter_value_that_triggers_a}}
{{t.pages.documentation.web_components.page_route_query.content.src_string_undefined_relative_path_to_an_external_file_html}}
{{t.pages.documentation.web_components.page_route_query.content.name_string_undefined_mutually_exclusive_query_route_group_identifier}}

---

### {{t.pages.documentation.web_components.page_route_query.content.example_tabbed_layout}}

{{t.pages.documentation.web_components.page_route_query.content.combine_with_to_create_fully_declarative_active_state_aware_tabs}}

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

### {{t.pages.documentation.web_components.page_route_query.content.behavior_and_caching}}

-   {{t.pages.documentation.web_components.page_route_query.content.just_like_the_query_matcher_detaches_template_views_when_the}}
-   {{t.pages.documentation.web_components.page_route_query.content.when_the_query_matches_again_the_cached_template_is_restored}}
-   {{t.pages.documentation.web_components.page_route_query.content.loader_slots_loading_and_fallbacks_fallback_are_fully_supported_when}}

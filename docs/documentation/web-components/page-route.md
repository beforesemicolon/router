---
name: "{{t.pages.documentation.web_components.page_route.meta.page_route}}"
order: 6.1
title: "{{t.pages.documentation.web_components.page_route.meta.page_route_component_router_by_before_semicolon}}"
description: "{{t.pages.documentation.web_components.page_route.meta.learn_how_to_render_pathname_routes_dynamic_params_nested_layouts}}"
layout: document
---

## `<page-route>`

{{t.pages.documentation.web_components.page_route.content.the_component_is_the_main_route_container_it_mounts_slotted}}

```html
<page-route path="/dashboard">
    <h2>Dashboard View</h2>
</page-route>
```

---

### {{t.common.labels.attributes}}

{{t.pages.documentation.web_components.page_route.content.attribute_type_default_description}}
{{t.pages.documentation.web_components.page_route.content.line_24}}
{{t.pages.documentation.web_components.page_route.content.path_string_the_pathname_pattern_to_match_supports_parameters_like}}
{{t.pages.documentation.web_components.page_route.content.exact_boolean_true_when_true_matches_the_path_strictly_when}}
{{t.pages.documentation.web_components.page_route.content.src_string_undefined_relative_path_to_an_html_text_or}}
{{t.pages.documentation.web_components.page_route.content.title_string_undefined_updates_the_document_title_when_this_route}}
{{t.pages.documentation.web_components.page_route.content.name_string_undefined_mutually_exclusive_route_group_identifier_similar_to}}

---

### {{t.pages.documentation.web_components.page_route.content.dynamic_parameters}}

{{t.pages.documentation.web_components.page_route.content.use_a_colon_to_define_path_parameters_you_can_retrieve}}

```html
<page-route path="/users/:userId">
    <h2>User ID: <page-data param="userId"></page-data></h2>
</page-route>
```

### {{t.pages.documentation.web_components.page_route.content.nested_layouts}}

{{t.pages.documentation.web_components.page_route.content.set_exact_false_on_a_parent_route_that_should_stay}}

```html
<page-route path="/teams/:teamId" exact="false">
    <h1>Team <page-data param="teamId">unknown</page-data></h1>

    <nav>
        <page-link path="$/members">Members</page-link>
        <page-link path="$/settings">Settings</page-link>
    </nav>

    <page-route path="/members" src="./teams/members.html"></page-route>
    <page-route path="/settings" src="./teams/settings.js"></page-route>
</page-route>
```

---

### {{t.pages.documentation.web_components.page_route.content.switch_like_grouping_name}}

{{t.pages.documentation.web_components.page_route.content.to_ensure_only_one_route_in_a_group_renders_at}}

```html
<!-- Mutually exclusive routing -->
<page-route name="view-group" path="/users/new">
    <h2>Create New User</h2>
</page-route>

<page-route name="view-group" path="/users/:userId">
    <h2>User Profile</h2>
</page-route>
```

---

### {{t.pages.documentation.web_components.page_route.content.lazy_loading_src}}

{{t.pages.documentation.web_components.page_route.content.instead_of_embedding_all_views_in_the_main_document_load}}

{{t.pages.documentation.web_components.page_route.content.you_can_define_a_loading_state_and_a_fallback_ui}}

```html
<page-route path="/about" src="./pages/about-page.html">
    <div slot="loading">Loading page template...</div>
    <div slot="fallback">Oops! Failed to load page.</div>
</page-route>
```

#### {{t.pages.documentation.web_components.page_route.content.supported_lazy_loaded_formats}}

{{t.pages.documentation.web_components.page_route.content.when_loading_a_javascript_file_the_module_must_default_export}}

-   {{t.pages.documentation.web_components.page_route.content.a_plain_html_text_string}}
-   {{t.pages.documentation.web_components.page_route.content.a_native_dom_node_e_g_element_documentfragment}}
-   {{t.pages.documentation.web_components.page_route.content.an_htmltemplate_generated_by_the_markup_html_tagged_literal}}
-   {{t.pages.documentation.web_components.page_route.content.a_function_that_receives_locationstate_pathparams_searchparams_and_returns_any}}

```javascript
// ./pages/user-details.js
const { html } = BFS.MARKUP

export default (data, params, query) => html`
    <h2>User Profile: ${params.userId}</h2>
    <p>Role: ${data.role}</p>
    <p>Tab: ${query.tab || 'overview'}</p>
`
```

---

### {{t.pages.documentation.web_components.page_route.content.caching_and_lifecycle}}

{{t.pages.documentation.web_components.page_route.content.to_prevent_memory_leaks_and_optimize_performance}}

-   {{t.pages.documentation.web_components.page_route.content.inactive_routes_receive_the_hidden_attribute}}
-   {{t.pages.documentation.web_components.page_route.content.when_a_loaded_route_becomes_inactive_the_engine_detaches_the}}
-   {{t.pages.documentation.web_components.page_route.content.if_the_route_matches_again_the_cached_dom_tree_is}}

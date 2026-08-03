---
name: "{{t.pages.documentation.web_components.page_redirect.meta.page_redirect}}"
order: 6.4
title: "{{t.pages.documentation.web_components.page_redirect.meta.page_redirect_component_router_by_before_semicolon}}"
description: "{{t.pages.documentation.web_components.page_redirect.meta.learn_how_to_manage_default_paths_and_handle_404_fallbacks}}"
layout: document
---

## `<page-redirect>`

{{t.pages.documentation.web_components.page_redirect.content.the_component_triggers_programmatic_redirection_it_is_used_to_handle}}

```html
<page-redirect path="/dashboard" type="always"></page-redirect>
```

---

### {{t.common.labels.attributes}}

{{t.pages.documentation.web_components.page_redirect.content.attribute_type_default_description}}
{{t.pages.documentation.web_components.page_redirect.content.line_22}}
{{t.pages.documentation.web_components.page_redirect.content.type_unknown_always_unknown_condition_under_which_redirection_triggers}}
{{t.pages.documentation.web_components.page_redirect.content.path_string_destination_path_supports_parent_prefixes_like_and}}
{{t.pages.documentation.web_components.page_redirect.content.title_string_undefined_the_document_title_to_set_after_redirecting}}
{{t.pages.documentation.web_components.page_redirect.content.payload_object_history_state_payload_in_html_provide_a_json}}

---

### {{t.pages.documentation.web_components.page_redirect.content.redirection_types}}

#### {{t.pages.documentation.web_components.page_redirect.content.text_1_unknown_default}}

{{t.pages.documentation.web_components.page_redirect.content.redirection_triggers_only_when_the_current_browser_path_is_not}}

```html
<!-- Register valid routes first -->
<page-route path="/">Home</page-route>
<page-route path="/about">About</page-route>
<page-route path="/404">Not Found</page-route>

<!-- Redirect any other path to /404 -->
<page-redirect path="/404"></page-redirect>
```

> [!IMPORTANT]
> {{t.pages.documentation.web_components.page_redirect.content.the_order_of_tags_in_html_matters_make_sure_to}}

#### 2. `always`

{{t.pages.documentation.web_components.page_redirect.content.redirection_triggers_immediately_when_the_parent_route_is_matched_exactly}}

```html
<page-route path="/projects/:projectId" exact="false">
    <h2>Project Dashboard</h2>

    <div class="sub-tabs">
        <page-link path="$/overview">Overview</page-link>
        <page-link path="$/analytics">Analytics</page-link>
    </div>

    <!-- Sub-Routes -->
    <page-route path="/overview">Overview Content</page-route>
    <page-route path="/analytics">Analytics Content</page-route>

    <!-- Redirects /projects/:projectId directly to /projects/:projectId/overview -->
    <page-redirect path="$/overview" type="always"></page-redirect>
</page-route>
```

---

### {{t.pages.documentation.web_components.page_redirect.content.scoped_redirection}}

{{t.pages.documentation.web_components.page_redirect.content.because_is_aware_of_its_placement_in_the_dom_tree}}

-   {{t.pages.documentation.web_components.page_redirect.content.placing_it_inside_a_parent_means_it_will_only_handle}}
-   {{t.pages.documentation.web_components.page_redirect.content.unrelated_root_level_paths_will_not_trigger_the_child_redirect}}

```html
<page-route path="/admin" exact="false">
    <h2>Admin Dashboard</h2>

    <page-route path="/settings">Settings</page-route>

    <!-- Redirects /admin/invalid-subpath to /admin/settings -->
    <page-redirect path="$/settings"></page-redirect>
</page-route>
```

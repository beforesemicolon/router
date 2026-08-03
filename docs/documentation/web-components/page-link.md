---
name: "{{t.pages.documentation.web_components.page_link.meta.page_link}}"
order: 6.3
title: "{{t.pages.documentation.web_components.page_link.meta.page_link_component_router_by_before_semicolon}}"
description: "{{t.pages.documentation.web_components.page_link.meta.learn_how_to_manage_active_states_relative_path_resolution_and}}"
layout: document
---

## `<page-link>`

{{t.pages.documentation.web_components.page_link.content.the_component_renders_a_standard_html_anchor_tag_wrapper_that}}

```html
<page-link path="/dashboard" title="Admin Panel">Go to Dashboard</page-link>
```

---

### {{t.common.labels.attributes}}

{{t.pages.documentation.web_components.page_link.content.attribute_type_default_description}}
{{t.pages.documentation.web_components.page_link.content.line_22}}
{{t.pages.documentation.web_components.page_link.content.path_string_current_path_the_destination_pathname_e_g_home}}
{{t.pages.documentation.web_components.page_link.content.search_string_undefined_appends_or_updates_search_parameters_e_g}}
{{t.pages.documentation.web_components.page_link.content.keep_current_search_boolean_false_retains_existing_url_search_parameters}}
{{t.pages.documentation.web_components.page_link.content.exact_boolean_true_when_true_links_are_marked_active_only}}
{{t.pages.documentation.web_components.page_link.content.title_string_undefined_the_document_title_to_set_upon_successful}}
{{t.pages.documentation.web_components.page_link.content.payload_object_history_state_payload_in_html_provide_a_json}}

---

### {{t.pages.documentation.web_components.page_link.content.relative_path_resolution}}

{{t.pages.documentation.web_components.page_link.content.to_make_page_layout_structures_reusable_automatically_resolves_shorthand_prefixes}}

-   {{t.pages.documentation.web_components.page_link.content.no_path_attribute_evaluates_to_the_current_browser_pathname_ideal}}
    ```html
    <page-link search="filter=completed">Completed Tasks</page-link>
    ```
-   {{t.pages.documentation.web_components.page_link.content.dollar_prefix_replaced_by_the_path_of_the_closest_parent}}
    ```html
    <page-route path="/projects/:projectId">
        <!-- Resolves to: /projects/123/edit -->
        <page-link path="$/edit">Edit Project</page-link>
    </page-route>
    ```
-   {{t.pages.documentation.web_components.page_link.content.tilde_prefix_replaced_by_the_current_browser_pathname_useful_for}}
    ```html
    <!-- If current page is /profile -->
    <!-- Resolves to: /profile/settings -->
    <page-link path="~/settings">Settings</page-link>
    ```

---

### {{t.pages.documentation.web_components.page_link.content.active_state_styling}}

{{t.pages.documentation.web_components.page_link.content.when_the_browser_location_matches_the_link_s_target_the}}

```html
<!-- Rendered active HTML element -->
<page-link path="/todos" active>Todos</page-link>
```

{{t.pages.documentation.web_components.page_link.content.you_can_target_this_state_in_css_using_standard_attributes}}

```css
/* Style the outer custom component element */
page-link[active] {
    font-weight: 700;
}

/* Style the inner anchor tag using shadow parts */
page-link::part(anchor) {
    color: var(--foreground);
    text-decoration: none;
    transition: border-color 0.2s;
}

page-link[active]::part(anchor) {
    border-bottom: 2px solid var(--primary);
    color: var(--primary);
}
```

---

### {{t.pages.documentation.web_components.page_link.content.passing_payloads}}

{{t.pages.documentation.web_components.page_link.content.use_payload_to_pass_history_state_data_to_the_next}}

{{t.pages.documentation.web_components.page_link.content.in_plain_html_attributes_are_strings_so_payload_must_be}}

```html
<page-link path="/dashboard" payload='{"role": "admin", "userId": 42}'>
    Enter Panel
</page-link>
```

{{t.pages.documentation.web_components.page_link.content.when_rendering_through_markup_pass_the_value_as_an_object}}

```javascript
import { html } from '@beforesemicolon/web-component'

const user = { role: 'admin', userId: 42 }

html` <page-link path="/dashboard" payload="${user}"> Enter Panel </page-link> `
```

{{t.pages.documentation.web_components.page_link.content.the_payload_is_available_on_the_destination_route_through_getpagedata}}

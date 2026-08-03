---
name: "{{t.pages.documentation.web_components.page_data.meta.page_data}}"
order: 6.5
title: "{{t.pages.documentation.web_components.page_data.meta.page_data_component_router_by_before_semicolon}}"
description: "{{t.pages.documentation.web_components.page_data.meta.learn_how_to_display_pathname_params_search_query_values_and}}"
layout: document
---

## `<page-data>`

{{t.pages.documentation.web_components.page_data.content.the_component_allows_you_to_print_current_routing_parameters_search}}

```html
<p>Viewing user ID: <page-data param="userId">unknown</page-data></p>
```

---

### {{t.common.labels.attributes}}

{{t.pages.documentation.web_components.page_data.content.attribute_type_default_description}}
{{t.pages.documentation.web_components.page_data.content.line_22}}
{{t.pages.documentation.web_components.page_data.content.param_string_undefined_the_name_of_the_path_parameter_to}}
{{t.pages.documentation.web_components.page_data.content.search_param_string_undefined_the_name_of_the_url_query}}
{{t.pages.documentation.web_components.page_data.content.key_string_undefined_the_dot_notation_key_path_to_display}}

---

### {{t.pages.documentation.web_components.page_data.content.fallback_values}}

{{t.pages.documentation.web_components.page_data.content.any_content_wrapped_between_tags_is_treated_as_a_default}}

```html
<!-- Renders: "Guest" if role is empty -->
<p>Role: <page-data key="role">Guest</page-data></p>
```

---

### {{t.pages.documentation.web_components.page_data.content.deep_key_resolution}}

{{t.pages.documentation.web_components.page_data.content.when_passing_complex_history_payloads_via_use_dot_notation_in}}

```html
<!-- Navigation link -->
<page-link path="/dashboard" payload='{"user": {"profile": {"name": "Elson"}}}'>
    Dashboard
</page-link>

<!-- Extraction -->
<h3>Welcome, <page-data key="user.profile.name">Guest</page-data></h3>
```

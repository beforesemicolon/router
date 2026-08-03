---
name: "{{t.common.pageTitles.componentProp}}"
order: 8.5
title: "{{t.pages.documentation.advanced_features.component_prop.meta.component_prop_router_by_before_semicolon}}"
description: "{{t.pages.documentation.advanced_features.component_prop.meta.learn_how_to_pass_component_references_directly_to_routes_for}}"
layout: document
---

## {{t.common.pageTitles.componentProp}}

{{t.pages.documentation.advanced_features.component_prop.content.instead_of_using_the_src_attribute_with_file_path_strings}}

{{t.pages.documentation.advanced_features.component_prop.content.this_approach_is_highly_recommended_when_bundling_applications_as_it}}

```typescript
import { html } from '@beforesemicolon/web-component'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'

// Render route tags using Component imports directly
html`
    <page-route path="/" component="${HomePage}"></page-route>
    <page-route path="/about" component="${AboutPage}"></page-route>
`
```

---

### {{t.pages.documentation.advanced_features.component_prop.content.benefits_of_the_component_prop}}

-   {{t.pages.documentation.advanced_features.component_prop.content.type_safety_typescript_validates_class_references_at_compile_time}}
-   {{t.pages.documentation.advanced_features.component_prop.content.ide_assistance_autocomplete_and_symbol_renaming_work_natively}}
-   {{t.pages.documentation.advanced_features.component_prop.content.tree_shaking_static_imports_allow_bundlers_to_shake_out_unused}}
-   {{t.pages.documentation.advanced_features.component_prop.content.hmr_support_faster_hot_module_replacements_during_development}}

---

### {{t.pages.documentation.advanced_features.component_prop.content.component_formats}}

{{t.pages.documentation.advanced_features.component_prop.content.the_value_passed_to_the_component_property_can_be}}

#### {{t.pages.documentation.advanced_features.component_prop.content.text_1_plain_html_string}}

```typescript
export default '<h2>Welcome Home</h2>'
```

#### {{t.pages.documentation.advanced_features.component_prop.content.text_2_markup_template_literal}}

```typescript
import { html } from '@beforesemicolon/web-component'
export default html`<h2>Welcome Home</h2>`
```

#### {{t.pages.documentation.advanced_features.component_prop.content.text_3_native_dom_node}}

```typescript
const container = document.createElement('div')
container.textContent = 'Welcome Home'
export default container
```

#### {{t.pages.documentation.advanced_features.component_prop.content.text_4_contextual_loader_function}}

{{t.pages.documentation.advanced_features.component_prop.content.a_function_that_receives_navigation_data_path_params_and_search}}

```typescript
export default (data, params, query) => {
    return html`
        <h2>Welcome ${data.username}</h2>
        <p>Viewing item ID: ${params.itemId}</p>
        <p>Active filter: ${query.filter}</p>
    `
}
```

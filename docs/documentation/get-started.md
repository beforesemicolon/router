---
name: "{{t.common.actions.getStarted}}"
order: 2
title: "{{t.pages.documentation.get_started.meta.get_started_with_router_before_semicolon}}"
description: "{{t.pages.documentation.get_started.meta.build_your_first_html_first_router_app_with_page_link}}"
layout: document
---

## {{t.common.actions.getStarted}}

{{t.pages.documentation.get_started.content.setting_up_routing_does_not_require_a_route_config_file}}

{{t.pages.documentation.get_started.content.let_s_build_a_simple_multi_tab_dashboard_step_by}}

## {{t.pages.documentation.get_started.content.step_1_add_the_scripts}}

{{t.pages.documentation.get_started.content.import_the_required_scripts_the_router_relies_on_beforesemicolon_web}}

```html
<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>
<script src="https://unpkg.com/@beforesemicolon/router/dist/client.js"></script>
```

## {{t.pages.documentation.get_started.content.step_2_declare_navigation_links}}

{{t.pages.documentation.get_started.content.create_navigation_links_using_the_tag_use_the_path_attribute}}

```html
<nav>
    <page-link path="/" title="Home Dashboard">Home</page-link>
    <page-link path="/todos" title="Todo Manager">Todos</page-link>
    <page-link path="/contact" title="Get in Touch">Contact</page-link>
</nav>
```

## {{t.pages.documentation.get_started.content.step_3_define_page_routes}}

{{t.pages.documentation.get_started.content.wrap_your_page_views_inside_tags_the_contents_of_these}}

```html
<!-- Home Page -->
<page-route path="/">
    <h1>Welcome Home</h1>
    <p>This is the default dashboard view.</p>
</page-route>

<!-- Todo Page (exact path matching) -->
<page-route path="/todos">
    <h1>Your Todos</h1>
    <p>Manage your daily activities here.</p>
</page-route>

<!-- Contact Page -->
<page-route path="/contact">
    <h1>Contact Us</h1>
    <p>Send us an email at contact@example.com</p>
</page-route>
```

## {{t.pages.documentation.get_started.content.step_4_handle_404s_and_redirects}}

{{t.pages.documentation.get_started.content.to_redirect_users_when_they_navigate_to_an_unregistered_or}}

```html
<!-- 404 Fallback page -->
<page-route path="/404">
    <h1>404 - Page Not Found</h1>
</page-route>

<!-- Redirects any unknown paths to the 404 page -->
<page-redirect path="/404"></page-redirect>
```

---

## {{t.pages.documentation.get_started.content.next_steps}}

{{t.pages.documentation.get_started.content.now_that_you_have_a_basic_routing_layout_you_can}}

-   {{t.pages.documentation.get_started.content.guide_best_practices_for_route_structure_redirects_guards_and_production}}
-   {{t.pages.documentation.get_started.content.page_route_to_render_params_nested_views_loading_states_and}}
-   {{t.pages.documentation.get_started.content.navigation_apis_to_navigate_programmatically_inside_javascript}}
-   {{t.pages.documentation.get_started.content.route_guards_to_secure_pages_with_sync_or_async_checks}}

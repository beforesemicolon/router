---
name: "{{t.pages.home.meta.router}}"
order: 0
title: "{{t.pages.home.meta.router_by_before_semicolon}}"
description: "{{t.pages.home.meta.a_tiny_web_component_router_for_html_first_apps_declare}}"
layout: landing
---

::: layout landing-hero title="{{t.pages.home.content.routing}}" title2="{{t.pages.home.content.in_plain_html}}" primaryLabel="{{t.common.actions.getStarted}}" secondaryLabel="$ npm i @beforesemicolon/router"

=== copy

{{t.pages.home.content.a_tiny_web_component_router_for_html_first_apps_route}}

=== stat

## 5

WEB COMPONENTS

=== stat

## 0

{{t.pages.home.content.config}}

=== stat

## HTML

{{t.pages.home.content.js_txt_pages}}

=== code filename=index.html lang=html

```html
<!-- index.html — zero JavaScript required -->
<nav>
    <page-link path="/" title="Home">Home</page-link>
    <page-link path="/todos" title="Todos">Todos</page-link>
    <page-link path="/contact" title="Contact">Contact</page-link>
</nav>

<page-route path="/">
    <h1>Welcome</h1>
</page-route>

<!-- lazy-load HTML, txt or JS files -->
<page-route path="/todos" src="./pages/todos.html"></page-route>
<page-route path="/contact" src="./pages/contact.js"></page-route>

<!-- redirect unknown paths -->
<page-redirect path="/404"></page-redirect>
```

:::

::: layout landing-ecosystem

=== header

{{t.pages.home.content.the_ecosystem}}

## {{t.pages.home.content.built_on_web_component_markup}}

{{t.pages.home.content.router_is_built_on_top_of_web_component_and_markup}}

=== product title="Markup" package="@beforesemicolon/markup" color=orange icon=reactive href="https://markup.beforesemicolon.com"

{{t.pages.home.content.the_9kb_reactive_templating_system_that_powers_everything_tagged_templates}}

=== product title="Web Component" package="@beforesemicolon/web-component" color=cyan icon=webComponents href="https://web-component.beforesemicolon.com"

{{t.pages.home.content.a_reactive_layer_over_native_custom_elements_the_foundation_router}}

:::

::: layout landing-features

=== header

{{t.pages.home.content.why_this_router}}

## {{t.pages.home.content.routing_that_disappears_into_html}}

{{t.pages.home.content.five_web_components_one_central_matcher_and_a_clean_js}}

=== feature icon=plug

### {{t.pages.home.content.plug_play}}

{{t.pages.home.content.drop_in_two_script_tags_and_route_with_html_no}}

=== feature icon=tiny

### {{t.pages.home.content.tiny_focused}}

{{t.pages.home.content.a_small_surface_area_five_web_components_and_a_js}}

=== feature icon=sparkles

### {{t.pages.home.content.lazy_loaded_pages}}

{{t.pages.home.content.point_page_route_at_an_html_txt_or_js_file}}

=== feature icon=webComponents

### {{t.pages.home.content.nested_named_routes}}

{{t.pages.home.content.children_extend_their_parent_s_path_use_the_name_attribute}}

=== feature icon=router

### {{t.pages.home.content.search_query_routing}}

{{t.pages.home.content.page_route_query_renders_content_based_on_key_value_tabs}}

=== feature icon=standards

### {{t.pages.home.content.smart_redirects}}

{{t.pages.home.content.page_redirect_targets_unknown_paths_only_or_always_scoped_to}}

=== feature icon=surgical

### {{t.pages.home.content.one_match_one_render}}

{{t.pages.home.content.a_central_matcher_resolves_each_navigation_once_guards_run_once}}

=== feature icon=sparkles

### {{t.pages.home.content.cached_remounts}}

{{t.pages.home.content.inactive_routes_are_detached_from_the_dom_but_kept_warm}}

=== feature icon=plug

### {{t.pages.home.content.works_with_any_builder}}

{{t.pages.home.content.vite_webpack_esbuild_plain_html_or_a_cdn_script_tag}}

:::

::: layout landing-showcase

=== header

{{t.pages.home.content.see_it_in_action}}

## {{t.pages.home.content.five_examples_infinite_sitemaps}}

{{t.pages.home.content.compose_page_route_page_link_page_route_query_page_redirect}}

=== example label="{{t.pages.home.content.nested_routes_params}}" color=cyan filename=app.html lang=html

```html
<!-- nested routes — child paths extend the parent -->
<page-route path="/projects" exact="false">
    <h1>Projects</h1>

    <!-- /projects -->
    <page-route src="./pages/projects-list.js"></page-route>

    <!-- /projects/:projectId — pathname params -->
    <page-route path="/:projectId" src="./pages/project.js">
        <div slot="loading">Loading project...</div>
        <div slot="fallback">Could not load this project.</div>
    </page-route>

    <!-- only redirects unknown CHILD routes of /projects -->
    <page-redirect path="/projects/not-found"></page-redirect>
</page-route>
```

=== example label="{{t.pages.home.content.search_query_routes}}" color=orange filename=tabs.html lang=html

```html
<!-- routing by ?tab= — perfect for tabs, filters, modals -->
<div class="tabs">
    <div class="tab-header">
        <page-link search="tab=one">Tab 1</page-link>
        <page-link search="tab=two">Tab 2</page-link>
    </div>

    <div class="tab-content">
        <page-route-query key="tab" value="one">
            Tab One content
        </page-route-query>

        <page-route-query key="tab" value="two">
            Tab Two content
        </page-route-query>
    </div>
</div>
```

=== example label="{{t.pages.home.content.page_metadata}}" color=cyan filename=user.html lang=html

```html
<!-- render location metadata: payload, params and search queries -->
<page-link path="/users/42" title="User profile" payload='{"role": "admin"}'
    >Open user 42</page-link
>

<page-route path="/users/:userId">
    <h1>User <page-data param="userId">unknown</page-data></h1>

    <!-- payload data passed via the link -->
    <p>Role: <page-data key="role">guest</page-data></p>

    <!-- current search query value (following router API search-param attribute) -->
    <p>Tab: <page-data search-param="tab">overview</page-data></p>
</page-route>
```

=== example label="{{t.pages.home.content.protected_routes}}" color=green filename=guards.js lang=javascript

```javascript
import {
    registerGlobalGuard,
    registerRouteGuard,
} from '@beforesemicolon/router'

registerGlobalGuard((pathname) => {
    const publicPages = ['/', '/login', '/pricing', '/404']

    if (!publicPages.includes(pathname) && !auth.isSignedIn()) {
        return '/login'
    }

    return true
})

registerRouteGuard('/admin/:section', async () => {
    return (await auth.hasRole('admin')) || '/unauthorized'
})
```

=== example label="{{t.pages.home.content.bundler_friendly_pages}}" color=orange filename=routes.js lang=javascript

```javascript
import { registerRouteModules } from '@beforesemicolon/router'

registerRouteModules(
    import.meta.glob('./pages/**/*.{js,html,txt}', {
        eager: false,
    })
)
```

```html
<page-route path="/" src="./pages/home.js"></page-route>
<page-route path="/docs" src="./pages/docs.html"></page-route>
<page-route path="/legal" src="./pages/legal.txt"></page-route>
```

:::

::: layout landing-install

=== header

{{t.pages.home.content.quick_start}}

## {{t.pages.home.content.install_in_seconds}}

{{t.pages.home.content.choose_your_preferred_installation_method_works_everywhere_javascript_runs}}

=== tab key=cdn label=CDN command="<script src=&quot;https://unpkg.com/@beforesemicolon/router/dist/client.js&quot;></script>"

=== tab key=npm label=npm command="npm install @beforesemicolon/router"

=== tab key=yarn label=yarn command="yarn add @beforesemicolon/router"

=== tab key=pnpm label=pnpm command="pnpm add @beforesemicolon/router"

:::

::: layout landing-cta title="{{t.pages.home.content.build_single_and_multi_page_apps}}" title2="{{t.pages.home.content.your_way}}"

=== copy

{{t.pages.home.content.combine_the_simplicity_of_vanilla_web_standards_with_the_power}}

:::

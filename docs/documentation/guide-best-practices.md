---
name: "{{t.common.pageTitles.guideBestPractices}}"
order: 4
title: "{{t.pages.documentation.guide_best_practices.meta.router_guide_best_practices_router_by_before_semicolon}}"
description: "{{t.pages.documentation.guide_best_practices.meta.practical_guidance_for_building_maintainable_html_first_routing_with_before}}"
layout: document
---

## {{t.common.pageTitles.guideBestPractices}}

{{t.pages.documentation.guide_best_practices.content.router_works_best_when_the_url_is_treated_as_the}}

## {{t.pages.documentation.guide_best_practices.content.start_with_declarative_routes}}

{{t.pages.documentation.guide_best_practices.content.for_most_pages_use_and_directly_in_the_document_this}}

```html
<nav>
    <page-link path="/" title="Home">Home</page-link>
    <page-link path="/projects" title="Projects">Projects</page-link>
    <page-link path="/settings" title="Settings">Settings</page-link>
</nav>

<main>
    <page-route path="/" src="./pages/home.html"></page-route>
    <page-route
        path="/projects"
        exact="false"
        src="./pages/projects.js"
    ></page-route>
    <page-route path="/settings" src="./pages/settings.html"></page-route>
    <page-route path="/404">Page not found.</page-route>
    <page-redirect path="/404"></page-redirect>
</main>
```

## {{t.pages.documentation.guide_best_practices.content.use_nested_routes_for_layouts}}

{{t.pages.documentation.guide_best_practices.content.parent_routes_are_useful_for_sections_that_share_navigation_headings}}

```html
<page-route path="/projects/:projectId" exact="false">
    <header>
        <h1>Project <page-data param="projectId">unknown</page-data></h1>
        <page-link path="$/overview">Overview</page-link>
        <page-link path="$/activity">Activity</page-link>
        <page-link path="$/settings">Settings</page-link>
    </header>

    <page-route path="/overview" src="./projects/overview.js"></page-route>
    <page-route path="/activity" src="./projects/activity.html"></page-route>
    <page-route path="/settings" src="./projects/settings.js"></page-route>
    <page-redirect path="$/overview" type="always"></page-redirect>
</page-route>
```

## {{t.pages.documentation.guide_best_practices.content.use_query_routes_for_ui_state}}

{{t.pages.documentation.guide_best_practices.content.use_when_the_view_is_still_the_same_page_but}}

```html
<page-link search="panel=details" keep-current-search>Details</page-link>
<page-link search="panel=activity" keep-current-search>Activity</page-link>

<page-route-query key="panel" value="details">
    <h2>Details</h2>
</page-route-query>

<page-route-query key="panel" value="activity" src="./panels/activity.html">
    <p slot="loading">Loading activity...</p>
</page-route-query>
```

## {{t.pages.documentation.guide_best_practices.content.prefer_component_for_typed_apps}}

{{t.pages.documentation.guide_best_practices.content.if_you_are_rendering_routes_from_markup_or_web_component}}

```javascript
import { html } from '@beforesemicolon/web-component'
import HomePage from './pages/HomePage.js'
import ProjectPage from './pages/ProjectPage.js'

export const routes = html`
    <page-route path="/" component="${HomePage}"></page-route>
    <page-route
        path="/projects/:projectId"
        component="${ProjectPage}"
    ></page-route>
`
```

## {{t.pages.documentation.guide_best_practices.content.register_guards_before_navigation}}

{{t.pages.documentation.guide_best_practices.content.guards_run_before_route_listeners_and_route_components_are_notified}}

```javascript
import {
    registerGlobalGuard,
    registerRouteGuard,
} from '@beforesemicolon/router'

registerGlobalGuard((pathname) => {
    if (pathname.startsWith('/account') && !session.currentUser) {
        return '/login'
    }

    return true
})

registerRouteGuard('/admin/:section', async () => {
    return (await session.hasRole('admin')) || '/unauthorized'
})
```

## {{t.pages.documentation.guide_best_practices.content.keep_404s_last}}

{{t.pages.documentation.guide_best_practices.content.checks_the_routes_that_have_been_registered_put_fallback_redirects}}

```html
<page-route path="/">Home</page-route>
<page-route path="/docs" exact="false">Docs</page-route>
<page-route path="/404">Not found</page-route>

<page-redirect path="/404"></page-redirect>
```

## {{t.pages.documentation.guide_best_practices.content.choose_history_or_hash_routing_early}}

{{t.pages.documentation.guide_best_practices.content.history_routing_gives_clean_urls_and_is_the_default_hash}}

```javascript
import { setRoutingMode } from '@beforesemicolon/router'

setRoutingMode('hash')
```

## {{t.pages.documentation.guide_best_practices.content.production_checklist}}

-   {{t.pages.documentation.guide_best_practices.content.give_every_meaningful_route_a_document_title_through_or_your}}
-   {{t.pages.documentation.guide_best_practices.content.use_route_params_for_resource_identity_and_search_params_for}}
-   {{t.pages.documentation.guide_best_practices.content.keep_route_modules_small_and_lazy_load_secondary_screens}}
-   {{t.pages.documentation.guide_best_practices.content.use_name_on_overlapping_route_groups_so_only_the_first}}
-   {{t.pages.documentation.guide_best_practices.content.use_payload_only_for_transient_navigation_state_persist_important_state}}

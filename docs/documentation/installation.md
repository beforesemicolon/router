---
name: "{{t.common.pageTitles.installation}}"
order: 3
title: "{{t.pages.documentation.installation.meta.install_router_before_semicolon}}"
description: "{{t.pages.documentation.installation.meta.install_beforesemicolon_router_with_npm_yarn_pnpm_or_direct_browser}}"
layout: document
---

## {{t.common.pageTitles.installation}}

{{t.pages.documentation.installation.content.beforesemicolon_router_works_in_bundled_applications_and_directly_in_modern}}

## {{t.pages.documentation.installation.content.package_managers}}

{{t.pages.documentation.installation.content.install_the_package_via_your_preferred_package_manager_to_bundle}}

## npm

```sh
npm install @beforesemicolon/router
```

## yarn

```sh
yarn add @beforesemicolon/router
```

## pnpm

```sh
pnpm add @beforesemicolon/router
```

---

## {{t.pages.documentation.installation.content.direct_cdn_zero_build}}

{{t.pages.documentation.installation.content.for_simple_html_prototypes_or_build_less_applications_load_the}}

```html
<!-- 1. Import the base web component library (Required dependency) -->
<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>

<!-- 2. Import the router browser bundle -->
<script src="https://unpkg.com/@beforesemicolon/router/dist/client.js"></script>
```

## {{t.pages.documentation.installation.content.locking_versions}}

{{t.pages.documentation.installation.content.it_is_highly_recommended_to_lock_the_version_in_production}}

```html
<script src="https://unpkg.com/@beforesemicolon/router@1.4.0/dist/client.js"></script>
```

---

## {{t.pages.documentation.installation.content.global_namespace}}

{{t.pages.documentation.installation.content.when_loaded_via_a_script_tag_all_exported_classes_routing}}

```javascript
// Access router components and APIs
const { goToPage, onPage, registerRouteGuard } = BFS.ROUTER
```

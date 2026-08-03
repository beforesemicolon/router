---
name: "{{t.common.pageTitles.moduleRegistry}}"
order: 8.3
title: "{{t.pages.documentation.advanced_features.module_registry.meta.module_registry_router_by_before_semicolon}}"
description: "{{t.pages.documentation.advanced_features.module_registry.meta.learn_how_to_pre_register_page_modules_for_code_splitting}}"
layout: document
---

## {{t.common.pageTitles.moduleRegistry}}

{{t.pages.documentation.advanced_features.module_registry.content.when_building_large_scale_applications_with_modern_asset_bundlers_like}}

{{t.pages.documentation.advanced_features.module_registry.content.the_module_registry_allows_you_to_pre_register_a_map}}

---

### `registerRouteModules`

{{t.pages.documentation.advanced_features.module_registry.content.registers_a_map_of_paths_to_their_module_loader_functions}}

```typescript
type ModuleLoader = () => Promise<any>

function registerRouteModules(modules: Record<string, ModuleLoader>): void
```

---

### {{t.pages.documentation.advanced_features.module_registry.content.integration_examples}}

#### 1. Vite (`import.meta.glob`)

{{t.pages.documentation.advanced_features.module_registry.content.vite_supports_importing_multiple_files_matching_a_glob_pattern_automatically}}

```javascript
import { registerRouteModules } from '@beforesemicolon/router'

// 1. Gather all page components (lazy loaders)
const modules = import.meta.glob('./pages/**/*.{ts,js,html}', { eager: false })

// 2. Register with router
registerRouteModules(modules)
```

#### 2. Webpack (`require.context`)

{{t.pages.documentation.advanced_features.module_registry.content.webpack_uses_require_context_to_trace_directory_structures}}

```javascript
import { registerRouteModules } from '@beforesemicolon/router'

const context = require.context('./pages', true, /\.(ts|js|html)$/)
const modules = {}

context.keys().forEach((key) => {
    // Map paths to loaders
    modules[key] = () => Promise.resolve(context(key))
})

registerRouteModules(modules)
```

#### {{t.pages.documentation.advanced_features.module_registry.content.text_3_manual_registration}}

{{t.pages.documentation.advanced_features.module_registry.content.you_can_also_manually_map_imports}}

```javascript
import { registerRouteModules } from '@beforesemicolon/router'

registerRouteModules({
    './pages/home.js': () => import('./pages/home.js'),
    './pages/about.js': () => import('./pages/about.js'),
})
```

---

### {{t.pages.documentation.advanced_features.module_registry.content.usage_in_html}}

{{t.pages.documentation.advanced_features.module_registry.content.once_modules_are_registered_define_your_tags_as_normal_the}}

```html
<!-- Uses the registered bundler import loader automatically -->
<page-route path="/" src="./pages/home.js"></page-route>
```

---

### `getRouteModule`

{{t.pages.documentation.advanced_features.module_registry.content.retrieves_a_registered_module_loader_by_its_path}}

```typescript
function getRouteModule(path: string): ModuleLoader | undefined
```

### {{t.pages.documentation.advanced_features.module_registry.content.preloading_registered_modules}}

{{t.pages.documentation.advanced_features.module_registry.content.registered_modules_can_be_preloaded_before_the_user_navigates_to}}

```typescript
function preloadRouteModule(path: string): Promise<void>
function preloadRouteModules(paths: string[]): Promise<void>
```

```javascript
import { preloadRouteModules } from '@beforesemicolon/router'

await preloadRouteModules(['./pages/dashboard.js', './pages/settings.js'])
```

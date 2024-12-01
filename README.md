# Web Component based Router

[![Static Badge](https://img.shields.io/badge/documentation-blue)](https://markup.beforesemicolon.com/documentation/capabilities/router)
[![Test](https://github.com/beforesemicolon/router/actions/workflows/test.yml/badge.svg)](https://github.com/beforesemicolon/router/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/%40beforesemicolon%2Frouter)](https://www.npmjs.com/package/@beforesemicolon/router)
![npm](https://img.shields.io/npm/l/%40beforesemicolon%2Frouter)

Web component router based on [Markup](https://markup.beforesemicolon.com/).

## Motivation
- a router that works for MPA, SPA, and hybrid Apps are rare
- web standards alone routing is hard to work with
- it takes time to implement a custom router
- most routers out there are framework specific
- routers out there require JavaScript code to be written and a powerful component tag simplifies that
- available routers dont handle both JavaScript, text, and HTML files loading
- web components work with everything which makes it a perfect candidate for a router

```html
<!-- index.html -->

<nav>
    <!-- navigate with ability to update title and pass data via payload attribute -->
    <page-link path="/" title="Welcome" payload='{"heading": "Home content"}'
    >Home</page-link
    >
    <page-link path="/todos" search="tab=one" title="Manage todos"
    >Todos</page-link
    >
    <page-link path="/contact" title="Contact">Contact</page-link>
</nav>

<!-- wrap the content to render based on url pathname -->
<page-route path="/">
    <h1>
        <!-- render page metadata like specified payload, 
            path and search query param values -->
        <page-data key="heading"> Home content </page-data>
    </h1>
    <p>This is home content</p>
    
    <div class="tabs">
        <div class="tab-header">
            <!-- update search query -->
            <page-link search="tab=one">Tab 1</page-link>
            <page-link search="tab=two">Tab 2</page-link>
        </div>
        
        <div class="tab-content">
            <!-- render content base on specific search query values -->
            <page-route-query key="tab" value="one">
                Tab One content
            </page-route-query>
            
            <page-route-query key="tab" value="one">
                Tab Two content
            </page-route-query>
        </div>
    </div>
    
    <!-- choose to ALWAYS redirect to a default location when no url match -->
    <page-redirect type="always" path="/?tab=one"></page-redirect>
</page-route>

<!-- nest routes to create complex sitemap
    by allowing path to not be matched exactly (default) -->
<page-route path="/todos" exact="false">
    <!-- child routes are aware of their parent routes
        no matter where they are rendered
        and will always extend their parent paths -->
    <page-route src="./pages/todos.js"></page-route>
    
    <!-- use pathname params to specify variables in the pathname -->
    <page-route path="/:todoId" src="./pages/todo-item.js"></page-route>
</page-route>

<!-- load content from text, HTML, or JavaScript files -->
<page-route path="/contact" src="./pages/contact.js"></page-route>

<page-route path="/404"> 404 - Page not found! </page-route>

<!-- force redirect when pathnames are unknown -->
<page-redirect path="/404" title="404 - Page not found!"></page-redirect>
```

## Examples

- [SPA](https://stackblitz.com/edit/vitejs-vite-4jvsfp?file=index.html)

## Installation

```
npm install @beforesemicolon/router
```

via CDN:

```html
<!-- required WebComponent Markup to be present -->
<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>


<!-- use the latest version -->
<script src="https://unpkg.com/@beforesemicolon/router/dist/client.js"></script>

<!-- use a specific version -->
<script src="https://unpkg.com/@beforesemicolon/router@0.1.0/dist/client.js"></script>

<!-- link you app script after -->
<script>
    const { ... } = BFS.ROUTER
</script>

```

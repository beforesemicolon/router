# Web Component Router (beta)

[![Static Badge](https://img.shields.io/badge/based_on-markup.beforesemicolon.com-blue)](https://markup.beforesemicolon.com)
[![Test](https://github.com/beforesemicolon/router/actions/workflows/test.yml/badge.svg)](https://github.com/beforesemicolon/router/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/%40beforesemicolon%2Frouter)](https://www.npmjs.com/package/@beforesemicolon/router)
![npm](https://img.shields.io/npm/l/%40beforesemicolon%2Frouter)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c34e61bd-3c8f-4c01-a524-dcbcddfa78dd/deploy-status)](https://app.netlify.com/sites/bfs-router/deploys)

Web component router based on [Markup](https://markup.beforesemicolon.com/)

## Motivation
- web standards alone routing is hard to work with
- it takes time to implement a custom router
- most routers out there are framework specific
- routers out there require JavaScript code to be written and a powerful component tag simplifies that
- available routers dont handle both JavaScript and HTML files
- web components work with everything which makes it a perfect candidate for a router

```html
<nav>
    <page-link path="/">Home</page-link>
    <page-link path="/contact">Contact</page-link>
</nav>

<page-route path="/">
    Home content
</page-route>

<page-route path="/contact">
    Contact content
</page-route>

<page-route path="/404">
    404 - Page not found!
</page-route>

<page-redirect to="/404"></page-redirect>
```

## Examples

* [Demo Doc](https://bfs-router.netlify.app/)
* [Tabs](https://stackblitz.com/edit/stackblitz-starters-jrfnhm?file=index.html)

## Install

```
npm install @beforesemicolon/router
```

In the browser

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

## Documentation

### `page-link`
A link that lets you navigate to any page. Works similar to [goToPage](#gotopage)
and takes similar options.
```html
<!-- update the title of the page and pass data to the next page as JSON -->
<page-link 
  path="/"
  title="Welcome"
  data='{"sample": "value"}'
>
  Home Info
</page-link>

<!-- specify search query in the path-->
<page-link path="/router/index.html?tab=sample">sample tab</page-link>

<!-- go to the sample page and override specific query keys -->
<page-link path="/sample" search="tab=info">new tab</page-link>

<!-- you can choose to keep current search query
    and only add your specified search -->
<page-link path="/sample" search="tab=info" keep-current-search="true">new tab</page-link>

<!-- similar to page-route-query default, 
    you can mark the specified search as default to put
    the link in an active state for styling purpose -->
<page-link path="/todos" search="tab=pending" default="true">Pending Todos</page-link>
<page-link path="/todos" search="tab=in-progress">In Progress Todos</page-link>
<page-link path="/todos" search="tab=completed">Completed Todos</page-link>

<page-route path="/todos">
    <!--  not specifying the "path" attribute will force 
        the page-link to inherit closest page-route path
        and if one does not exist, it will be / -->
    <page-link search="tab=pending" default="true">Pending Todos</page-link>
    <page-link search="tab=in-progress">In Progress Todos</page-link>
    <page-link search="tab=completed">Completed Todos</page-link>
    
    <!-- use $ to specify you want to inherit the closest
        page-route path and extend it to something specific.
         
        bellow becomes "/todos/create -->
    <page-link path="$/create">new tab</page-link>
</page-route>

<!-- listen to when the link becomes active -->
<page-link path="/contact" onactive="...">contact</page-link>
```

You can style the link by targeting the `anchor` and `active` parts.

```css
/* the actual page-link tag */
page-link {
    ...
}

page-link.active {
    ...
}

/* the anchor tag inside */
page-link::part(anchor) {
    text-decoration: none;
    color: #444;
    padding: 10px;
    border-bottom: 2px solid transparent;
}

page-link::part(anchor active) {
    background: #b4fff8;
    border-color: #222;
    color: #000;
}

page-link::part(anchor):visited { ... }
page-link::part(anchor):active { ... }
page-link::part(anchor):hover { ... }
```

### `page-route`
A component to conditionally render content based on the route.

The content can be provided as children content or loaded via the `src` attribute.

You can also set content inside with attribute of `loading` to show while
the content is being loaded or a `fallback` in case the content fails to load.
```html
<!-- specify the title and content of the page -->
<page-route path="/" title="Welcome">
  Home content
</page-route>

<!-- fetch html content with fallback content and loading indicator -->
<page-route path="/contact" src="/contact.html">
  <div slot="loading">Loading home content</div>
  <div slot="fallback">
    Oops - Failed to load content
  </div>
</page-route>

<!-- js file must default export a:
- function expecting arguments
- Markup template
- object with a "render" method
- DOM Nodes
- anything valid as a "innerHTML" value - it will be turned into a string
-->
<page-route 
    path="/greeting" 
    src="./greeting.page.js" 
    data='{"greeting":"Hello World"}'
></page-route>


<!-- Nest page-route

Specify the exact="false" so it allows inner page-routes to render
-->
<page-route path="/todos" exact="false">

    <!-- child page route already knows its inside a page-route 
       so its parent path already prefixes its own which means
       bellow page-route path is actually "/todos/pending" -->
    <page-route path="/pending">
        ...
    </page-route>

    <page-route path="/in-progress">
        ...
    </page-route>

    <page-route path="/completed">
        ...
    </page-route>

</page-route>

```

```js
// greeting.page.js
const { html } = BFS.MARKUP

export default ({ greeting }) => {
  return html`<p>${greeting}</p>`
}
```

### `page-route-query`
The `page-route-query` work exactly like `page-route` but reacts to the search query of the url instead. It takes a `key` and `value`
attributes instead of a `path`.

```html
<page-route-query key="tab" value="sample">
  sample tab content
</page-route-query>

<!-- use the "default" attribute to tell it 
to render content even if the key is not present -->
<page-route-query key="tab" value="sample" default="true">
    sample tab content
</page-route-query>

<!-- you may also pass down data -->
<page-route-query 
    key="tab"
    value="sample"
    src="./greeting.page.js" 
    data='{"greeting":"Hello World"}'
></page-route-query>
```

### `page-redirect`
The `page-redirect` lets you automatically redirect to a path if not a known one. You should place it 
after all `page-route` rendered on the page.


```html
<page-route path="/" src="./index.html"></page-route>
<page-route path="/contact" src="./contact.html"></page-route>
<page-route path="/about" src="./about.html"></page-route>
<!-- render it after all page-routes-->
<page-redirect to="/404"></page-redirect>


<page-route path="/project">
    ...
    <!--  when placed inside a page-route, it will redirect 
      whenever any unknown route starting with the parent page-route is detected -->
    <page-redirect to="/404"></page-redirect>
</page-route> 

```

### goToPage
Takes you to a new page pathname. It takes the path name, an optional data and a page title.
```ts
goToPage('/sample')
goToPage('/test', {sample: "value"}, 'test page')
```
### replacePage
Replaces the current page pathname. It takes the path name, an optional data and a page title.
```ts
replacePage('/new', {data: 3000}, 'new page')
```
### onPageChange
A listener for page changes. Takes a callback function that its called with the path name, a search query object literal, and any data set for the page.
```ts
onPageChange((pathName, searchQuery, data) => {
	...
})
```
### nextPage
Takes you to the next page.
```ts
nextPage()
```
### previousPage
Takes you to the previous page.
```ts
previousPage()
```
### getSearchQuery
Returns a object literal representation of the search query.
```ts
getSearchQuery()
```
### updateSearchQuery
Takes a object literal and updates the search query.
```ts
updateSearchQuery({
  date: "2020-01-01",
  sample: 30
})
```
### getPageData
Returns the data set for the page.
```ts
getPageData();
```

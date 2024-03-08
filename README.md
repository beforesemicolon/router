# Router

[![Static Badge](https://img.shields.io/badge/based_on-markup.beforesemicolon.com-blue)](https://markup.beforesemicolon.com)
[![Test](https://github.com/beforesemicolon/router/actions/workflows/test.yml/badge.svg)](https://github.com/beforesemicolon/router/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/%40beforesemicolon%2Frouter)](https://www.npmjs.com/package/@beforesemicolon/router)
![npm](https://img.shields.io/npm/l/%40beforesemicolon%2Frouter)

Web Component based router.

```html
<page-link path="/">Home</page-link>
<page-link path="/contact">Contact</page-link>

<with-route path="/">
    Home content
</with-route>

<with-route path="/contact">
    Contact content
</with-route>
```

## Install

```
npm install @beforesemicolon/router
```

In the browser

```html
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
and takes the same options.
```html
<page-link 
  path="/"
  title="Welcome"
  data='{"sample": "value"}'
>
  Home
</page-link>
```

### `with-route`
A component to conditionally render content based on the route.

The content can be provided as children content or loaded via the `src` attribute.

You can also set content inside with attribute of `loading` to show while
the content is being loaded or a `fallback` in case the content fails to load.
```html
<with-route path="/">
  Home content
</with-route>

<with-route path="/contact" src="/contact.html">
  <div slot="loading">Loading home content</div>
  <div slot="fallback">
    Fallback contact page content
  </div>
</with-route>
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
A listener for page changes. Takes a callback function that its called with the path name and a query search query object literal.
```ts
onPageChange((pathName, searchQuert) => {
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

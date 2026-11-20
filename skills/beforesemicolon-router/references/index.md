# Router offline reference

Complete public surface for `@beforesemicolon/router@1.5.0`. No web access required. These pages are generated from the same verified release records as the package index. Browse a section or search the symbol list.

[Practical workflows](workflows.md) · [Runnable offline examples](../examples/README.md) · [Skill entry](../SKILL.md)

## Record pages

- [page-route](apis/page-route.md): Render one view when the URL matches a path.
- [page-link](apis/page-link.md): Navigate with a real anchor and expose active state.
- [page-route-query](apis/page-route-query.md): Render a view for a matching query key and value.
- [page-data](apis/page-data.md): Render path parameters, search values, or navigation state.
- [page-redirect](apis/page-redirect.md): Redirect unknown URLs or choose a default child route.
- [goToPage / replacePage / history](apis/navigation.md): Navigate, replace a location, or move through browser history.
- [getPageParams / getSearchParams / getPageData](apis/route-state.md): Read active route parameters, query state, or navigation payload.
- [onPage / onPageChange / isOnPage](apis/subscriptions.md): Subscribe to matching routes or all resolved location changes.
- [registerRoute / getRouteMeta](apis/registration.md): Register a route or read its metadata; declarative routes register on mount.
- [registerGlobalGuard / registerRouteGuard](apis/guards.md): Accept, block, or redirect router navigation, with async support.
- [registerRouteModules / preloadRouteModule](apis/route-modules.md): Register lazy route modules for bundlers, resolve, or preload them.
- [pathStringToPattern / getPathMatchParams / hash helpers](apis/path-utils.md): Inspect and transform path patterns and hash paths in npm apps.
- [Status](apis/status.md): The emitted npm enum for page route loading state.

## Symbol locator

- [`getHashPath`](apis/path-utils.md)
- [`getHashPathname`](apis/path-utils.md)
- [`getHashSearch`](apis/path-utils.md)
- [`getPageData`](apis/route-state.md)
- [`getPageParams`](apis/route-state.md)
- [`getPathMatchParams`](apis/path-utils.md)
- [`getRouteMeta`](apis/registration.md)
- [`getRouteModule`](apis/route-modules.md)
- [`getRoutingMode`](apis/navigation.md)
- [`getSearchParams`](apis/route-state.md)
- [`goToPage`](apis/navigation.md)
- [`isOnPage`](apis/subscriptions.md)
- [`isRegisteredRoute`](apis/registration.md)
- [`KnownRoute`](apis/registration.md)
- [`nextPage`](apis/navigation.md)
- [`onPage`](apis/subscriptions.md)
- [`onPageChange`](apis/subscriptions.md)
- [`PageData`](apis/page-data.md)
- [`PageDataProps`](apis/page-data.md)
- [`PageLink`](apis/page-link.md)
- [`PageLinkProps`](apis/page-link.md)
- [`PageListener`](apis/subscriptions.md)
- [`PageLocation`](apis/subscriptions.md)
- [`PageRedirect`](apis/page-redirect.md)
- [`PageRedirectProps`](apis/page-redirect.md)
- [`PageRoute`](apis/page-route.md)
- [`PageRouteProps`](apis/page-route.md)
- [`PageRouteQuery`](apis/page-route-query.md)
- [`PageRouteQueryProps`](apis/page-route-query.md)
- [`parsePathname`](apis/route-state.md)
- [`PathChangeListener`](apis/subscriptions.md)
- [`pathnameToHash`](apis/path-utils.md)
- [`pathStringToPattern`](apis/path-utils.md)
- [`preloadRouteModule`](apis/route-modules.md)
- [`preloadRouteModules`](apis/route-modules.md)
- [`previousPage`](apis/navigation.md)
- [`registerGlobalGuard`](apis/guards.md)
- [`registerRoute`](apis/registration.md)
- [`registerRouteGuard`](apis/guards.md)
- [`registerRouteModules`](apis/route-modules.md)
- [`replacePage`](apis/navigation.md)
- [`resolveRouteModule`](apis/route-modules.md)
- [`RouteGuard`](apis/guards.md)
- [`RouteMeta`](apis/registration.md)
- [`RouteOptions`](apis/registration.md)
- [`RoutingMode`](apis/navigation.md)
- [`setRoutingMode`](apis/navigation.md)
- [`Status`](apis/status.md)
- [`updateSearchQuery`](apis/route-state.md)

## Public npm entry points

### `@beforesemicolon/router`

**Values:** [`Status`](apis/status.md), [`getHashPath`](apis/path-utils.md), [`getHashPathname`](apis/path-utils.md), [`getHashSearch`](apis/path-utils.md), [`getPageData`](apis/route-state.md), [`getPageParams`](apis/route-state.md), [`getPathMatchParams`](apis/path-utils.md), [`getRouteMeta`](apis/registration.md), [`getRouteModule`](apis/route-modules.md), [`getRoutingMode`](apis/navigation.md), [`getSearchParams`](apis/route-state.md), [`goToPage`](apis/navigation.md), [`isOnPage`](apis/subscriptions.md), [`isRegisteredRoute`](apis/registration.md), [`nextPage`](apis/navigation.md), [`onPage`](apis/subscriptions.md), [`onPageChange`](apis/subscriptions.md), [`parsePathname`](apis/route-state.md), [`pathStringToPattern`](apis/path-utils.md), [`pathnameToHash`](apis/path-utils.md), [`preloadRouteModule`](apis/route-modules.md), [`preloadRouteModules`](apis/route-modules.md), [`previousPage`](apis/navigation.md), [`registerGlobalGuard`](apis/guards.md), [`registerRoute`](apis/registration.md), [`registerRouteGuard`](apis/guards.md), [`registerRouteModules`](apis/route-modules.md), [`replacePage`](apis/navigation.md), [`resolveRouteModule`](apis/route-modules.md), [`setRoutingMode`](apis/navigation.md), [`updateSearchQuery`](apis/route-state.md)

**Types:** [`KnownRoute`](apis/registration.md), [`PageData`](apis/page-data.md), [`PageDataProps`](apis/page-data.md), [`PageLink`](apis/page-link.md), [`PageLinkProps`](apis/page-link.md), [`PageListener`](apis/subscriptions.md), [`PageLocation`](apis/subscriptions.md), [`PageRedirect`](apis/page-redirect.md), [`PageRedirectProps`](apis/page-redirect.md), [`PageRoute`](apis/page-route.md), [`PageRouteProps`](apis/page-route.md), [`PageRouteQuery`](apis/page-route-query.md), [`PageRouteQueryProps`](apis/page-route-query.md), [`PathChangeListener`](apis/subscriptions.md), [`RouteGuard`](apis/guards.md), [`RouteMeta`](apis/registration.md), [`RouteOptions`](apis/registration.md), [`RoutingMode`](apis/navigation.md)

## Classic browser script order

- `https://cdn.jsdelivr.net/npm/@beforesemicolon/web-component@1.22.0/dist/client.js`
- `https://cdn.jsdelivr.net/npm/@beforesemicolon/router@1.5.0/dist/client.js`

## Classic browser global members

- [`BFS.ROUTER.getPageData`](apis/route-state.md)
- [`BFS.ROUTER.getPageParams`](apis/route-state.md)
- [`BFS.ROUTER.getRouteMeta`](apis/registration.md)
- [`BFS.ROUTER.getRouteModule`](apis/route-modules.md)
- [`BFS.ROUTER.getRoutingMode`](apis/navigation.md)
- [`BFS.ROUTER.getSearchParams`](apis/route-state.md)
- [`BFS.ROUTER.goToPage`](apis/navigation.md)
- [`BFS.ROUTER.isOnPage`](apis/subscriptions.md)
- [`BFS.ROUTER.isRegisteredRoute`](apis/registration.md)
- [`BFS.ROUTER.nextPage`](apis/navigation.md)
- [`BFS.ROUTER.onPage`](apis/subscriptions.md)
- [`BFS.ROUTER.onPageChange`](apis/subscriptions.md)
- [`BFS.ROUTER.parsePathname`](apis/route-state.md)
- [`BFS.ROUTER.preloadRouteModule`](apis/route-modules.md)
- [`BFS.ROUTER.preloadRouteModules`](apis/route-modules.md)
- [`BFS.ROUTER.previousPage`](apis/navigation.md)
- [`BFS.ROUTER.registerGlobalGuard`](apis/guards.md)
- [`BFS.ROUTER.registerRoute`](apis/registration.md)
- [`BFS.ROUTER.registerRouteGuard`](apis/guards.md)
- [`BFS.ROUTER.registerRouteModules`](apis/route-modules.md)
- [`BFS.ROUTER.replacePage`](apis/navigation.md)
- [`BFS.ROUTER.resolveRouteModule`](apis/route-modules.md)
- [`BFS.ROUTER.setRoutingMode`](apis/navigation.md)
- [`BFS.ROUTER.updateSearchQuery`](apis/route-state.md)

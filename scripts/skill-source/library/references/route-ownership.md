# Route ownership in a growing application

[API reference](index.md) · [Core workflows](workflows.md) · [Working example](../examples/README.md#guarded-projects-with-lazy-modules)

Use these conventions when routes get deeper, an app has login or tenant scope,
or views have their own data. A small site does not need every layer.

| Owner                | Responsibility                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| App routing boundary | Canonical patterns and URL builders, mode, lazy entry point registry, guards, shared route fallbacks.               |
| Persistent shell     | Shared navigation and access-ready state. Owns the parent route; keeps it active for children with `exact="false"`. |
| Routed view          | Semantic view, loading/empty/error content, a subscription for the route it owns, and teardown.                     |
| Store/service        | Session/entity data, request/cache/invalidation, and authorization enforced by the server.                          |

Plan with the existing boundaries first. Find the current route, link builder,
loader, guard, and data owner. Extend them rather than adding a new router or
another copy of shared state. A sidebar can react to the URL immediately while a
child view loads; do not make the current-page marker wait for a fetch.

## Lazy code and data are independent

1. Keep the routing bootstrap small. Register real dynamic imports with
   `registerRouteModules` before connecting matching `page-route` elements.
   Use the identical registry key in the route's `src`. Do not import every
   page eagerly just to find its types, labels, or paths.
2. Give each route accessible `loading` and `fallback` slots. Those describe
   failure to load the **view**. Once its module is available, the view owns
   status for its own data. Cache the module separately from the record (which
   must be keyed by its real scope).
3. Fetch only the active view's data. Reuse the app's data store or service.
   `preloadRouteModule(key)` loads the module, not the entity and not the
   route guard. Use it on deliberate intent if it helps latency, catch its
   rejection, and never fetch protected data from module scope.
4. If the app uses Intl, its routing boundary can explicitly load the active
   page's messages as part of a route loader. Do not fetch every locale or
   embed the app's translation policy in Router. Do not let a slower response
   from an old locale overwrite the active one.

## Separate session readiness, permission, and entity data

Keep the shell in a pending state while the app determines whether it has a
session. Once it knows, install the authenticated/public surface or resolve an
asynchronous guard against the same shared readiness state, not a new session
request for every navigation. Treat resolution errors explicitly (report and
block or go to a safe error route); do not allow a view on an unknown result.

`registerRouteGuard(pattern, guard)` and `registerGlobalGuard(guard)` accept
`true` to allow, `false` to block, or a safe destination string to redirect.
Register at bootstrap, not per view mount. Do not redirect to a route blocked by
the same guard. Check direct loads and Back as well as clicks. Returning
`false` while handling Back can leave the browser at a URL that does not
represent the rendered page; redirect when that mismatch needs resolving.
In 1.5.0 do not infer the next full URL or use the guard's query argument for
authority: programmatic navigation supplies the current document query to the
guard before mutating history. Scope permission to the confirmed session and
entity, and always verify it on the server. A hidden link, protected client
route, or chunk that is not loaded is not a security boundary.

## Decide what belongs in each location

| Need                                                                               | Choose                                                                                        |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Entity or workspace identity, shareable child view                                 | Path parameter such as `/teams/:teamId/projects/:projectId`                                   |
| Shareable filter, search, or tab                                                   | URL query. In 1.5.0 choose history mode for built-in query views.                             |
| Optional notice or source hint on one history entry                                | `page-link.payload` property or the second argument to `goToPage`; check its shape and scope. |
| Entity, permission, draft, or data expected on reload without the initiating click | The store/service or explicit persistence.                                                    |

Read URL inputs through `onPage`, `getPageParams`, or `getSearchParams` as
applicable. A navigation payload is plain serializable history state; Back may
restore it. Direct links or a new tab may have no payload. Never use it as
proof of access or as the only copy of anything needed to reconstruct a view.
A narrow approach is to match a payload's entity ID against the active route
before using an optional display hint. Do not put secrets in the URL or
history.

Use link navigation for meaningful history steps. Use `updateSearchQuery`
when replacing a filter in place is intentional, and `replacePage` for a
redirect or a post-sign-in location that should not add a history entry.

## Protect a reused view from stale state

A page instance may see a new entity, query, scope, or permission without a
new mount. Listen with `onPage` or a central route adapter rather than reading
the pathname once. Start the load only after route and access are active.
Derive its key from the real inputs (for example, workspace ID, record ID, and
permission revision); skip unrelated query changes. On invalidation, clear or
hide old content immediately. Cancel the previous request if supported and
check its token or signal before committing results, even after response
parsing. Guard failure states with the same check. Return the Router
unsubscribe from the component's cleanup and invalidate pending work on
detach or when access is lost. Catch rejecting async work inside the callback
or its app-owned handler; a Router subscription is not a promise boundary.

## Verify the behavior

Test a protected deep link with no session, a session that is initializing,
and a signed-in user with no permission in the relevant scope. Confirm that no
protected endpoint was requested before access was known. With access, change
from one entity to another while delaying the first response. Only the
current entity may update the page. Use Back and reload; test missing payload,
the module fallback, and the data fallback separately. Verify the heading, URL,
and network requests, not just click handlers.

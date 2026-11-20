const n = (description, example) => ({ description, example })
const attrs = (values) => Object.fromEntries(values)
const params = [
    [
        'path',
        'Path to match or navigate to. A child route adds its local path to its parent path.',
    ],
    ['title', 'Optional page title to set during navigation.'],
    [
        'payload',
        'Navigation data as a JSON object in HTML. Use URL parameters for durable or shareable state.',
    ],
]
export const descriptions = {
    components: {
        'page-route': {
            behavior:
                'Defines route content. The router derives a full path from the closest parent route. Put one route-local heading inside it. Use slot content for synchronous markup, an imported component value for bundler-aware markup, or src for lazily loaded route content.',
            attributes: attrs([
                params[0],
                params[1],
                [
                    'src',
                    'A module key, JavaScript/TypeScript file, or fetchable HTML/text URL. Match a registry key exactly if using lazy modules.',
                ],
                [
                    'component',
                    'An imported Markup template, DOM node, trusted markup string, or callback passed as a value. Do not pass a component identifier as a literal HTML string.',
                ],
                [
                    'exact',
                    'Defaults to true. Use exact="false" on a parent layout so it remains active on child paths.',
                ],
                [
                    'name',
                    'Groups candidate routes that should not render together. Use a shared name for alternative matches.',
                ],
            ]),
            recipe: '<page-route path="/projects" exact="false"><page-route path="/settings"><h1>Settings</h1></page-route></page-route>',
        },
        'page-link': {
            behavior:
                'A history-mode navigation control that renders an anchor in its shadow root. The CSS part is anchor. The host reflects active state and emits an active event when that state changes; use the anchor slot for descriptive text.',
            attributes: attrs([
                ...params,
                [
                    'search',
                    'Query string, such as tab=members. Existing keys are replaced unless kept explicitly.',
                ],
                [
                    'keep-current-search',
                    'Retain current query values and merge the link query.',
                ],
                [
                    'exact',
                    'Choose exact rather than descendant active matching; defaults to true.',
                ],
            ]),
            recipe: '<page-link path="/projects/settings" search="tab=members">Project members</page-link>',
        },
        'page-route-query': {
            behavior:
                'Matches a query key/value in the active route. Pair with real navigable links or the query update API. Use history mode for built-in query matching in this version.',
            attributes: attrs([
                ['key', 'Query parameter name.'],
                [
                    'value',
                    'Expected value. Use plain string values such as activity or members.',
                ],
                [
                    'src',
                    'Optionally load the active panel from a route module or file.',
                ],
                ['name', 'Matching group for mutually exclusive panels.'],
            ]),
            recipe: '<page-link search="tab=activity">Activity</page-link><page-route-query key="tab" value="activity"><h2>Recent activity</h2></page-route-query>',
        },
        'page-data': {
            behavior:
                'Renders one selected route datum and updates on location changes. It checks param first, then search-param, then the navigation payload. Supply default slot content for empty data. Query reads use location.search on this release.',
            attributes: attrs([
                [
                    'param',
                    'Capture from a registered pathname pattern. Example: id from /projects/:id.',
                ],
                [
                    'search-param',
                    'Key in the URL search string, not the fragment query.',
                ],
                [
                    'key',
                    'Property path into transient navigation data. Use a valid dotted path and a fallback slot.',
                ],
            ]),
            recipe: '<page-route path="/projects/:id"><h1>Project <page-data param="id">unknown</page-data></h1></page-route>',
        },
        'page-redirect': {
            behavior:
                'Navigation without a user-visible control. The containing route limits where a local redirect can act. Use an existing destination and test that navigation does not repeat when Back returns to the source.',
            attributes: attrs([
                ...params,
                [
                    'type',
                    'unknown (default) redirects unregistered paths. always can select a default child when the containing route itself has no query or child path.',
                ],
            ]),
            recipe: '<page-route path="/404"><h1>Page not found</h1></page-route><page-redirect path="/404"></page-redirect>',
        },
    },
    symbols: {
        goToPage: n(
            'Push a location and optional object payload. Guards run before history changes; the promise resolves after the navigation is allowed, blocked, or redirected. Supply a slash-prefixed path with no hash prefix.',
            "await goToPage('/about', { from: 'home' }, 'About')"
        ),
        replacePage: n(
            'Replace the current entry, preserving prior history length. Use for a URL correction, not every user-initiated navigation.',
            "await replacePage('/projects', {}, 'Projects')"
        ),
        previousPage: n(
            'Go back through browser history. Wait for the location or view to change before asserting on the UI.',
            'previousPage()'
        ),
        nextPage: n('Go forward through browser history.', 'nextPage()'),
        setRoutingMode: n(
            'Select history or hash before mounting route elements. Use native anchors for hash mode in this release.',
            "setRoutingMode('hash')"
        ),
        getRoutingMode: n(
            'Read the selected mode. The initial mode is history.',
            'console.log(getRoutingMode())'
        ),
        getPageParams: n(
            'Read parameters from the first registered route matching the current normalized pathname. An unmatched route returns an empty object.',
            'const { id } = getPageParams()'
        ),
        getSearchParams: n(
            'Read and decode values from location.search. Raw values that cannot be parsed as JSON remain strings. A hash query is not read by this API on 1.5.0.',
            'const { tab } = getSearchParams()'
        ),
        getPageData: n(
            'Read object-valued navigation history state. It is not app storage and does not reconstruct data on a new deep link.',
            'const { from } = getPageData()'
        ),
        updateSearchQuery: n(
            'Update search values with replaceState. A null key value deletes that key; a null query clears all. Choose a link instead if every tab change must add a new history entry.',
            "updateSearchQuery({ tab: 'members', filter: null })"
        ),
        parsePathname: n(
            'Fill colon-marked path segments from the current URL by matching segment position. Use param lookup for custom URL construction.',
            "const href = parsePathname('/projects/:id/settings')"
        ),
        onPage: n(
            'Subscribe to one route pattern. Receives active state plus pathname, query, data, and params. Pass exact=false to match descendants. Returns an unsubscribe function.',
            "const stop = onPage('/projects/:id', (active, { params }) => { if (active) console.log(params.id) })\n// Call stop() when the view is destroyed."
        ),
        onPageChange: n(
            'Subscribe to resolved navigation across the app. Route-scoped listeners run first. Store and call the returned cleanup function.',
            'const stop = onPageChange((pathname, query, data) => console.log(pathname, query, data))\n// Call stop() on teardown.'
        ),
        isOnPage: n(
            'Compare a path pattern with the current URL. Supply false as the second argument to include descendant paths.',
            "const inProjects = isOnPage('/projects', false)"
        ),
        registerRoute: n(
            'Add a route pattern to the route registry; does not render a view. Page routes call this on mount. Register metadata via the options object when using it in app navigation.',
            "registerRoute('/projects/:id', { exact: true, meta: { breadcrumb: 'Project' } })"
        ),
        isRegisteredRoute: n(
            'Check whether the given location matches a registered pattern. Useful for unknown routes, not a permission check.',
            "if (!isRegisteredRoute('/missing')) console.log('Unknown route')"
        ),
        getRouteMeta: n(
            'Read metadata by the exact registered pathname key, often the pattern rather than a concrete URL.',
            "const title = getRouteMeta('/projects/:id')?.title"
        ),
        registerGlobalGuard: n(
            'Register a guard for all navigations. Call once during bootstrap. Return true, false, or a redirect path; each may be asynchronous.',
            "registerGlobalGuard((path) => path === '/obsolete' ? '/archive' : true)"
        ),
        registerRouteGuard: n(
            'Register a guard for a route pattern. Keep the destination outside the blocked pattern to avoid redirect loops.',
            "registerRouteGuard('/retired', () => '/archive')"
        ),
        registerRouteModules: n(
            'Associate exact src keys with asynchronous importers. Match relative paths exactly, including the file extension.',
            "registerRouteModules({ './views/projects.js': async () => ({ default: '<h1>Projects</h1>' }) })"
        ),
        getRouteModule: n(
            'Return the registered asynchronous loader without running it, or undefined if none exists.',
            "const loader = getRouteModule('./views/projects.js')"
        ),
        resolveRouteModule: n(
            'Run and cache a registered module loader. Concurrent calls for the same key share a pending promise. Returns the default export when present.',
            "const result = await resolveRouteModule('./views/projects.js')"
        ),
        preloadRouteModule: n(
            'Resolve one registered module in advance. This does not navigate or mount the route.',
            "await preloadRouteModule('./views/projects.js')"
        ),
        preloadRouteModules: n(
            'Resolve a set of registered module keys in parallel. Preload only likely next pages rather than the entire app.',
            "await preloadRouteModules(['./views/projects.js', './views/about.js'])"
        ),
        pathStringToPattern: n(
            'Compile a slash path into a regular expression for a path match. Use exact=false to allow a descendant match.',
            "const pattern = pathStringToPattern('/projects/:id')"
        ),
        getPathMatchParams: n(
            'Read named captures from a matching URL and compiled pattern. Returns null on a non-match.',
            "const params = getPathMatchParams('/projects/42', pathStringToPattern('/projects/:id'))"
        ),
        getHashPathname: n(
            'Extract the pathname portion of the URL fragment. Returns slash for an empty hash.',
            'console.log(getHashPathname())'
        ),
        getHashSearch: n(
            'Extract the fragment query, including its leading question mark when present.',
            'const params = new URLSearchParams(getHashSearch())'
        ),
        getHashPath: n(
            'Return the fragment path plus query without the hash marker.',
            'console.log(getHashPath())'
        ),
        pathnameToHash: n(
            'Prefix a plain path with a hash marker and required slash. Do not pass a path already containing the hash marker.',
            "const href = pathnameToHash('/about')"
        ),
        Status: n(
            'The npm enum has Idle, Loading, Loaded, and LoadingFailed. For user-facing behavior, expose loading and fallback slots rather than depending on internal component state.',
            'console.log(Status.Loaded)'
        ),
    },
    types: {
        RoutingMode:
            'Use history for server-fallback apps and hash for plain static hosting. The chosen mode changes how paths are read and written.',
        RouteGuard:
            'Return an internal destination path for redirects; a guard controls navigation, not API access.',
        PageLocation:
            'Data given to a route listener after matching. The params belong to the subscribed pattern.',
        RouteMeta:
            'Use optional labels or app-specific metadata on registered routes. The router does not make authorization decisions from metadata itself.',
    },
    records: {
        'path-utils': {
            context:
                'These helpers are useful when adapting legacy URL code. The npm package is a browser router and its root is not a Node-only utility package.',
        },
        'page-route': {
            context:
                'For lazy route failure, use <p slot="fallback">Could not load this page.</p> inside the route. A retry can happen after the route deactivates and is opened again.',
        },
    },
}

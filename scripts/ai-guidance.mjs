const root = '@beforesemicolon/router'
const html = (view) => ({ example: view })
const example = ({ scripts }) => `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Two views</title>
${scripts.map((url) => `    <script src="${url}"></script>`).join('\n')}
    <script>BFS.ROUTER.setRoutingMode('hash')</script>
</head>
<body>
    <nav aria-label="Main">
        <page-link path="/">Home</page-link>
        <page-link path="/about">About</page-link>
    </nav>
    <main>
        <page-route path="/"><h1>Home</h1></page-route>
        <page-route path="/about"><h1>About</h1></page-route>
    </main>
</body>
</html>
`
const code = (names, body, classicBody) => ({
    npm: {
        names,
        example: `import { ${names.join(', ')} } from '${root}'\n\n${body}`,
    },
    classic: { example: classicBody },
})
const component = (
    slug,
    summary,
    keywords,
    attributes,
    exampleHTML,
    extra = {}
) => ({
    id: slug,
    name: slug,
    doc: `documentation/web-components/${slug}`,
    component: slug,
    summary,
    keywords,
    attributes,
    npm: {
        example: `// Register in the app entry: import '${root}'\n// In the HTML:\n${exampleHTML}`,
    },
    classic: html(exampleHTML),
    ...extra,
})
export const records = [
    component(
        'page-route',
        'Render one view when the URL matches a path.',
        [
            'views',
            'two views',
            'routes',
            'nested',
            'single page',
            'spa',
            'back',
        ],
        ['path', 'exact', 'component', 'src', 'name', 'title'],
        '<page-route path="/about"><h1>About</h1></page-route>',
        {
            slots: ['default', 'loading', 'fallback', 'hidden'],
            typeNames: ['PageRoute', 'PageRouteProps'],
            notes: [
                'Choose hash mode before mounting routes in static apps; use history mode only when deep links have a server fallback.',
                'Add exact="false" to a parent route to match descendant paths. Child paths extend the parent pattern.',
                'Use the component property for an imported view or function. Use src for a file URL or registered module key.',
                'Inactive route content is detached and may be cached and remounted on revisit. Test component lifecycle on Back.',
            ],
            examplePaths: { classic: { path: 'examples/two-views.html' } },
            classic: {},
            files: { 'examples/two-views.html': example },
            related: ['router/page-link', 'router/navigation'],
        }
    ),
    component(
        'page-link',
        'Navigate with a real anchor and expose active state.',
        ['anchor', 'link', 'navigation', 'menu', 'tab'],
        ['path', 'search', 'keep-current-search', 'title', 'payload', 'exact'],
        '<page-link path="/about">About</page-link>',
        {
            slots: ['default'],
            typeNames: ['PageLink', 'PageLinkProps'],
            events: {
                active: {
                    detail: '{ value: boolean }',
                    description: 'Fires when the link active state changes.',
                },
            },
            properties: { fullPath: '() => string' },
            notes: [
                'Use descriptive text for the anchor. The anchor is exposed as CSS part anchor.',
                'Use $ for nearest route path and ~ for current path; omit path to change query on the current view.',
                'The active marker is reflected by the component; do not set it to navigate.',
            ],
            related: ['router/page-route', 'router/route-state'],
        }
    ),
    component(
        'page-route-query',
        'Render a view for a matching query key and value.',
        ['query', 'tab', 'view', 'url state'],
        ['key', 'value', 'src', 'name'],
        '<page-route-query key="tab" value="profile"><h2>Profile</h2></page-route-query>',
        {
            typeNames: ['PageRouteQuery', 'PageRouteQueryProps'],
            slots: ['default', 'loading', 'fallback', 'hidden'],
            notes: [
                'Keep shareable tab and filter state in the URL. Pair key and value with the search string on page-link.',
            ],
            related: ['router/page-link', 'router/route-state'],
        }
    ),
    component(
        'page-data',
        'Render path parameters, search values, or navigation state.',
        ['url param', 'query', 'payload', 'dynamic route'],
        ['param', 'search-param', 'key'],
        '<page-data search-param="tab">overview</page-data>',
        {
            typeNames: ['PageData', 'PageDataProps'],
            slots: ['default'],
            notes: [
                'Use param for a path parameter, search-param for a query key, or key for a navigation payload path. Omitted data uses slot content.',
            ],
            related: ['router/route-state'],
        }
    ),
    component(
        'page-redirect',
        'Redirect unknown URLs or choose a default child route.',
        ['redirect', 'not found', 'default', '404'],
        ['path', 'title', 'payload', 'type'],
        '<page-redirect path="/404"></page-redirect>',
        {
            typeNames: ['PageRedirect', 'PageRedirectProps'],
            notes: [
                'Pair a fallback redirect with a registered destination route. Use type="always" and a parent-relative path for a default child.',
            ],
        }
    ),
    {
        id: 'navigation',
        name: 'goToPage / replacePage / history',
        summary:
            'Navigate, replace a location, or move through browser history.',
        keywords: [
            'navigate',
            'back',
            'forward',
            'history',
            'go',
            'route',
            'hash',
            'url',
        ],
        doc: 'documentation/routing-apis/navigation',
        typeNames: ['RoutingMode'],
        ...code(
            [
                'goToPage',
                'replacePage',
                'previousPage',
                'nextPage',
                'setRoutingMode',
                'getRoutingMode',
            ],
            `setRoutingMode('hash')\nawait goToPage('/about', { from: 'home' }, 'About')`,
            `BFS.ROUTER.setRoutingMode('hash')\nawait BFS.ROUTER.goToPage('/about')`
        ),
        notes: [
            'Use page-link instead of a JavaScript handler for normal navigation.',
            'Use goToPage to push a history entry; replacePage changes the current entry. Set mode before creating the UI.',
        ],
        related: ['router/page-route', 'router/page-link'],
    },
    {
        id: 'route-state',
        name: 'getPageParams / getSearchParams / getPageData',
        summary:
            'Read active route parameters, query state, or navigation payload.',
        keywords: [
            'query',
            'url state',
            'parameter',
            'payload',
            'route',
            'update search',
        ],
        doc: 'documentation/routing-apis/params-queries',
        ...code(
            [
                'getPageParams',
                'getSearchParams',
                'getPageData',
                'updateSearchQuery',
                'parsePathname',
            ],
            `updateSearchQuery({ tab: 'profile' })\nconsole.log(getPageParams(), getPageData())`,
            `BFS.ROUTER.updateSearchQuery({ tab: 'profile' })`
        ),
        notes: [
            'getSearchParams reads location.search. In hash mode, use onPage location.query where verified or parse getHashSearch in npm mode; do not read the HTML document search as route state.',
        ],
        related: [
            'router/page-data',
            'router/page-route-query',
            'router/subscriptions',
        ],
    },
    {
        id: 'subscriptions',
        name: 'onPage / onPageChange / isOnPage',
        summary:
            'Subscribe to matching routes or all resolved location changes.',
        keywords: [
            'subscribe',
            'observe',
            'page change',
            'route listener',
            'cleanup',
            'active',
        ],
        doc: 'documentation/routing-apis/subscribing',
        typeNames: ['PageListener', 'PageLocation', 'PathChangeListener'],
        ...code(
            ['onPage', 'onPageChange', 'isOnPage'],
            `const stop = onPage('/about', (active, { pathname }) => {\n    if (active) console.log(pathname)\n})\n// Call stop() on teardown.`,
            `const stop = BFS.ROUTER.onPageChange((pathname) => console.log(pathname))`
        ),
        notes: [
            'Keep the unsubscribe function and call it on teardown. Use onPage when only one route matters.',
            'Window router:change has detail { pathname, query, data }.',
        ],
    },
    {
        id: 'registration',
        name: 'registerRoute / getRouteMeta',
        summary:
            'Register a route or read its metadata; declarative routes register on mount.',
        keywords: ['register', 'route', 'metadata', 'title', 'breadcrumb'],
        doc: 'documentation/routing-apis/registration',
        typeNames: ['KnownRoute', 'RouteMeta', 'RouteOptions'],
        ...code(
            ['registerRoute', 'isRegisteredRoute', 'getRouteMeta'],
            `registerRoute('/about', { meta: { title: 'About' } })\nconsole.log(getRouteMeta('/about'))`,
            `BFS.ROUTER.registerRoute('/about', { meta: { title: 'About' } })`
        ),
    },
    {
        id: 'guards',
        name: 'registerGlobalGuard / registerRouteGuard',
        summary:
            'Accept, block, or redirect router navigation, with async support.',
        keywords: ['guard', 'block', 'redirect', 'before route'],
        doc: 'documentation/advanced-features/route-guards',
        typeNames: ['RouteGuard'],
        ...code(
            ['registerGlobalGuard', 'registerRouteGuard'],
            `registerRouteGuard('/retired', () => '/archive')`,
            `BFS.ROUTER.registerRouteGuard('/retired', () => '/archive')`
        ),
        notes: [
            'Return true to allow, false to block, or an internal path to redirect. UI guards do not replace server-side authorization.',
        ],
    },
    {
        id: 'route-modules',
        name: 'registerRouteModules / preloadRouteModule',
        summary:
            'Register lazy route modules for bundlers, resolve, or preload them.',
        keywords: [
            'lazy',
            'module',
            'load',
            'preload',
            'code splitting',
            'vite',
            'bundle',
        ],
        doc: 'documentation/advanced-features/module-registry',
        ...code(
            [
                'registerRouteModules',
                'getRouteModule',
                'resolveRouteModule',
                'preloadRouteModule',
                'preloadRouteModules',
            ],
            `registerRouteModules({ './about.js': () => Promise.resolve({ default: '<h1>About</h1>' }) })\nawait preloadRouteModule('./about.js')`,
            `BFS.ROUTER.registerRouteModules({ './about.js': () => Promise.resolve({ default: '<h1>About</h1>' }) })`
        ),
    },
    {
        id: 'path-utils',
        name: 'pathStringToPattern / getPathMatchParams / hash helpers',
        summary:
            'Inspect and transform path patterns and hash paths in npm apps.',
        keywords: [
            'pattern',
            'path',
            'match',
            'hash',
            'search',
            'params',
            'npm',
        ],
        doc: 'documentation/advanced-features/hash-routing',
        ...code(
            [
                'pathStringToPattern',
                'getPathMatchParams',
                'getHashPathname',
                'getHashSearch',
                'getHashPath',
                'pathnameToHash',
            ],
            `console.log(getPathMatchParams('/team/42', pathStringToPattern('/team/:id')))`
        ),
        notes: [
            'These helpers are not properties of BFS.ROUTER. Use supported browser navigation and subscriptions instead.',
        ],
    },
    {
        id: 'status',
        name: 'Status',
        summary: 'The emitted npm enum for page route loading state.',
        keywords: ['status', 'state', 'loading', 'failed', 'enum'],
        doc: 'documentation/web-components/page-route',
        ...code(['Status'], 'console.log(Status.Loaded)'),
        notes: [
            'Use loading and fallback slots in page markup. Status is not exposed in the classic global.',
        ],
        related: ['router/page-route'],
    },
]

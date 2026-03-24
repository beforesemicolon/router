import {
    PageListener,
    PathChangeListener,
    RouteGuard,
    RouteMeta,
    RouteOptions,
    RoutingMode,
} from './types'
import { cleanPathnameOptionalEnding } from './utils/clean-pathname-optional-ending'
import { getPathMatchParams } from './utils/get-path-match-params'
import { getSearchParams } from './utils/get-search-params'
import {
    getHashPathname,
    getHashSearch,
    pathnameToHash,
} from './utils/hash-routing'
import { isObjectLiteral } from './utils/is-object-literal'
import { jsonStringify } from './utils/json-stringify'
import { pathStringToPattern } from './utils/path-string-to-pattern'

// Routing mode (default: history)
let routingMode: RoutingMode = 'history'

// Route module registry for build-time optimization
const routeModules: Map<string, () => Promise<unknown>> = new Map()
const routeModuleCache: Map<string, unknown> = new Map()
const routeModulePending: Map<string, Promise<unknown>> = new Map()

// Route guards
const routeGuards: Map<string, RouteGuard[]> = new Map()
const globalGuards: RouteGuard[] = []

// Route metadata
const routeMetadata: Map<string, RouteMeta> = new Map()

const routeListeners: Set<PathChangeListener> = new Set()
const pageListeners: Set<{
    pathname: string
    exact: boolean
    callback: PageListener
    lastActive?: boolean
}> = new Set()
let currentLocationGuardCheck: Promise<{
    pathname: string
    query: Record<string, string>
    data: Record<string, unknown>
} | null> | null = null
let hasResolvedCurrentLocation = false

const hasRegisteredGuards = () =>
    globalGuards.length > 0 || routeGuards.size > 0

const getCurrentLocationSnapshot = () => ({
    pathname: getCurrentPathname(),
    query: getSearchParams() as Record<string, string>,
    data: getPageData(),
})

/**
 * Get current pathname based on routing mode
 */
const getCurrentPathname = (): string => {
    if (routingMode === 'hash') {
        return getHashPathname()
    }
    return cleanPathnameOptionalEnding(location.pathname)
}

/**
 * Get current search query based on routing mode
 */
const getCurrentSearch = (): string => {
    if (routingMode === 'hash') {
        return getHashSearch()
    }
    return location.search
}

const notifyRouteListeners = (
    pathname: string,
    query: Record<string, string>,
    data: Record<string, unknown>
) => {
    routeListeners.forEach((cb) => {
        cb(pathname, query, data)
    })

    // Dispatch route change event
    window.dispatchEvent(
        new CustomEvent('router:change', {
            detail: { pathname, query, data },
        })
    )
}

const matchPageSubscription = (
    pathnamePattern: string,
    exact: boolean,
    location: {
        pathname: string
        query: Record<string, string>
        data: Record<string, unknown>
    }
) => {
    const url = new URL(pathnamePattern, globalThis.location.origin)
    const params = getPathMatchParams(
        location.pathname,
        pathStringToPattern(url.pathname, exact)
    )

    if (params === null) {
        return {
            active: false,
            params: {},
        }
    }

    if (url.search) {
        const targetSearch = new URLSearchParams(url.search)
        const matchesSearch = Array.from(targetSearch.entries()).every(
            ([key, value]) => location.query[key] === value
        )

        if (!matchesSearch) {
            return {
                active: false,
                params: {},
            }
        }
    }

    return {
        active: true,
        params,
    }
}

const notifyPageListeners = (location: {
    pathname: string
    query: Record<string, string>
    data: Record<string, unknown>
}) => {
    pageListeners.forEach((subscription) => {
        const match = matchPageSubscription(
            subscription.pathname,
            subscription.exact,
            location
        )
        const shouldNotify =
            subscription.lastActive === undefined ||
            match.active ||
            match.active !== subscription.lastActive

        subscription.lastActive = match.active

        if (!shouldNotify) {
            return
        }

        subscription.callback(match.active, {
            pathname: location.pathname,
            query: location.query,
            data: location.data,
            params: match.params,
        })
    })
}

const emitLocation = (location: {
    pathname: string
    query: Record<string, string>
    data: Record<string, unknown>
}) => {
    hasResolvedCurrentLocation = true
    notifyPageListeners(location)
    notifyRouteListeners(location.pathname, location.query, location.data)
}

const checkCurrentLocationGuards = async () => {
    const { pathname, query, data } = getCurrentLocationSnapshot()
    const guardResult = await checkGuards(pathname, query, data)

    if (!guardResult.allowed) {
        if (guardResult.redirect) {
            const currentLocation = pathname + getCurrentSearch()
            if (guardResult.redirect !== currentLocation) {
                await replacePage(guardResult.redirect, data, document.title)
            }
        }

        return null
    }

    return { pathname, query, data }
}

const resolveCurrentLocationGuards = () => {
    if (!currentLocationGuardCheck) {
        currentLocationGuardCheck = checkCurrentLocationGuards().finally(() => {
            currentLocationGuardCheck = null
        })
    }

    return currentLocationGuardCheck
}

const broadcast = () => {
    emitLocation(getCurrentLocationSnapshot())
}

const broadcastCurrentLocation = async () => {
    const currentLocation = await resolveCurrentLocationGuards()

    if (!currentLocation) {
        return
    }

    emitLocation(currentLocation)
}

// Listen to hash changes for hash routing mode
window.addEventListener('hashchange', () => {
    if (routingMode === 'hash') {
        if (hasRegisteredGuards()) {
            void broadcastCurrentLocation()
            return
        }

        broadcast()
    }
})

window.addEventListener('popstate', () => {
    if (hasRegisteredGuards()) {
        void broadcastCurrentLocation()
        return
    }

    broadcast()
})

/**
 * Set routing mode (history or hash)
 */
export const setRoutingMode = (mode: RoutingMode) => {
    routingMode = mode
}

/**
 * Get current routing mode
 */
export const getRoutingMode = (): RoutingMode => {
    return routingMode
}

/**
 * Register route modules for build-time optimization
 * Users can pass modules from import.meta.glob() or require.context()
 */
export const registerRouteModules = (
    modules: Record<string, () => Promise<unknown>>
) => {
    Object.entries(modules).forEach(([path, loader]) => {
        routeModules.set(path, loader)
    })
}

/**
 * Get route module loader if registered
 */
export const getRouteModule = (
    path: string
): (() => Promise<unknown>) | undefined => {
    return routeModules.get(path)
}

export const resolveRouteModule = async (
    path: string
): Promise<unknown | undefined> => {
    if (!routeModules.has(path)) {
        return undefined
    }

    if (routeModuleCache.has(path)) {
        return routeModuleCache.get(path)
    }

    if (!routeModulePending.has(path)) {
        routeModulePending.set(
            path,
            routeModules.get(path)!()
                .then((moduleResult) => {
                    const resolvedContent =
                        (moduleResult as { default?: unknown })?.default ??
                        moduleResult
                    routeModuleCache.set(path, resolvedContent)
                    return resolvedContent
                })
                .finally(() => {
                    routeModulePending.delete(path)
                })
        )
    }

    return routeModulePending.get(path)
}

export const preloadRouteModule = async (path: string): Promise<void> => {
    await resolveRouteModule(path)
}

export const preloadRouteModules = async (paths: string[]): Promise<void> => {
    await Promise.all(paths.map((path) => preloadRouteModule(path)))
}

/**
 * Register a route guard
 * @param pathname Route pathname pattern (use '*' for all routes)
 * @param guard Guard function that returns boolean, string (redirect), or Promise
 */
export const registerRouteGuard = (pathname: string, guard: RouteGuard) => {
    hasResolvedCurrentLocation = false
    if (!routeGuards.has(pathname)) {
        routeGuards.set(pathname, [])
    }
    routeGuards.get(pathname)!.push(guard)
}

/**
 * Register a global guard that runs for all routes
 */
export const registerGlobalGuard = (guard: RouteGuard) => {
    hasResolvedCurrentLocation = false
    globalGuards.push(guard)
}

/**
 * Check route guards before navigation
 */
const checkGuards = async (
    pathname: string,
    query: Record<string, unknown>,
    data: Record<string, unknown>
): Promise<{ allowed: boolean; redirect?: string }> => {
    // Combine global guards from both sources
    const allGlobalGuards = [...globalGuards, ...(routeGuards.get('*') || [])]

    // Check global guards first
    for (const guard of allGlobalGuards) {
        const result = await guard(pathname, query, data)
        if (typeof result === 'string') {
            return { allowed: false, redirect: result }
        }
        if (result === false) {
            return { allowed: false }
        }
    }

    // Check route-specific guards with pattern matching support
    for (const [pattern, guards] of routeGuards.entries()) {
        if (pattern === '*') continue

        const isMatch =
            pattern === pathname ||
            !!getPathMatchParams(pathname, pathStringToPattern(pattern, true))

        if (isMatch) {
            for (const guard of guards) {
                const result = await guard(pathname, query, data)
                if (typeof result === 'string') {
                    return { allowed: false, redirect: result }
                }
                if (result === false) {
                    return { allowed: false }
                }
            }
        }
    }

    return { allowed: true }
}

export const onPageChange = (sub: PathChangeListener) => {
    routeListeners.add(sub)

    if (hasResolvedCurrentLocation || !hasRegisteredGuards()) {
        const currentLocation = getCurrentLocationSnapshot()
        sub(
            currentLocation.pathname,
            currentLocation.query,
            currentLocation.data
        )

        return () => {
            routeListeners.delete(sub)
        }
    }

    void (async () => {
        const currentLocation = await resolveCurrentLocationGuards()

        if (!currentLocation || !routeListeners.has(sub)) {
            return
        }

        sub(
            currentLocation.pathname,
            currentLocation.query,
            currentLocation.data
        )
    })()

    return () => {
        routeListeners.delete(sub)
    }
}

export const onPage = (pathname: string, sub: PageListener, exact = true) => {
    const subscription: {
        pathname: string
        exact: boolean
        callback: PageListener
        lastActive?: boolean
    } = {
        pathname,
        exact,
        callback: sub,
    }

    pageListeners.add(subscription)

    if (hasResolvedCurrentLocation || !hasRegisteredGuards()) {
        const currentLocation = getCurrentLocationSnapshot()
        const match = matchPageSubscription(pathname, exact, currentLocation)
        subscription.lastActive = match.active
        sub(match.active, {
            pathname: currentLocation.pathname,
            query: currentLocation.query,
            data: currentLocation.data,
            params: match.params,
        })
    } else {
        void resolveCurrentLocationGuards().then((currentLocation) => {
            if (!currentLocation || !pageListeners.has(subscription)) {
                return
            }

            const match = matchPageSubscription(
                pathname,
                exact,
                currentLocation
            )
            subscription.lastActive = match.active
            sub(match.active, {
                pathname: currentLocation.pathname,
                query: currentLocation.query,
                data: currentLocation.data,
                params: match.params,
            })
        })
    }

    return () => {
        pageListeners.delete(subscription)
    }
}

export const goToPage = async (
    pathname: string,
    state: Record<string, unknown> = {},
    title = document.title
): Promise<void> => {
    if (!isObjectLiteral(state))
        throw new Error(
            `goToPage: provided data is not an object literal: ${state}`
        )

    // Check guards before navigation
    const query = getSearchParams()
    const guardResult = await checkGuards(pathname, query, state)

    if (!guardResult.allowed) {
        if (guardResult.redirect) {
            // Redirect to the path returned by guard
            return goToPage(guardResult.redirect, state, title)
        }
        // Navigation blocked
        return
    }

    if (routingMode === 'hash') {
        window.history.pushState(state, title, pathnameToHash(pathname))
    } else {
        window.history.pushState(state, title, pathname)
    }

    if (title !== document.title) {
        document.title = title
    }

    broadcast()
}

export const replacePage = async (
    pathname: string,
    state: Record<string, unknown> = {},
    title = document.title
): Promise<void> => {
    if (!isObjectLiteral(state))
        throw new Error(
            `replacePage: provided data is not an object literal: ${state}`
        )

    // Check guards before navigation
    const query = getSearchParams()
    const guardResult = await checkGuards(pathname, query, state)

    if (!guardResult.allowed) {
        if (guardResult.redirect) {
            // Redirect to the path returned by guard
            return replacePage(guardResult.redirect, state, title)
        }
        // Navigation blocked
        return
    }

    if (routingMode === 'hash') {
        window.history.replaceState(state, title, pathnameToHash(pathname))
    } else {
        window.history.replaceState(state, title, pathname)
    }

    if (title !== document.title) {
        document.title = title
    }

    broadcast()
}

export const previousPage = () => {
    window.history.back()
}

export const nextPage = () => {
    window.history.forward()
}

export const getPageData = <T extends Record<string, unknown>>(): T => {
    return (isObjectLiteral(history.state) ? history.state : {}) as T
}

export const updateSearchQuery = (query: Record<string, unknown> | null) => {
    const pathname = getCurrentPathname()

    if (query === null) {
        if (routingMode === 'hash') {
            window.history.replaceState(
                history.state,
                document.title,
                pathnameToHash(pathname)
            )
        } else {
            window.history.replaceState(history.state, document.title, pathname)
        }
    } else {
        const searchParams = new URLSearchParams(
            getCurrentSearch().substring(1)
        )

        for (const queryKey in query) {
            const val = query[queryKey]
            if (val === null) {
                searchParams.delete(queryKey)
            } else {
                searchParams.set(queryKey, jsonStringify(val))
            }
        }

        const search = searchParams.toString()
        const fullPath = pathname + (search ? `?${search}` : '')

        if (routingMode === 'hash') {
            window.history.replaceState(
                history.state,
                document.title,
                pathnameToHash(fullPath)
            )
        } else {
            window.history.replaceState(history.state, document.title, fullPath)
        }
    }

    broadcast()
}

const knownRoutes: Map<
    string,
    { pathname: string; exact: boolean; meta?: RouteMeta }
> = new Map()

export const registerRoute = (
    pathname: string,
    exactOrOptions: boolean | RouteOptions = true
) => {
    const options: RouteOptions =
        typeof exactOrOptions === 'boolean'
            ? { exact: exactOrOptions }
            : exactOrOptions

    const exact = options.exact ?? true

    knownRoutes.set(pathname, {
        pathname,
        exact,
        meta: options.meta,
    })

    // Store metadata separately for easy access
    if (options.meta) {
        routeMetadata.set(pathname, options.meta)
    }
}

/**
 * Get route metadata
 */
export const getRouteMeta = (pathname: string): RouteMeta | undefined => {
    return routeMetadata.get(pathname)
}

export const isRegisteredRoute = (pathname: string) =>
    Array.from(knownRoutes.values()).some((p) => {
        return Boolean(
            getPathMatchParams(pathname, pathStringToPattern(p.pathname))
        )
    })

export const getPageParams = <T extends Record<string, string>>(): T => {
    const currentPathname = getCurrentPathname()

    for (const p of knownRoutes.values()) {
        const params = getPathMatchParams<T>(
            currentPathname,
            pathStringToPattern(p.pathname)
        )

        if (params) return params
    }

    return {} as T
}

export const parsePathname = (pathnamePattern: string) => {
    const currentPathname = getCurrentPathname()
    const currentPathnameParts = currentPathname.split('/')
    return pathnamePattern
        .split('/')
        .map((p, i) => (/:.+/.test(p) ? currentPathnameParts[i] : p))
        .join('/')
}

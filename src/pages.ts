import {
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

// Route guards
const routeGuards: Map<string, RouteGuard[]> = new Map()
const globalGuards: RouteGuard[] = []

// Route metadata
const routeMetadata: Map<string, RouteMeta> = new Map()

const routeListeners: Set<PathChangeListener> = new Set()

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

const broadcast = () => {
    const pathname = getCurrentPathname()
    const query = getSearchParams()
    const data = getPageData()

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

// Listen to hash changes for hash routing mode
window.addEventListener('hashchange', () => {
    if (routingMode === 'hash') {
        broadcast()
    }
})

window.addEventListener('popstate', () => {
    broadcast()
})

/**
 * Set routing mode (history or hash)
 */
export const setRoutingMode = (mode: RoutingMode) => {
    routingMode = mode
    // Trigger broadcast to update all listeners
    broadcast()
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

/**
 * Register a route guard
 * @param pathname Route pathname pattern (use '*' for all routes)
 * @param guard Guard function that returns boolean, string (redirect), or Promise
 */
export const registerRouteGuard = (pathname: string, guard: RouteGuard) => {
    if (!routeGuards.has(pathname)) {
        routeGuards.set(pathname, [])
    }
    routeGuards.get(pathname)!.push(guard)
}

/**
 * Register a global guard that runs for all routes
 */
export const registerGlobalGuard = (guard: RouteGuard) => {
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
    sub(getCurrentPathname(), getSearchParams(), getPageData())

    return () => {
        routeListeners.delete(sub)
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
    return history.state
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

    // Trigger broadcast asynchronously to avoid synchronous recursion during mounting,
    // allowing listeners to re-evaluate params/active state with the newly registered route.
    queueMicrotask(() => {
        broadcast()
    })
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

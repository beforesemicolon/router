import { getSearchParams } from './utils/get-search-params'
import { jsonStringify } from './utils/json-stringify'
import { cleanPathnameOptionalEnding } from './utils/clean-pathname-optional-ending'
import { PathChangeListener } from './types'
import { getPathMatchParams } from './utils/get-path-match-params'
import { pathStringToPattern } from './utils/path-string-to-pattern'

const routeListeners: Set<PathChangeListener> = new Set()

const broadcast = () => {
    routeListeners.forEach((cb) => {
        cb(
            cleanPathnameOptionalEnding(location.pathname),
            getSearchParams(),
            getPageData()
        )
    })
}

window.addEventListener('popstate', () => {
    broadcast()
})

export const onPageChange = (sub: PathChangeListener) => {
    routeListeners.add(sub)
    sub(
        cleanPathnameOptionalEnding(location.pathname),
        getSearchParams(),
        getPageData()
    )

    return () => {
        routeListeners.delete(sub)
    }
}

export const goToPage = (
    pathname: string,
    data: Record<string, unknown> = {},
    title = document.title
) => {
    window.history.pushState(data, title, pathname)

    if (title !== document.title) {
        document.title = title
    }

    broadcast()
}

export const replacePage = (
    pathname: string,
    state: Record<string, unknown> = {},
    title = document.title
) => {
    window.history.replaceState(state, title, pathname)

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
    return window.history.state
}

export const updateSearchQuery = (query: Record<string, unknown> | null) => {
    if (query === null) {
        window.history.replaceState(
            history.state,
            document.title,
            location.pathname
        )
    } else {
        const searchParams = new URLSearchParams(window.location.search)

        for (const queryKey in query) {
            const val = query[queryKey]
            if (val) {
                searchParams.set(queryKey, jsonStringify(query[queryKey]))
            }
        }

        window.history.replaceState(
            history.state,
            document.title,
            location.pathname + `?${searchParams.toString()}`
        )
    }

    broadcast()
}

const knownRoutes: Map<string, { pathname: string; exact: boolean }> = new Map()

export const registerRoute = (pathname: string, exact = false) => {
    knownRoutes.set(pathname, { pathname, exact })
}

export const isRegisteredRoute = (pathname: string) => knownRoutes.has(pathname)

export const getPageParams = <T extends Record<string, string>>(): T => {
    for (const p of knownRoutes.values()) {
        const params = getPathMatchParams<T>(
            location.pathname,
            pathStringToPattern(p.pathname, p.exact)
        )

        if (params) return params
    }

    return {} as T
}

export const parsePathname = (pathname: string) => {
    const currentPathnameParts = location.pathname.split('/')
    return pathname
        .split('/')
        .map((p, i) => (/:.+/.test(p) ? currentPathnameParts[i] : p))
        .join('/')
}

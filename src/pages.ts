import { isOnPage } from './utils/is-on-page'
import { getSearchQuery } from './utils/get-search-query'
import { jsonStringify } from './utils/json-stringify'

const routeListeners: Set<
    (
        pathname: string,
        query: Record<string, string>,
        data: Record<string, unknown>
    ) => void
> = new Set()

const broadcast = async () => {
    routeListeners.forEach((cb) => {
        cb(location.pathname, getSearchQuery(), getPageData())
    })
}

window.addEventListener('popstate', () => {
    broadcast()
})

export const onPageChange = (sub: (pathname: string) => void) => {
    routeListeners.add(sub)
    sub(location.pathname)

    return () => {
        routeListeners.delete(sub)
    }
}

export const goToPage = (
    pathname: string,
    data: Record<string, unknown> = {},
    title = document.title
) => {
    if (!isOnPage(pathname)) {
        window.history.pushState(data, title, pathname)

        if (title !== document.title) {
            document.title = title
        }

        broadcast()
    }
}

export const replacePage = (
    pathname: string,
    state: Record<string, unknown> = {},
    title = document.title
) => {
    if (typeof pathname === 'string' && !isOnPage(pathname)) {
        window.history.replaceState(state, title, pathname)

        if (title !== document.title) {
            document.title = title
        }

        broadcast()
    }
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

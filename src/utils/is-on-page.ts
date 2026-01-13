import { cleanPathnameOptionalEnding } from './clean-pathname-optional-ending'
import { getHashPathname, getHashSearch } from './hash-routing'
import { getRoutingMode } from '../pages'

export const isOnPage = (path: string, exact = true) => {
    if (!path.trim().length) {
        return false
    }

    const routingMode = getRoutingMode()

    // Get current pathname and search based on routing mode
    const currentPathname =
        routingMode === 'hash'
            ? getHashPathname()
            : cleanPathnameOptionalEnding(location.pathname)
    const currentSearch =
        routingMode === 'hash' ? getHashSearch() : location.search

    // Parse target path
    const url = new URL(path.trim(), location.origin)
    const targetPathname = cleanPathnameOptionalEnding(url.pathname)

    const matchesPath = exact
        ? currentPathname === targetPathname
        : currentPathname.startsWith(targetPathname)

    if (url.search) {
        return (
            matchesPath &&
            (exact
                ? currentSearch === url.search
                : currentSearch.startsWith(url.search))
        )
    }

    return matchesPath
}

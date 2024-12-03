import { cleanPathnameOptionalEnding } from './clean-pathname-optional-ending'

export const isOnPage = (path: string, exact = true) => {
    if (!path.trim().length) {
        return false
    }

    const url = new URL(path.trim(), location.origin)
    const currentPathname = cleanPathnameOptionalEnding(location.pathname)
    const targetPathname = cleanPathnameOptionalEnding(url.pathname)

    const matchesPath = exact
        ? currentPathname === targetPathname
        : currentPathname.startsWith(targetPathname)

    if (url.search) {
        return (
            matchesPath &&
            (exact
                ? location.search === url.search
                : location.search.startsWith(url.search))
        )
    }

    return matchesPath
}

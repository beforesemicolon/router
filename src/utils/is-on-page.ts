import { cleanPathnameOptionalEnding } from './clean-pathname-optional-ending'

export const isOnPage = (path: string) => {
    if (!path.trim().length) {
        return false
    }

    const url = new URL(path.trim(), location.origin)
    const matchesPath =
        cleanPathnameOptionalEnding(location.pathname) ===
        cleanPathnameOptionalEnding(url.pathname)

    if (url.search) {
        return matchesPath && url.search === location.search
    }

    return matchesPath
}

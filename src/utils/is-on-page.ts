import { cleanPathnameOptionalEnding } from './clean-pathname-optional-ending'

export const isOnPage = (path: string) => {
    path = path.trim()

    return (
        path.length > 0 &&
        cleanPathnameOptionalEnding(location.pathname) ===
            cleanPathnameOptionalEnding(path)
    )
}

import { cleanPathnameOptionalEnding } from './clean-pathname-optional-ending'

export const pathStringToPattern = (path: string, exact = true) => {
    path = cleanPathnameOptionalEnding(path)
    const params: string[] = []

    // Escape literal route text without escaping the generated parameter groups.
    const rep = path.replace(/:([^/]+)|[.*+?^${}()|[\]\\]/g, (s, p) => {
        if (p) {
            params.push(p)
            return '([^/]+)'
        }
        return `\\${s}`
    })

    return {
        pattern: new RegExp(`^${rep}${exact ? '$' : '(\\/.*)?$'}`),
        params,
    }
}

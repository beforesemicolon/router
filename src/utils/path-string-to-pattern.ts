import { cleanPathnameOptionalEnding } from './clean-pathname-optional-ending'

export const pathStringToPattern = (path: string, exact = true) => {
    path = cleanPathnameOptionalEnding(path)
    const params: string[] = []

    const rep = path.replace(/:([^/]+)/g, (s, p) => {
        params.push(p)
        return '([^/]+)'
    })

    return {
        pattern: new RegExp(`^${rep}${exact ? '$' : '*'}`),
        params,
    }
}

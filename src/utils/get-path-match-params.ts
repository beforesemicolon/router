import { cleanPathnameOptionalEnding } from './clean-pathname-optional-ending'

export const getPathMatchParams = <T extends Record<string, string>>(
    path: string,
    { pattern, params }: { pattern: RegExp; params: string[] }
): T | null => {
    path = cleanPathnameOptionalEnding(path)
    const match = path.match(pattern)

    if (match) {
        const [, ...paramValues] = match
        return params.reduce(
            (acc, p, i) => ({ ...acc, [p]: paramValues[i] ?? null }),
            {} as T
        )
    }

    return null
}

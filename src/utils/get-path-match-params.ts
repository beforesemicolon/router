export const getPathMatchParams = (
    path: string,
    { pattern, params }: { pattern: RegExp; params: string[] }
) => {
    const match = path.match(pattern)

    if (match) {
        const [, ...paramValues] = match
        return params.reduce(
            (acc, p, i) => ({ ...acc, [p]: paramValues[i] ?? null }),
            {}
        )
    }

    return null
}

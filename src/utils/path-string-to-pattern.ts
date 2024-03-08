export const pathStringToPattern = (path: string) => {
    const params: string[] = []

    const rep = path.replace(/:([^/]+)/g, (s, p) => {
        params.push(p)
        return '([^/]+)'
    })

    const ending = path.endsWith('/') ? '?' : ''

    return {
        pattern: new RegExp(`^${rep}${ending}$`),
        params,
    }
}

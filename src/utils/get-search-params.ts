import { jsonParse } from './json-parse'

export const getSearchParams = <T extends Record<string, string>>(): T => {
    const searchParams = new URLSearchParams(location.search)
    const res: Record<string, unknown> = {}

    for (const key of searchParams.keys()) {
        const val = searchParams.get(key)
        res[key] = val ? jsonParse(val) : null
    }

    return res as T
}

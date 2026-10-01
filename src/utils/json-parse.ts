export function jsonParse<T>(value: T): T {
    if (value && typeof value === 'string') {
        try {
            value =
                value === 'undefined'
                    ? undefined
                    : JSON.parse(value.replace(/['`]/g, '"'))
        } catch {
            /* empty */
        }
    }

    return value
}

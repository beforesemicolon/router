/**
 * Hash routing utilities
 * Extracts pathname from location.hash for hash-based routing
 */

/**
 * Extract pathname from hash
 * Converts #/team to /team
 */
export const getHashPathname = (): string => {
    const hash = location.hash
    if (!hash || hash === '#') {
        return '/'
    }
    // Remove # and extract pathname (before ? if query params exist)
    const hashPath = hash.substring(1)
    const pathname = hashPath.split('?')[0]
    return pathname || '/'
}

/**
 * Extract search query from hash
 * Converts #/team?tab=one to { tab: 'one' }
 */
export const getHashSearch = (): string => {
    const hash = location.hash
    if (!hash) {
        return ''
    }
    const hashPath = hash.substring(1)
    const searchIndex = hashPath.indexOf('?')
    return searchIndex >= 0 ? hashPath.substring(searchIndex) : ''
}

/**
 * Get full hash path (pathname + search)
 */
export const getHashPath = (): string => {
    return getHashPathname() + getHashSearch()
}

/**
 * Convert pathname to hash format
 * Converts /team to #/team
 */
export const pathnameToHash = (pathname: string): string => {
    if (!pathname || pathname === '/') {
        return '#/'
    }
    return `#${pathname.startsWith('/') ? pathname : '/' + pathname}`
}

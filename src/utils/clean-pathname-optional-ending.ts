/**
 * trailing forward slash and index.html are totally optional
 * @param pathname
 */
export const cleanPathnameOptionalEnding = (pathname: string) =>
    pathname == '/'
        ? pathname
        : pathname.replace(/\/index\.html$/, '').replace(/\/$/, '')

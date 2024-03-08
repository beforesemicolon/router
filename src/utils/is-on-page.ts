export const isOnPage = (path: string) => {
    path = path.trim()

    return (
        path.length > 0 &&
        location.pathname.replace(/\/$/, '') === path.replace(/\/$/, '')
    )
}

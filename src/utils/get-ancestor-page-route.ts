export const getAncestorPageRoute = (el: Element) => {
    let pageRoute = el.parentNode

    while (pageRoute) {
        if (pageRoute instanceof ShadowRoot) {
            pageRoute = pageRoute.host
        }

        if (/PAGE-ROUTE/.test(pageRoute.nodeName)) {
            break
        }

        pageRoute = pageRoute.parentNode
    }

    return pageRoute
}

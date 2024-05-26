import { PageRoute } from '../types'

export const getAncestorPageRoute = (el: Element): PageRoute | null => {
    let pageRoute = el.parentNode as PageRoute

    while (pageRoute) {
        if (pageRoute instanceof ShadowRoot) {
            pageRoute = pageRoute.host as PageRoute
        }

        if (/PAGE-ROUTE/.test(pageRoute.nodeName)) {
            break
        }

        pageRoute = pageRoute.parentNode as PageRoute
    }

    return pageRoute ?? null
}

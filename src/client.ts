import './components/page-link'
import './components/page-route'
import {
    getPageData,
    goToPage,
    nextPage,
    onPageChange,
    previousPage,
    replacePage,
    registerRoute,
    isRegisteredRoute,
    getPageParams,
    updateSearchQuery,
} from './pages'
import { isOnPage } from './utils/is-on-page'
import { getSearchParams } from './utils/get-search-params'

export * from './components/page-route'
import initPageLink from './components/page-link'
import initPageRoute from './components/page-route'
import initPageData from './components/page-data'
import type { WebComponent } from '@beforesemicolon/web-component'

declare global {
    interface Window {
        BFS: {
            MARKUP: typeof import('@beforesemicolon/web-component')
            ROUTER: Record<string, unknown>
            WebComponent: typeof WebComponent
        }
    }
}

if (!window.BFS?.MARKUP || !window.BFS.WebComponent) {
    throw new Error(
        `BFS.MARKUP and BFS.WebComponent are required in order for BFS.ROUTER to work. Please add the following script to the HTML head tag "<script src="https://unpkg.com/@beforesemicolon/web-component/dist/client.js"></script>"`
    )
}

if (window.BFS) {
    const BFS = { ...(window.BFS ?? {}), ...window.BFS?.MARKUP }

    initPageRoute(BFS)
    initPageLink(BFS)
    initPageData(BFS)

    window.BFS = {
        ...(window.BFS || {}),
        ROUTER: {
            goToPage,
            replacePage,
            previousPage,
            nextPage,
            onPageChange,
            isOnPage,
            getSearchParams,
            getPageData,
            getPageParams,
            registerRoute,
            isRegisteredRoute,
            updateSearchQuery,
        },
    }
}

import * as WB from '@beforesemicolon/web-component'
import initPageData from './components/page-data'
import initPageLink from './components/page-link'
import initWithRoute from './components/page-route'
export * from './components/page-link'
export * from './components/page-route'
export * from './pages'
export * from './types'
export * from './utils/get-path-match-params'
export * from './utils/get-search-params'
export * from './utils/hash-routing'
export * from './utils/is-on-page'
export * from './utils/path-string-to-pattern'

initWithRoute(WB)
initPageLink(WB)
initPageData(WB)

import * as WB from '@beforesemicolon/web-component'
export * from './pages'
export * from './utils/is-on-page'
export * from './utils/get-search-params'
export * from './components/page-link'
export * from './components/page-route'
import initPageLink from './components/page-link'
import initWithRoute from './components/page-route'
import initPageData from './components/page-data'

initWithRoute(WB)
initPageLink(WB)
initPageData(WB)

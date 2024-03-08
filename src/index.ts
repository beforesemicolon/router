import * as WB from '@beforesemicolon/web-component'
export * from './pages'
export * from './utils/is-on-page'
export * from './utils/get-search-query'
export * from './components/page-link'
export * from './components/with-route'
import initPageLink from './components/page-link'
import initWithRoute from './components/with-route'

initWithRoute(WB)
initPageLink(WB)

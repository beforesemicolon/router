import { HtmlTemplate } from '@beforesemicolon/web-component'
import {
    getPageData,
    onPage,
    registerRoute,
    resolveRouteModule,
} from '../pages'
import {
    PageRoute as PageRouteElement,
    PageRouteProps,
    PageRouteQueryProps,
    Status,
} from '../types'
import { getAncestorPageRoute } from '../utils/get-ancestor-page-route'

export default ({
    html,
    WebComponent,
    HtmlTemplate,
    when,
    is,
}: typeof import('@beforesemicolon/web-component')) => {
    const cachedResult: Record<string, PageContent> = {}
    const pendingLoads: Record<string, Promise<PageContent>> = {}

    registerRoute('/') // default route always known

    type PageContent =
        | Node
        | typeof HtmlTemplate
        | string
        | { render: (el: HTMLElement) => void }
        | PageContentCallback
    type PageContentCallback = (
        data: ReturnType<typeof getPageData>,
        params: Record<string, string>,
        query: Record<string, unknown>
    ) => Promise<PageContent>

    class PageRoute<
        T extends PageRouteProps = PageRouteProps,
    > extends WebComponent<T, { status: Status }> {
        static observedAttributes = [
            'path',
            'src',
            'component',
            'title',
            'exact',
        ]
        initialState = {
            status: Status.Idle,
        }
        path = ''
        src = ''
        component: unknown = null
        title = ''
        exact = true
        #parentRoute: PageRouteElement | null = null
        #search = ''
        #mountedTemplate: HtmlTemplate | null = null
        #cachedNodes = document.createDocumentFragment()
        #cachedContent: PageContent | null = null
        #cachedContentKey: string | null = null

        get fullPath(): string {
            return (this.#parentRoute?.fullPath ?? '') + this.props.path()
        }

        _destroyContent = () => {
            if (
                this.#mountedTemplate &&
                typeof this.#mountedTemplate.unmount === 'function'
            ) {
                this.#mountedTemplate.unmount()
                this.#mountedTemplate = null
            }

            this.innerHTML = ''
            this.#cachedNodes = document.createDocumentFragment()
        }

        _detachContent = () => {
            while (this.firstChild) {
                this.#cachedNodes.appendChild(this.firstChild)
            }
        }

        _renderContent = (content: PageContent) => {
            this._destroyContent()
            this.#cachedContent = content

            if (typeof (content as HtmlTemplate).render === 'function') {
                // Markup HtmlTemplate - track for unmounting
                this.#mountedTemplate = content as HtmlTemplate
                ;(content as HtmlTemplate).render(this)
            } else if (content instanceof Node) {
                this.appendChild(content)
            } else {
                this.innerHTML = String(content)
            }

            this.setState({ status: Status.Loaded })
        }

        _restoreCachedContent = () => {
            if (this.#cachedNodes.hasChildNodes()) {
                this.appendChild(this.#cachedNodes)
                this.setState({ status: Status.Loaded })
                return true
            }

            const content = this.#cachedContent

            if (!content) {
                return false
            }

            if (content instanceof Node) {
                this.appendChild(content)
                this.setState({ status: Status.Loaded })
                return true
            } else if (typeof (content as HtmlTemplate).render === 'function') {
                this._renderContent(content)
                return true
            } else {
                this.innerHTML = String(content)
                this.setState({ status: Status.Loaded })
                return true
            }
        }

        _getMatchedKey = (pathname: string) =>
            pathname + (this.#search ? location.search : '')

        _isCachedMatch = (matchedKey: string) =>
            this.#cachedContentKey === matchedKey

        _markCachedMatch = (matchedKey: string) => {
            this.#cachedContentKey = matchedKey
        }

        _setInactive = () => {
            const componentValue =
                typeof this.props.component === 'function'
                    ? this.props.component()
                    : this.component
            const canCacheRenderedContent =
                this.hasAttribute('src') || componentValue != null
            const didLoadFail = this.state.status() === Status.LoadingFailed

            if (this.state.status() !== Status.Idle) {
                this.setState({ status: Status.Idle })

                if (canCacheRenderedContent && !didLoadFail) {
                    this._detachContent()
                }
            }

            if (didLoadFail && canCacheRenderedContent) {
                this._destroyContent()
                this.#cachedContent = null
                this.#cachedContentKey = null
            }

            this.hidden = true
        }

        _loadContent = async (
            params: Record<string, string>,
            query: Record<string, unknown>
        ) => {
            try {
                // Check if component prop is provided (explicit import)
                const componentValue =
                    typeof this.props.component === 'function'
                        ? this.props.component()
                        : this.component
                if (componentValue != null) {
                    if (this.mounted) {
                        try {
                            let content: PageContent =
                                componentValue as PageContent

                            // If component is a function, call it
                            if (typeof content === 'function') {
                                content = await (
                                    content as PageContentCallback
                                )(getPageData(), params, query)
                            }

                            this._renderContent(content)
                        } catch (err) {
                            this.setState({ status: Status.LoadingFailed })
                            return console.error(err)
                        }
                    }
                    return
                }

                // Fallback to src attribute (dynamic loading)
                const src = this.props.src()
                if (!src) {
                    // No src or component, render slot content
                    this.setState({ status: Status.Loaded })
                    return
                }

                this.setState({ status: Status.Loading })
                let content = cachedResult[src]

                if (!content) {
                    if (!pendingLoads[src]) {
                        pendingLoads[src] = (async () => {
                            let loadedContent: PageContent

                            const routeModule = await resolveRouteModule(src)

                            if (routeModule !== undefined) {
                                loadedContent = routeModule as PageContent
                            } else if (/\.([jt])s$/.test(src)) {
                                ;({ default: loadedContent } =
                                    await (src.startsWith('file:')
                                        ? import(
                                              /* @vite-ignore */ src.replace(
                                                  /^file:/,
                                                  ''
                                              )
                                          )
                                        : import(
                                              /* @vite-ignore */ new URL(
                                                  src,
                                                  location.origin
                                              ).href
                                          )))
                            } else {
                                const res = await fetch(src)

                                if (res.status === 200) {
                                    loadedContent = await res.text()
                                } else {
                                    throw new Error(
                                        `Loading "${this.props.src()}" content failed with status code ${
                                            res.status
                                        }`
                                    )
                                }
                            }

                            cachedResult[src] = loadedContent
                            return loadedContent
                        })().finally(() => {
                            delete pendingLoads[src]
                        })
                    }

                    content = await pendingLoads[src]
                }

                if (this.mounted) {
                    if (typeof content === 'function') {
                        content = await (content as PageContentCallback)(
                            getPageData(),
                            params,
                            query
                        )
                    }

                    this._renderContent(content)
                }
            } catch (err) {
                this.setState({ status: Status.LoadingFailed })
                return console.error(err)
            }
        }

        _handlePageChange = (
            active: boolean,
            location: {
                pathname: string
                query: Record<string, string>
                params: Record<string, string>
                data: Record<string, unknown>
            }
        ) => {
            const matchedKey = this._getMatchedKey(location.pathname)

            if (active) {
                // Load content if src or component is provided and not already loaded
                const componentValue =
                    typeof this.props.component === 'function'
                        ? this.props.component()
                        : this.component
                const hasComponent = componentValue != null
                const hasSrc = this.hasAttribute('src') && this.props.src()
                const status = this.state.status()
                const canLoad =
                    (hasSrc || hasComponent) &&
                    !this._isCachedMatch(matchedKey) &&
                    status === Status.Idle &&
                    this.state.status() !== Status.Loaded

                if (canLoad) {
                    this._markCachedMatch(matchedKey)
                    this._loadContent(location.params, location.query)
                } else if (
                    status === Status.Idle &&
                    this._isCachedMatch(matchedKey) &&
                    this._restoreCachedContent()
                ) {
                    // cached content restored
                } else if (status === Status.LoadingFailed) {
                    // keep the fallback rendered until the route changes
                } else if (status !== Status.Loaded) {
                    this.setState({ status: Status.Loaded })
                }

                if (this.hasAttribute('title'))
                    document.title = this.props.title()
                this.hidden = false
                return
            }

            this._setInactive()
        }

        onMount() {
            this.#parentRoute = getAncestorPageRoute(this)

            const url = new URL(this.fullPath, location.origin)
            this.#search = url.search
            registerRoute(url.pathname, this.props.exact())

            return onPage(
                this.fullPath,
                this._handlePageChange,
                this.props.exact()
            )
        }

        render() {
            const visible = html`<slot></slot>`
            const hidden = html`<slot name="hidden"></slot>`
            const loading = html`<slot name="loading"><p>Loading...</p></slot>`
            const failed = html` <slot name="fallback"
                ><p>Failed to load content</p></slot
            >`

            return html`
                ${when(is(this.state.status, Status.Loaded), visible)}
                ${when(is(this.state.status, Status.Loading), loading)}
                ${when(is(this.state.status, Status.LoadingFailed), failed)}
                ${when(is(this.state.status, Status.Idle), hidden)}
            `
        }
    }

    class PageRouteQuery extends PageRoute<PageRouteQueryProps> {
        static observedAttributes = ['key', 'value', 'src']
        key = ''
        value = ''
        #parentRoute: PageRouteElement | null = null

        get fullPath(): string {
            return this.#parentRoute?.fullPath ?? '/'
        }

        _handlePageChange = (
            active: boolean,
            location: {
                pathname: string
                query: Record<string, string>
                params: Record<string, string>
                data: Record<string, unknown>
            }
        ) => {
            const key = this.props.key()
            const value = this.props.value()

            if (!active) {
                this._setInactive()
                return
            }

            if (location.query[key] === value) {
                const matchedKey = this._getMatchedKey(location.pathname)

                if (
                    this.props.src() &&
                    this.state.status() === Status.Idle &&
                    !this._isCachedMatch(matchedKey)
                ) {
                    this._markCachedMatch(matchedKey)
                    this._loadContent(location.params, location.query)
                } else if (
                    this.state.status() === Status.Idle &&
                    this._isCachedMatch(matchedKey) &&
                    this._restoreCachedContent()
                ) {
                    // cached content restored
                } else if (this.state.status() === Status.LoadingFailed) {
                    // keep the fallback rendered until the route changes
                } else if (this.state.status() !== Status.Loaded) {
                    this.setState({ status: Status.Loaded })
                }

                this.hidden = false
                return
            }

            this._setInactive()
        }

        onMount() {
            this.#parentRoute = getAncestorPageRoute(this)
            return onPage(
                this.fullPath,
                this._handlePageChange,
                this.#parentRoute?.props?.exact?.() ?? false
            )
        }
    }

    customElements.define('page-route', PageRoute)
    customElements.define('page-route-query', PageRouteQuery)
}

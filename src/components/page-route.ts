import { HtmlTemplate } from '@beforesemicolon/web-component'
import {
    getPageData,
    getRouteModule,
    onPageChange,
    registerRoute,
} from '../pages'
import {
    PageRouteProps,
    PageRouteQueryProps,
    PathChangeListener,
    Status,
} from '../types'
import { getAncestorPageRoute } from '../utils/get-ancestor-page-route'
import { getPathMatchParams } from '../utils/get-path-match-params'
import { pathStringToPattern } from '../utils/path-string-to-pattern'

export default ({
    html,
    WebComponent,
    HtmlTemplate,
    when,
    is,
}: typeof import('@beforesemicolon/web-component')) => {
    const cachedResult: Record<string, PageContent> = {}

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
        #parentRoute: PageRoute | null = null
        #search = ''
        #mountedTemplate: HtmlTemplate | null = null

        get fullPath(): string {
            return (this.#parentRoute?.fullPath ?? '') + this.props.path()
        }

        _clearContent = () => {
            // Unmount Markup template if mounted
            if (
                this.#mountedTemplate &&
                typeof this.#mountedTemplate.unmount === 'function'
            ) {
                this.#mountedTemplate.unmount()
                this.#mountedTemplate = null
            }

            if (this.hasAttribute('src')) {
                const content = cachedResult[this.props.src()]

                if (
                    content &&
                    typeof (content as HtmlTemplate).unmount === 'function'
                ) {
                    ;(content as HtmlTemplate).unmount()
                } else {
                    this.innerHTML = ''
                }
            }
        }

        _renderContent = (content: PageContent) => {
            this._clearContent()

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

        _loadContent = async (
            params: Record<string, string>,
            query: Record<string, unknown>
        ) => {
            // Check if component prop is provided (explicit import)
            const componentValue =
                typeof this.props.component === 'function'
                    ? this.props.component()
                    : this.component
            if (componentValue != null) {
                if (this.mounted) {
                    try {
                        let content: PageContent = componentValue as PageContent

                        // If component is a function, call it
                        if (typeof content === 'function') {
                            content = await (content as PageContentCallback)(
                                getPageData(),
                                params,
                                query
                            )
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
                try {
                    // Check route module registry first (build-time optimization)
                    const moduleLoader = getRouteModule(src)
                    if (moduleLoader) {
                        const moduleResult = await moduleLoader()
                        content = (moduleResult as { default: PageContent })
                            .default
                    } else if (/\.([jt])s$/.test(src)) {
                        // Dynamic import fallback
                        ;({ default: content } = await (src.startsWith('file:')
                            ? import(
                                  /* @vite-ignore */ src.replace(/^file:/, '')
                              )
                            : import(
                                  /* @vite-ignore */ new URL(
                                      src,
                                      location.origin
                                  ).href
                              )))
                    } else {
                        // Fetch text/HTML file
                        const res = await fetch(src)

                        if (res.status === 200) {
                            content = await res.text()
                        } else {
                            throw new Error(
                                `Loading "${this.props.src()}" content failed with status code ${
                                    res.status
                                }`
                            )
                        }
                    }

                    cachedResult[src] = content as PageContent
                } catch (err) {
                    this.setState({ status: Status.LoadingFailed })
                    return console.error(err)
                }
            }

            if (this.mounted) {
                try {
                    if (typeof content === 'function') {
                        content = await (content as PageContentCallback)(
                            getPageData(),
                            params,
                            query
                        )
                    }

                    this._renderContent(content)
                } catch (err) {
                    this.setState({ status: Status.LoadingFailed })
                    return console.error(err)
                }
            }
        }

        _handlePageChange: PathChangeListener = (pathname: string, query) => {
            const params = getPathMatchParams(
                pathname + (this.#search ? location.search : ''),
                pathStringToPattern(this.fullPath, this.props.exact())
            )

            if (params !== null) {
                // Load content if src or component is provided and not already loaded
                const componentValue =
                    typeof this.props.component === 'function'
                        ? this.props.component()
                        : this.component
                const hasComponent = componentValue != null
                const hasSrc = this.hasAttribute('src') && this.props.src()
                if (
                    (hasSrc || hasComponent) &&
                    this.state.status() !== Status.Loading &&
                    this.state.status() !== Status.Loaded
                ) {
                    this._loadContent(params, query)
                } else if (this.state.status() !== Status.Loaded) {
                    this.setState({ status: Status.Loaded })
                }

                if (this.hasAttribute('title'))
                    document.title = this.props.title()

                this.hidden = false
                return
            }

            if (this.state.status() !== Status.Idle) {
                this.setState({ status: Status.Idle })
                this._clearContent()
            }

            this.hidden = true
        }

        onMount() {
            this.#parentRoute = getAncestorPageRoute(this) as PageRoute

            const url = new URL(this.fullPath, location.origin)
            this.#search = url.search
            registerRoute(url.pathname, this.props.exact())

            return onPageChange(this._handlePageChange)
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
        #parentRoute: PageRoute | null = null

        get fullPath(): string {
            return this.#parentRoute?.fullPath ?? '/'
        }

        _handlePageChange: PathChangeListener = (pathname: string, query) => {
            const params = getPathMatchParams(
                pathname,
                pathStringToPattern(
                    this.fullPath,
                    this.#parentRoute?.props?.exact?.() ?? false
                )
            )
            const key = this.props.key()
            const value = this.props.value()

            if (params === null) return

            if (query[key] === value) {
                if (
                    this.props.src() &&
                    this.state.status() !== Status.Loading &&
                    this.state.status() !== Status.Loaded
                ) {
                    this._loadContent(params, query)
                } else {
                    this.setState({ status: Status.Loaded })
                }

                this.hidden = false
                return
            }

            if (this.state.status() !== Status.Idle) {
                this.setState({ status: Status.Idle })
                this.hasAttribute('src') && this._clearContent()
            }

            this.hidden = true
        }

        onMount() {
            this.#parentRoute = getAncestorPageRoute(this) as PageRoute
            return onPageChange(this._handlePageChange)
        }
    }

    customElements.define('page-route', PageRoute)
    customElements.define('page-route-query', PageRouteQuery)
}

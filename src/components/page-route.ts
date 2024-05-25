import { pathStringToPattern } from '../utils/path-string-to-pattern'
import { getPathMatchParams } from '../utils/get-path-match-params'
import { goToPage, onPageChange } from '../pages'
import { cleanPathnameOptionalEnding } from '../utils/clean-pathname-optional-ending'

interface PageRedirectProps {
    to: string
}

interface PageRouteProps {
    path: string
    src: string
    exact: boolean
    data: Record<string, unknown>
    title: string
}

interface PageRouteQueryProps extends PageRouteProps {
    key: string
    value: string
    src: string
    default: boolean
    data: Record<string, unknown>
}

enum Status {
    Idle,
    Loading,
    Loaded,
    LoadingFailed,
}

export default ({
    html,
    is,
    isNot,
    WebComponent,
    when,
}: typeof import('@beforesemicolon/web-component')) => {
    const knownRoutes: Set<string> = new Set([])

    class PageRoute<
        T extends PageRouteProps = PageRouteProps,
    > extends WebComponent<T, { status: Status }> {
        static observedAttributes = ['path', 'src', 'data', 'title', 'exact']
        initialState = {
            status: Status.Idle,
        }
        path = ''
        src = ''
        title = ''
        exact = true
        data = {}
        slotName = String(Math.floor(Math.random() * 10000000000))
        #cachedResult: Record<string, unknown> = {}
        #parentRoutePath = ''

        get fullPath() {
            return cleanPathnameOptionalEnding(
                this.#parentRoutePath + this.props.path()
            )
        }

        loadContent = async (src: string) => {
            if (!this.mounted) {
                return
            }

            this.setState({ status: Status.Loading })
            let content = this.#cachedResult[src]

            if (!content) {
                try {
                    if (src.endsWith('.js')) {
                        ;({ default: content } = await import(
                            src.startsWith('file:')
                                ? src.replace(/^file:/, '')
                                : new URL(src, location.origin).href
                        ))
                    } else {
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

                    this.#cachedResult[src] = content
                } catch (err) {
                    this.setState({ status: Status.LoadingFailed })
                    return console.error(err)
                }
            }

            if (this.mounted) {
                if (typeof content === 'function') {
                    content = await content(this.props.data())
                }

                // @ts-expect-error handle HTMLTemplate or anything with a render method
                if (typeof content?.render === 'function') {
                    // @ts-expect-error renderTarget is a property unique to Markup, in its absence we can render
                    if (content.renderTarget !== this) {
                        this.innerHTML = ''
                        // @ts-expect-error handle HTMLTemplate or anything with a render method
                        content.render(this)
                    }
                } else if (content instanceof Node) {
                    this.innerHTML = ''
                    this.appendChild(content)
                } else {
                    this.innerHTML = String(content)
                }

                this.setState({ status: Status.Loaded })
            }
        }

        onMount() {
            let pageRoute = this.parentNode

            while (pageRoute) {
                if (pageRoute instanceof ShadowRoot) {
                    pageRoute = pageRoute.host
                }

                if (pageRoute instanceof PageRoute) {
                    break
                }

                pageRoute = pageRoute.parentNode
            }

            if (pageRoute && pageRoute !== this) {
                this.#parentRoutePath = cleanPathnameOptionalEnding(
                    pageRoute.fullPath
                )
            }

            const path = this.fullPath
            knownRoutes.add(path)

            return onPageChange((pathname: string) => {
                const params = getPathMatchParams(
                    pathname,
                    pathStringToPattern(path, this.props.exact())
                )

                if (params !== null) {
                    if (
                        this.hasAttribute('src') &&
                        this.state.status() !== Status.Loading &&
                        this.state.status() !== Status.Loaded
                    ) {
                        this.loadContent(this.props.src())
                    } else if (this.state.status() !== Status.Loaded) {
                        this.setState({ status: Status.Loaded })
                    }

                    document.title = this.props.title()
                } else if (this.state.status() !== Status.Idle) {
                    this.setState({ status: Status.Idle })
                }
            })
        }

        render() {
            return html`
                <slot
                    name="${this.slotName} | ${isNot(
                        this.state.status,
                        Status.Loaded
                    )}"
                ></slot>
                ${when(
                    is(this.state.status, Status.Loading),
                    html` <slot name="loading"><p>Loading...</p></slot>`
                )}
                ${when(
                    is(this.state.status, Status.LoadingFailed),
                    html` <slot name="fallback"></slot>`
                )}
            `
        }
    }

    class PageRouteQuery extends PageRoute<PageRouteQueryProps> {
        static observedAttributes = ['key', 'value', 'src', 'data', 'default']
        key = ''
        value = ''
        default = false

        onMount() {
            return onPageChange((_, query) => {
                if (
                    (query[this.props.key()] === undefined &&
                        this.props.default()) ||
                    query[this.props.key()] === this.props.value()
                ) {
                    if (
                        this.props.src() &&
                        this.state.status() !== Status.Loading &&
                        this.state.status() !== Status.Loaded
                    ) {
                        this.loadContent(this.props.src())
                    } else {
                        this.setState({ status: Status.Loaded })
                    }
                } else {
                    this.setState({ status: Status.Idle })
                }
            })
        }
    }

    class PageRedirect extends WebComponent<PageRedirectProps> {
        static observedAttributes = ['to']
        to = ''

        onMount() {
            const parentPath = cleanPathnameOptionalEnding(
                this.closest('page-route')?.getAttribute('path') ?? '/'
            )

            return onPageChange((pathname: string) => {
                if (
                    !knownRoutes.has(pathname) &&
                    location.pathname.startsWith(parentPath)
                ) {
                    goToPage(this.props.to())
                }
            })
        }
    }

    customElements.define('page-route', PageRoute)
    customElements.define('page-route-query', PageRouteQuery)
    customElements.define('page-redirect', PageRedirect)
}

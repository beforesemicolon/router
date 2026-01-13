import {
    getRoutingMode,
    goToPage,
    isRegisteredRoute,
    onPageChange,
    parsePathname,
} from '../pages'
import { PageLinkProps, PageRedirectProps, PageRoute } from '../types'
import { cleanPathnameOptionalEnding } from '../utils/clean-pathname-optional-ending'
import { getAncestorPageRoute } from '../utils/get-ancestor-page-route'
import { pathnameToHash } from '../utils/hash-routing'
import { isOnPage } from '../utils/is-on-page'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default ({ html, WebComponent }: any) => {
    class PageLink<
        P extends PageLinkProps = PageLinkProps,
    > extends WebComponent<P> {
        static observedAttributes = [
            'path',
            'search',
            'keep-current-search',
            'title',
            'payload',
            'exact',
        ]
        path = ''
        search = ''
        keepCurrentSearch = false
        exact = true
        title = ''
        payload = {}
        #parentRoute: PageRoute | null = null

        _parentFullPath() {
            return this.#parentRoute?.fullPath ?? '/'
        }

        fullPath = () => {
            const routingMode = getRoutingMode()
            const rawPath = this.props.path()
            let path = rawPath

            if (!this.hasAttribute('path')) {
                if (routingMode === 'hash') {
                    // Get current hash pathname
                    const hash = location.hash
                    path =
                        hash && hash !== '#'
                            ? hash.substring(1).split('?')[0]
                            : '/'
                } else {
                    path = cleanPathnameOptionalEnding(location.pathname)
                }
            } else if (path.startsWith('$')) {
                path = cleanPathnameOptionalEnding(
                    path.replace(/^\$/, parsePathname(this._parentFullPath()))
                )
            } else if (path.startsWith('~')) {
                if (routingMode === 'hash') {
                    const hash = location.hash
                    const currentPath =
                        hash && hash !== '#'
                            ? hash.substring(1).split('?')[0]
                            : '/'
                    path = cleanPathnameOptionalEnding(
                        path.replace(/^~/, currentPath)
                    )
                } else {
                    path = cleanPathnameOptionalEnding(
                        path.replace(/^~/, location.pathname)
                    )
                }
            }

            const url = new URL(path, location.origin)

            // Get current search based on routing mode
            const currentSearch =
                routingMode === 'hash'
                    ? new URLSearchParams(location.hash.split('?')[1] || '')
                    : new URLSearchParams(location.search)

            if (
                this.hasAttribute('keep-current-search') &&
                this.props.keepCurrentSearch()
            ) {
                currentSearch.forEach((v, k) => {
                    url.searchParams.set(k, v)
                })
            }

            if (this.hasAttribute('search')) {
                const search = new URLSearchParams(this.props.search())
                search.forEach((v, k) => {
                    url.searchParams.set(k, v)
                })
            }

            const fullPath =
                url.pathname +
                (url.search ? `?${url.searchParams.toString()}` : '')

            // Return hash format if in hash mode
            if (routingMode === 'hash') {
                return pathnameToHash(fullPath)
            }

            return fullPath
        }

        handleClick = (event: Event) => {
            event.preventDefault()
            event.stopPropagation()

            goToPage(this.fullPath(), this.props.payload(), this.props.title())
        }

        toggleActive = (active: boolean) => {
            if (active) {
                this.setAttribute('active', '')
            } else {
                this.removeAttribute('active')
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _handlePageChange = (pathname: string) => {
            const newActive = isOnPage(this.fullPath(), this.props.exact())

            if (newActive !== this.hasAttribute('active')) {
                this.toggleActive(newActive)
                this.dispatch('active', {
                    value: newActive,
                })
            }
        }

        onMount() {
            this.#parentRoute = getAncestorPageRoute(this as unknown as Element)

            return onPageChange(this._handlePageChange)
        }

        render() {
            // Compute href reactively so it updates when path prop changes
            const computeHref = () => {
                const routingMode = getRoutingMode()
                const fullPath = this.fullPath()

                // For hash routing, href should be the hash path
                // For history routing, href should be the pathname
                return routingMode === 'hash' && fullPath.startsWith('#')
                    ? fullPath
                    : fullPath.startsWith('#')
                    ? fullPath.substring(1)
                    : fullPath
            }

            return html`
                <a
                    part="anchor"
                    href="${computeHref}"
                    onclick="${this.handleClick}"
                >
                    <slot></slot>
                </a>
            `
        }
    }

    let redirectingPath = ''

    class PageRedirect<
        P extends PageRedirectProps & PageLinkProps,
    > extends PageLink<P> {
        static observedAttributes = ['path', 'title', 'payload', 'type']
        type = 'unknown'

        _handlePageChange = (pathname: string) => {
            if (redirectingPath === pathname) return

            const parentPath = cleanPathnameOptionalEnding(
                this._parentFullPath()
            )

            if (pathname.startsWith(parentPath)) {
                if (this.props.type() === 'always') {
                    if (pathname + location.search === parentPath) {
                        redirectingPath = pathname
                        goToPage(
                            this.fullPath(),
                            this.props.payload(),
                            this.props.title()
                        ).finally(() => {
                            redirectingPath = ''
                        })
                    }
                } else if (!isRegisteredRoute(pathname)) {
                    redirectingPath = pathname
                    goToPage(
                        this.fullPath(),
                        this.props.payload(),
                        this.props.title()
                    ).finally(() => {
                        redirectingPath = ''
                    })
                }
            }
        }

        render() {
            return ''
        }
    }

    customElements.define(
        'page-link',
        PageLink as unknown as CustomElementConstructor
    )
    customElements.define(
        'page-redirect',
        PageRedirect as unknown as CustomElementConstructor
    )
}

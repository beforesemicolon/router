import { isOnPage } from '../utils/is-on-page'
import {
    goToPage,
    isRegisteredRoute,
    onPageChange,
    parsePathname,
} from '../pages'
import { getAncestorPageRoute } from '../utils/get-ancestor-page-route'
import { PageLinkProps, PageRedirectProps, PageRoute } from '../types'
import { cleanPathnameOptionalEnding } from '../utils/clean-pathname-optional-ending'

export default ({
    html,
    WebComponent,
}: typeof import('@beforesemicolon/web-component')) => {
    class PageLink<
        P extends PageLinkProps = PageLinkProps,
    > extends WebComponent<P> {
        static observedAttributes = [
            'path',
            'search',
            'keep-current-search',
            'title',
            'payload',
        ]
        path = ''
        search = ''
        keepCurrentSearch = false
        title = ''
        payload = {}
        #parentRoute: PageRoute | null = null

        _parentFullPath() {
            return this.#parentRoute?.fullPath ?? '/'
        }

        fullPath = () => {
            let path = this.props.path()

            if (!this.hasAttribute('path')) {
                path = cleanPathnameOptionalEnding(location.pathname)
            } else if (path.startsWith('$')) {
                path = cleanPathnameOptionalEnding(
                    path.replace(/^\$/, parsePathname(this._parentFullPath()))
                )
            } else if (path.startsWith('~')) {
                path = cleanPathnameOptionalEnding(
                    path.replace(/^~/, location.pathname)
                )
            }

            const url = new URL(path, location.origin)

            if (
                this.hasAttribute('keep-current-search') &&
                this.props.keepCurrentSearch()
            ) {
                const currentQuery = new URLSearchParams(location.search)
                currentQuery.forEach((v, k) => {
                    url.searchParams.set(k, v)
                })
            }

            if (this.hasAttribute('search')) {
                const search = new URLSearchParams(this.props.search())
                search.forEach((v, k) => {
                    url.searchParams.set(k, v)
                })
            }

            return url.pathname + url.search
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
        _handlePageChange = (_pathname: string) => {
            const newActive = isOnPage(this.fullPath())

            if (newActive !== this.hasAttribute('active')) {
                this.toggleActive(newActive)
                this.dispatch('active', {
                    value: newActive,
                })
            }
        }

        onMount() {
            this.#parentRoute = getAncestorPageRoute(this)

            return onPageChange(this._handlePageChange)
        }

        render() {
            return html`
                <a
                    part="anchor"
                    href="${this.fullPath}"
                    onclick="${this.handleClick}"
                >
                    <slot></slot>
                </a>
            `
        }
    }

    class PageRedirect<
        P extends PageRedirectProps & PageLinkProps,
    > extends PageLink<P> {
        static observedAttributes = ['path', 'title', 'payload', 'type']
        type = 'unknown'

        _handlePageChange = (pathname: string) => {
            const parentPath = cleanPathnameOptionalEnding(
                this._parentFullPath()
            )

            if (pathname.startsWith(parentPath)) {
                if (this.props.type() === 'always') {
                    if (pathname + location.search === parentPath) {
                        goToPage(
                            this.fullPath(),
                            this.props.payload(),
                            this.props.title()
                        )
                    }
                } else if (!isRegisteredRoute(pathname)) {
                    goToPage(
                        this.fullPath(),
                        this.props.payload(),
                        this.props.title()
                    )
                }
            }
        }

        // @ts-expect-error return value type mismatch
        render() {
            return ''
        }
    }

    customElements.define('page-link', PageLink)
    customElements.define('page-redirect', PageRedirect)
}

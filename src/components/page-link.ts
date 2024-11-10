import { isOnPage } from '../utils/is-on-page'
import { goToPage, onPageChange, parsePathname } from '../pages'
import { getAncestorPageRoute } from '../utils/get-ancestor-page-route'
import { PageLinkProps, PageRoute } from '../types'
import { cleanPathnameOptionalEnding } from '../utils/clean-pathname-optional-ending'

export default ({
    html,
    WebComponent,
}: typeof import('@beforesemicolon/web-component')) => {
    class PageLink extends WebComponent<PageLinkProps> {
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

        fullPath = () => {
            const search = new URLSearchParams(this.props.search())
            let path = this.props.path()

            if (!this.hasAttribute('path')) {
                path = cleanPathnameOptionalEnding(location.pathname)
            } else if (path.startsWith('$')) {
                path = cleanPathnameOptionalEnding(
                    path.replace(
                        /^\$/,
                        parsePathname(this.#parentRoute?.fullPath ?? '/')
                    )
                )
            } else if (path.startsWith('~')) {
                path = cleanPathnameOptionalEnding(
                    path.replace(/^~/, location.pathname)
                )
            }

            const url = new URL(path, location.origin)

            if (this.props.keepCurrentSearch()) {
                const currentQuery = new URLSearchParams(location.search)
                currentQuery.forEach((v, k) => {
                    url.searchParams.set(k, v)
                })
            }

            search.forEach((v, k) => {
                url.searchParams.set(k, v)
            })

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

        onMount() {
            this.#parentRoute = getAncestorPageRoute(this)

            return onPageChange(() => {
                const newActive = isOnPage(this.fullPath())

                if (newActive !== this.hasAttribute('active')) {
                    this.toggleActive(newActive)
                    this.dispatch('active', {
                        value: newActive,
                    })
                }
            })
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

    customElements.define('page-link', PageLink)
}

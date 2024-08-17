import { isOnPage } from '../utils/is-on-page'
import { goToPage, onPageChange } from '../pages'
import { getAncestorPageRoute } from '../utils/get-ancestor-page-route'
import { PageLinkProps, PageRoute } from '../types'
import { cleanPathnameOptionalEnding } from '../utils/clean-pathname-optional-ending'

export default ({
    html,
    WebComponent,
}: typeof import('@beforesemicolon/web-component')) => {
    class PageLink extends WebComponent<PageLinkProps, { part: string }> {
        static observedAttributes = [
            'path',
            'search',
            'default',
            'keep-current-search',
            'title',
            'data',
        ]
        initialState = {
            part: 'anchor',
        }
        path = ''
        search = ''
        default = false
        keepCurrentSearch = false
        title = ''
        data = {}
        #parentRoute: PageRoute | null = null

        fullPath = () => {
            const search = new URLSearchParams(this.props.search())
            let path = this.props.path()

            if (!this.hasAttribute('path')) {
                path = this.#parentRoute?.fullPath ?? '/'
            } else if (path.startsWith('$')) {
                const p = this.#parentRoute?.fullPath ?? '/'

                path = cleanPathnameOptionalEnding(path.replace(/^\$/, p))
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

            goToPage(this.fullPath(), this.props.data(), this.props.title())
        }

        toggleClass = (active: boolean) => {
            if (active) {
                this.classList.add('active')
            } else {
                this.removeAttribute('class')
            }
        }

        onMount() {
            this.#parentRoute = getAncestorPageRoute(this)

            return onPageChange((pathname, query) => {
                const newActive = isOnPage(this.fullPath())
                const part = newActive ? 'anchor active' : 'anchor'

                if (this.state.part() !== part) {
                    this.toggleClass(newActive)
                    this.setState({ part })
                    this.dispatch('active', {
                        value: newActive,
                    })
                }

                if (
                    this.props.default() &&
                    this.props.search() &&
                    !newActive &&
                    isOnPage(this.props.path() || '/' + location.search) &&
                    Array.from(new URLSearchParams(this.props.search())).some(
                        ([k]) => !query.hasOwnProperty(k)
                    )
                ) {
                    this.setState({ part: 'anchor active' })
                    this.toggleClass(true)
                }
            })
        }

        render() {
            return html`
                <a
                    part="${this.state.part}"
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

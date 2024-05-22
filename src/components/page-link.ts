import { isOnPage } from '../utils/is-on-page'
import { goToPage, onPageChange } from '../pages'

export interface PageLinkProps {
    path: string
    title: string
    search: string
    keepSearchParams: boolean
    default: boolean
    data: Record<string, unknown>
}

export default ({
    html,
    WebComponent,
}: typeof import('@beforesemicolon/web-component')) => {
    const matchesSearch = (search: string) => {
        if (!search.trim()) {
            return true
        }

        const curr = new URLSearchParams(location.search)

        return Array.from(new URLSearchParams(search)).every(
            ([k, v]) => curr.get(k) === v
        )
    }

    class PageLink extends WebComponent<PageLinkProps, { part: string }> {
        static observedAttributes = [
            'path',
            'title',
            'data',
            'search',
            'default',
            'keep-search-params',
        ]
        initialState = {
            part: 'anchor',
        }
        path = ''
        title = ''
        search = ''
        default = false
        keepSearchParams = false
        data = {}

        get fullPath() {
            return this.props.path().startsWith('$')
                ? this.props.path().replace(/^\$/, location.pathname)
                : this.props.path()
        }

        get fullURL() {
            const url = new URL(
                this.props.path().replace(/^\$\/?/, location.pathname),
                location.origin
            )

            if (this.props.keepSearchParams()) {
                const currentQuery = new URLSearchParams(location.search)
                currentQuery.forEach((_, name) => {
                    url.searchParams.set(name, currentQuery.get(name) ?? '')
                })
            }

            const search = new URLSearchParams(this.props.search())
            search.forEach((_, name) => {
                url.searchParams.set(name, search.get(name) ?? '')
            })

            return url
        }

        handleClick = (event: Event) => {
            event.preventDefault()
            event.stopPropagation()

            const url = this.fullURL

            if (
                url.pathname + url.search !==
                location.pathname + location.search
            ) {
                goToPage(
                    url.pathname + url.search,
                    this.props.data(),
                    this.props.title()
                )
            }
        }

        onMount() {
            return onPageChange(() => {
                const newActive =
                    isOnPage(this.fullPath) &&
                    matchesSearch(this.props.search())

                this.setState({
                    part: newActive ? 'anchor active' : 'anchor',
                })

                this.dispatch('active', {
                    value: newActive,
                })

                if (this.props.default() && this.props.search()) {
                    const loc = new URLSearchParams(location.search)
                    const search = new URLSearchParams(this.props.search())

                    if (Array.from(search).every(([k]) => !loc.has(k))) {
                        search.forEach((v, k) => {
                            loc.set(k, v)
                        })

                        goToPage(
                            location.pathname + `?${loc.toString()}`,
                            this.props.data(),
                            this.props.title()
                        )
                    }
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

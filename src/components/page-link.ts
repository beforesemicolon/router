import { isOnPage } from '../utils/is-on-page'
import { goToPage, onPageChange } from '../pages'

export interface PageLinkProps {
    path: string
    title: string
    search: string
    keepSearchParams: boolean
    data: Record<string, unknown>
}

export default ({
    html,
    WebComponent,
    when,
    is,
}: typeof import('@beforesemicolon/web-component')) => {
    class PageLink extends WebComponent<PageLinkProps, { part: string }> {
        static observedAttributes = [
            'path',
            'title',
            'data',
            'search',
            'keep-search-params',
        ]
        initialState = {
            part: 'anchor',
        }
        path = ''
        title = ''
        search = ''
        keepSearchParams = false
        data = {}

        handleClick = (event: Event) => {
            event.preventDefault()
            event.stopPropagation()

            if (this.props.path() !== location.pathname + location.search) {
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

                goToPage(
                    url.pathname + url.search,
                    this.props.data(),
                    this.props.title()
                )
            }
        }

        toggleClass = (active: boolean) => {
            if (active) {
                this.classList.add('active')
            } else {
                this.removeAttribute('class')
            }
        }

        onMount() {
            return onPageChange(() => {
                const newActive = isOnPage(this.props.path())

                this.toggleClass(newActive)

                this.setState({
                    part: newActive ? 'anchor active' : 'anchor',
                })
                this.dispatch('active', {
                    value: newActive,
                })
            })
        }

        render() {
            return html`
                <a
                    part="${this.state.part}"
                    href="${when(
                        is(this.props.path, (p) => p.startsWith('$')),
                        () =>
                            this.props.path().replace(/^\$/, location.pathname),
                        this.props.path
                    )}"
                    onclick="${this.handleClick}"
                >
                    <slot></slot>
                </a>
            `
        }
    }

    customElements.define('page-link', PageLink)
}

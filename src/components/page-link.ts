import { isOnPage } from '../utils/is-on-page'
import { goToPage, onPageChange } from '../pages'

export interface PageLinkProps {
    path: string
    title: string
    data: Record<string, unknown>
}

export default ({
    html,
    WebComponent,
}: typeof import('@beforesemicolon/web-component')) => {
    class PageLink extends WebComponent<PageLinkProps, { part: string }> {
        static observedAttributes = ['path', 'title', 'data']
        initialState = {
            part: 'anchor',
        }
        path = ''
        title = ''
        data = {}

        handleClick = (event: Event) => {
            event.preventDefault()
            event.stopPropagation()
            goToPage(this.props.path(), this.props.data(), this.props.title())
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
                    href="${this.props.path}"
                    onclick="${this.handleClick}"
                >
                    <slot></slot>
                </a>
            `
        }
    }

    customElements.define('page-link', PageLink)
}

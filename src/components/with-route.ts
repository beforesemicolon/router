import { pathStringToPattern } from '../utils/path-string-to-pattern'
import { getPathMatchParams } from '../utils/get-path-match-params'
import { onPageChange } from '../pages'

interface WithRouteProps {
    path: string
    src: string
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
    class WithRoute extends WebComponent<WithRouteProps, { status: Status }> {
        static observedAttributes = ['path', 'src']
        initialState = {
            status: Status.Idle,
        }
        path = ''
        src = ''
        slotName = String(Math.floor(Math.random() * 10000000000))

        loadContent = (src: string) => {
            this.setState({ status: Status.Loading })
            fetch(src)
                .then((res) => {
                    if (res.status === 200) {
                        return res.text()
                    }

                    throw new Error(
                        `Loading "${this.props.src()}" content failed with status code ${
                            res.status
                        }`
                    )
                })
                .then((html) => {
                    this.innerHTML = html
                    this.setState({ status: Status.Loaded })
                })
                .catch((err) => {
                    this.setState({ status: Status.LoadingFailed })
                    console.error(err)
                })
        }

        onMount() {
            return onPageChange((pathname: string) => {
                const params = getPathMatchParams(
                    pathname,
                    pathStringToPattern(this.props.path())
                )

                if (params !== null) {
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

    customElements.define('with-route', WithRoute)
}

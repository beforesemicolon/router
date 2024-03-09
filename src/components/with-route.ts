import { pathStringToPattern } from '../utils/path-string-to-pattern'
import { getPathMatchParams } from '../utils/get-path-match-params'
import { onPageChange } from '../pages'

interface WithRouteProps {
    path: string
    src: string
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
    class WithRoute extends WebComponent<WithRouteProps, { status: Status }> {
        static observedAttributes = ['path', 'src', 'data']
        initialState = {
            status: Status.Idle,
        }
        path = ''
        src = ''
        data = {}
        slotName = String(Math.floor(Math.random() * 10000000000))
        #cachedResult: Record<string, unknown> = {}

        loadContent = async (src: string) => {
            this.setState({ status: Status.Loading })
            let content = this.#cachedResult[src]

            if (!content) {
                try {
                    if (src.endsWith('.js')) {
                        ;({ default: content } = await import(src))
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

            if (typeof content === 'function') {
                content = content(this.props.data())
            }

            // @ts-expect-error handle HTMLTemplate or anything with a render method
            if (typeof content?.render === 'function') {
                this.innerHTML = ''
                // @ts-expect-error handle HTMLTemplate or anything with a render method
                content.render(this)
            } else {
                this.innerHTML = String(content)
            }

            this.setState({ status: Status.Loaded })
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

import { PageDataProps } from '../types'
import { getPageData, getPageParams, onPageChange } from '../pages'
import { getSearchParams } from '../utils/get-search-params'
import { jsonStringify } from '../utils/json-stringify'
import { isObjectLiteral } from '../utils/is-object-literal'

export default ({
    WebComponent,
    html,
    when,
}: typeof import('@beforesemicolon/web-component')) => {
    class PageData extends WebComponent<PageDataProps, { content: string }> {
        static observedAttributes = ['param', 'search-param', 'key']
        key = ''
        param = ''
        searchParam = ''
        initialState = {
            content: '',
        }

        _updateValue = () => {
            if (this.hasAttribute('param')) {
                const params = getPageParams()

                return this.setState({
                    content: params[this.props.param()] ?? '',
                })
            }

            if (this.hasAttribute('search-param')) {
                const searchParams = getSearchParams()

                return this.setState({
                    content: searchParams[this.props.searchParam()] ?? '',
                })
            }

            let data = getPageData()

            if (isObjectLiteral(data)) {
                if (this.hasAttribute('key')) {
                    const keyParts = this.props.key().split('.')

                    for (const k of keyParts) {
                        if (k in data) {
                            data = data[k] as Record<string, unknown>
                        } else {
                            break
                        }
                    }
                }

                if (Object.keys(data).length) {
                    return this.setState({ content: jsonStringify(data) })
                }
            }

            this.setState({ content: '' })
        }

        onMount() {
            return onPageChange(this._updateValue)
        }

        onUpdate() {
            this._updateValue()
        }

        render() {
            return html`${when(
                () => this.state.content() !== '',
                this.state.content,
                html`<slot></slot>`
            )}`
        }
    }

    customElements.define('page-data', PageData)
}

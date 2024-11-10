import { PageDataProps } from '../types'
import { getPageData, getPageParams, onPageChange } from '../pages'
import { getSearchParams } from '../utils/get-search-params'
import { jsonStringify } from '../utils/json-stringify'

export default ({
    WebComponent,
}: typeof import('@beforesemicolon/web-component')) => {
    class PageData extends WebComponent<PageDataProps> {
        static observedAttributes = ['param', 'search-param', 'key']
        key = ''
        param = ''
        searchParam = ''

        _updateValue = () => {
            if (this.hasAttribute('param')) {
                const params = getPageParams()

                this.textContent = params[this.props.param()]
                return
            }

            if (this.hasAttribute('search-param')) {
                const searchParams = getSearchParams()

                this.textContent = searchParams[this.props.searchParam()]
                return
            }

            let data = getPageData()

            if (this.hasAttribute('key') && data) {
                const keyParts = this.props.key().split('.')

                for (const k of keyParts) {
                    if (k in data) {
                        data = data[k] as Record<string, unknown>
                    } else {
                        break
                    }
                }
            }

            this.textContent = jsonStringify(data)
        }

        onMount() {
            return onPageChange(this._updateValue)
        }

        onUpdate() {
            this._updateValue()
        }

        render() {
            return '<slot></slot>'
        }
    }

    customElements.define('page-data', PageData)
}

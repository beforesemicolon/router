import initPageLink from './page-link';
import * as WB from "@beforesemicolon/web-component";
import {html} from "@beforesemicolon/web-component";
import { PageLink } from '../types'
import { goToPage } from '../pages'
import { waitFor } from '../test.utils'

initPageLink(WB)

describe('PageLink', () => {
	beforeEach(() => {
		Array.from(document.body.children, (el) => {
			el.remove()
		})
		goToPage('/');
	})

	it('should render correctly', async () => {
		const l1ActiveMock = jest.fn();
		const l2ActiveMock = jest.fn();
		
		html`
			<page-link path="/" onactive="${l1ActiveMock}"></page-link>
			<page-link path="/test" onactive="${l2ActiveMock}"></page-link>`
			.render(document.body)
		
		const [l1, l2] = Array.from(document.body.children) as PageLink[];

		expect(l1ActiveMock).toHaveBeenCalledTimes(1)
		expect(l2ActiveMock).toHaveBeenCalledTimes(0)

		expect(l1.outerHTML).toBe('<page-link path="/" class="active"></page-link>')
		expect(l2.outerHTML).toBe('<page-link path="/test"></page-link>')
		expect(l1.contentRoot.innerHTML).toBe('<a part="anchor active" href="/">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
		expect(l2.contentRoot.innerHTML).toBe('<a part="anchor" href="/test">\n' +
			'                    <slot></slot>\n' +
			'                </a>')

		l2.contentRoot.querySelector('a')?.click()

		expect(l1ActiveMock).toHaveBeenCalledTimes(2)
		expect(l2ActiveMock).toHaveBeenCalledTimes(1)

		expect(l1.outerHTML).toBe('<page-link path="/"></page-link>')
		expect(l2.outerHTML).toBe('<page-link path="/test" class="active"></page-link>')
		expect(l1.contentRoot.innerHTML).toBe('<a part="anchor" href="/">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
		expect(l2.contentRoot.innerHTML).toBe('<a part="anchor active" href="/test">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
	});

	it('should render default', () => {
		html`
			<page-link search="tab=one" default="true"></page-link>
			<page-link path="$" search="tab=two""></page-link>`
			.render(document.body)

		const [l1, l2] = Array.from(document.body.children) as PageLink[];

		expect(l1.contentRoot.innerHTML).toBe('<a part="anchor active" href="/?tab=one">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
		expect(l2.contentRoot.innerHTML).toBe('<a part="anchor" href="/?tab=two">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
	})

	it('should keep search', async () => {
		await waitFor(() => {
			goToPage('/?sample=true');
		})

		html`<page-link search="tab=one" default="true" keep-current-search="true"></page-link>
			<page-link path="$" search="tab=two" keep-current-search="true"></page-link>`
			.render(document.body)

		const [l1, l2] = Array.from(document.body.children) as PageLink[];

		expect(l1.contentRoot.innerHTML).toBe('<a part="anchor active" href="/?sample=true&amp;tab=one">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
		expect(l2.contentRoot.innerHTML).toBe('<a part="anchor" href="/?sample=true&amp;tab=two">\n' +
			'                    <slot></slot>\n' +
			'                </a>')

		l2.contentRoot.querySelector('a')?.click()

		expect(l1.contentRoot.innerHTML).toBe('<a part="anchor" href="/?sample=true&amp;tab=one">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
		expect(l2.contentRoot.innerHTML).toBe('<a part="anchor active" href="/?sample=true&amp;tab=two">\n' +
			'                    <slot></slot>\n' +
			'                </a>')

		expect(location.search).toBe('?sample=true&tab=two')
	})
})

import initPageLink from './page-link';
import * as WB from "@beforesemicolon/web-component";
import {PageLinkProps} from './page-link';
import {html, WebComponent} from "@beforesemicolon/web-component";
import {HTMLComponentElement} from "@beforesemicolon/web-component/dist/types/web-component";

initPageLink(WB)

describe('PageLink', () => {
	it('should render correctly', async () => {
		const l1ActiveMock = jest.fn();
		const l2ActiveMock = jest.fn();
		
		html`
			<page-link path="/" onactive="${l1ActiveMock}"></page-link>
			<page-link path="/test" onactive="${l2ActiveMock}"></page-link>`
			.render(document.body)
		
		const [l1, l2] = Array.from(document.body.children) as HTMLComponentElement<PageLinkProps>[];
		
		expect(l1.outerHTML).toBe('<page-link path="/" class="active"></page-link>')
		expect(l2.outerHTML).toBe('<page-link path="/test"></page-link>')
		expect(l1.contentRoot.innerHTML).toBe('<a part="anchor active" href="/">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
		expect(l2.contentRoot.innerHTML).toBe('<a part="anchor" href="/test">\n' +
			'                    <slot></slot>\n' +
			'                </a>')

		l2.contentRoot.querySelector('a')?.click()

		expect(l2ActiveMock).toHaveBeenCalledTimes(2)
		expect(l1ActiveMock).toHaveBeenCalledTimes(2)
		
		expect(l1.outerHTML).toBe('<page-link path="/"></page-link>')
		expect(l2.outerHTML).toBe('<page-link path="/test" class="active"></page-link>')
		expect(l1.contentRoot.innerHTML).toBe('<a part="anchor" href="/">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
		expect(l2.contentRoot.innerHTML).toBe('<a part="anchor active" href="/test">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
	});
})

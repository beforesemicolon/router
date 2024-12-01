import initPageLink from './page-link';
import * as WB from "@beforesemicolon/web-component";
import {html} from "@beforesemicolon/web-component";
import { PageLink } from '../types'
import { getPageData, goToPage } from '../pages'
import iniWithRoute from './page-route'

initPageLink(WB)
iniWithRoute(WB)

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

		expect(l1.outerHTML).toBe('<page-link path="/" active=""></page-link>')
		expect(l2.outerHTML).toBe('<page-link path="/test"></page-link>')

		l2.contentRoot.querySelector('a')?.click()

		expect(l1ActiveMock).toHaveBeenCalledTimes(2)
		expect(l2ActiveMock).toHaveBeenCalledTimes(1)

		expect(l1.outerHTML).toBe('<page-link path="/"></page-link>')
		expect(l2.outerHTML).toBe('<page-link path="/test" active=""></page-link>')
	});

	it('should keep search', async () => {
		goToPage('/?sample=true');
		
		html`<page-link search="tab=one" keep-current-search="true"></page-link>
			<page-link search="tab=two" keep-current-search="true"></page-link>`
			.render(document.body)
		
		const [l1, l2] = Array.from(document.body.children) as PageLink[];

		expect(l1.contentRoot.innerHTML).toBe('<a part="anchor" href="/?sample=true&amp;tab=one">\n' +
			'                    <slot></slot>\n' +
			'                </a>')
		expect(l2.contentRoot.innerHTML).toBe('<a part="anchor" href="/?sample=true&amp;tab=two">\n' +
			'                    <slot></slot>\n' +
			'                </a>')

		l2.contentRoot.querySelector('a')?.click()
		
		expect(l1.hasAttribute('active')).toBeFalsy()
		expect(l2.hasAttribute('active')).toBeTruthy()

		expect(location.search).toBe('?sample=true&tab=two')
	})

	it('should pass data', () => {
		html`<page-link path="/" payload='{"greeting":"Hello World"}'></page-link>`
			.render(document.body)

		const [l1] = Array.from(document.body.children) as PageLink[];

		expect(l1.outerHTML).toBe('<page-link path="/" payload="{&quot;greeting&quot;:&quot;Hello World&quot;}" active=""></page-link>')
		l1.contentRoot.querySelector('a')?.click()

		expect(getPageData()).toEqual({ greeting: 'Hello World' })
	})
	
	it('should use current pathname', () => {
		goToPage('/some-page');
		
		html`<page-link path="~/sub" ></page-link>`
			.render(document.body)
		
		const [l1] = Array.from(document.body.children) as PageLink[];
		
		l1.contentRoot.querySelector('a')?.click()
		
		expect(location.pathname).toBe('/some-page/sub')
	})
	
	it('should use parent page-route path', () => {
		html`
			<page-route path="/some-page">
				<page-link path="$/sub" ></page-link>
			</page-route>
		`
			.render(document.body)
		
		const [l1] = Array.from(document.body.children[0].children) as PageLink[];
		
		l1.contentRoot.querySelector('a')?.click()
		
		expect(location.pathname).toBe('/some-page/sub')
	})
})

describe('PageRedirect', () => {
	beforeEach(() => {
		Array.from(document.body.children, (el) => {
			el.remove()
		})
		goToPage('/');
	})
	
	it('should redirect unknown routes', async () => {
		html`
			<page-route path="/">Home</page-route>
			<page-route path="/todos" exact="false">
				<page-route path="/pending">Pending</page-route>
				<page-route path="/in-progress">Pending</page-route>
				<page-route path="/completed">Pending</page-route>
				<page-redirect path="$/pending"></page-redirect>
			</page-route>
			<page-route path="/404">404 - Page not found</page-route>
			<page-redirect path="/404"></page-redirect>
		`.render(document.body);
		
		expect(location.pathname).toBe('/')
		
		goToPage('/unknown');

		expect(location.pathname).toBe('/404')

		goToPage('/todos');

		expect(location.pathname).toBe('/todos')

		goToPage('/todos/unknown');

		expect(location.pathname).toBe('/todos/pending')

		goToPage('/todos/in-progress');

		expect(location.pathname).toBe('/todos/in-progress')
	})
	
	it('should always redirect', async () => {
		expect(location.pathname).toBe('/')
		
		html`
				<page-route path="/todos" exact="false">
					Todos:
					<page-route path="/pending">pending todos</page-route>
					<page-route path="/in-progress">in progress todos</page-route>
					<page-route path="/completed">completed todos</page-route>
					<page-redirect path="$/pending" type="always"></page-redirect>
				</page-route>
				<page-route path="/404"></page-route>
				
				<page-redirect path="/todos" type="always" title="Todo list"></page-redirect>
				<page-redirect path="/404" title="404 - Page not found"></page-redirect>
			`.render(document.body);
		
		expect(location.pathname).toBe('/todos/pending')

		goToPage('/unknown');

		expect(location.pathname).toBe('/404')
	})
})

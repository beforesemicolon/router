import * as WB from "@beforesemicolon/web-component";
import { html } from "@beforesemicolon/web-component";
import { getPageData, goToPage, setRoutingMode } from '../pages';
import { PageLink } from '../types';
import initPageLink from './page-link';
import iniWithRoute from './page-route';

initPageLink(WB)
iniWithRoute(WB)

describe('PageLink', () => {
    beforeAll(() => {
		// Set to history mode for tests
		setRoutingMode('history');
	})
	
	beforeEach(async () => {
        jest.useFakeTimers()
		Array.from(document.body.children, (el) => {
			el.remove()
		})
		await goToPage('/');
	})
    
    afterEach(() => {
        jest.useRealTimers()
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
        await jest.advanceTimersByTimeAsync(50)

		expect(l1ActiveMock).toHaveBeenCalledTimes(2)
		expect(l2ActiveMock).toHaveBeenCalledTimes(1)

		expect(l1.outerHTML).toBe('<page-link path="/"></page-link>')
		expect(l2.outerHTML).toBe('<page-link path="/test" active=""></page-link>')
	});
	
	it('should render correctly with exact=false', async () => {
		const l1ActiveMock = jest.fn();
		const l2ActiveMock = jest.fn();
		
		html`
			<page-link path="/todos" onactive="${l1ActiveMock}"></page-link>
			<page-link path="/todos" onactive="${l2ActiveMock}" exact="false"></page-link>`
			.render(document.body)
		
		const [l1, l2] = Array.from(document.body.children) as PageLink[];
		
		expect(l1ActiveMock).toHaveBeenCalledTimes(0)
		expect(l2ActiveMock).toHaveBeenCalledTimes(0)
		
		expect(l1.outerHTML).toBe('<page-link path="/todos"></page-link>')
		expect(l2.outerHTML).toBe('<page-link path="/todos" exact="false"></page-link>')
		
		l2.contentRoot.querySelector('a')?.click()
        await jest.advanceTimersByTimeAsync(50)

		expect(l1ActiveMock).toHaveBeenCalledTimes(1)
		expect(l2ActiveMock).toHaveBeenCalledTimes(1)

		expect(l1.outerHTML).toBe('<page-link path="/todos" active=""></page-link>')
		expect(l2.outerHTML).toBe('<page-link path="/todos" exact="false" active=""></page-link>')
		
		await goToPage('/todos/390orxmjr8wiehnadscsk')
        await jest.advanceTimersByTimeAsync(50)
		
		expect(l1ActiveMock).toHaveBeenCalledTimes(2)
		expect(l2ActiveMock).toHaveBeenCalledTimes(1)
		
		expect(l1.outerHTML).toBe('<page-link path="/todos"></page-link>')
		expect(l2.outerHTML).toBe('<page-link path="/todos" exact="false" active=""></page-link>')
	});

	it('should keep search', async () => {
		await goToPage('/?sample=true');
		
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
		await jest.advanceTimersByTimeAsync(0)
		
		expect(l1.hasAttribute('active')).toBeFalsy()
		expect(l2.hasAttribute('active')).toBeTruthy()

		expect(location.search).toBe('?sample=true&tab=two')
	})

	it('should pass data', async () => {
		html`<page-link path="/" payload='{"greeting":"Hello World"}'></page-link>`
			.render(document.body)

		const [l1] = Array.from(document.body.children) as PageLink[];

		expect(l1.outerHTML).toBe('<page-link path="/" payload="{&quot;greeting&quot;:&quot;Hello World&quot;}" active=""></page-link>')
		l1.contentRoot.querySelector('a')?.click()
		await jest.advanceTimersByTimeAsync(0)

		expect(getPageData()).toEqual({ greeting: 'Hello World' })
	})
	
	it('should use current pathname', async () => {
		await goToPage('/some-page');
		
		html`<page-link path="~/sub" ></page-link>`
			.render(document.body)
		
		const [l1] = Array.from(document.body.children) as PageLink[];
		
		l1.contentRoot.querySelector('a')?.click()
		
		// Wait for async navigation to complete
		await jest.advanceTimersByTimeAsync(0)
		
		expect(location.pathname).toBe('/some-page/sub')
	})
	
	it('should use parent page-route path', async () => {
		html`
			<page-route path="/some-page">
				<page-link path="$/sub" ></page-link>
			</page-route>
		`
			.render(document.body)
		
		const [l1] = Array.from(document.body.children[0].children) as PageLink[];
		
		l1.contentRoot.querySelector('a')?.click()
		
		// Wait for async navigation to complete
		await jest.advanceTimersByTimeAsync(0)
		
		expect(location.pathname).toBe('/some-page/sub')
	})
})

describe('PageRedirect', () => {
    beforeAll(() => {
        // Set to history mode for tests
        setRoutingMode('history');
    })
    
    beforeEach(async () => {
        jest.useFakeTimers()
        Array.from(document.body.children, (el) => {
            el.remove()
        })
        await goToPage('/');
    })
    
    afterEach(() => {
        jest.useRealTimers()
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
		
		await goToPage('/unknown');
		await jest.advanceTimersByTimeAsync(10)

		expect(location.pathname).toBe('/404')

		await goToPage('/todos');
		await jest.advanceTimersByTimeAsync(10)

		expect(location.pathname).toBe('/todos')

		await goToPage('/todos/unknown');
		await jest.advanceTimersByTimeAsync(10)

		expect(location.pathname).toBe('/todos/pending')

		await goToPage('/todos/in-progress');
		await jest.advanceTimersByTimeAsync(10)

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
		
		await jest.advanceTimersByTimeAsync(100)
		
		expect(location.pathname).toBe('/todos/pending')

		await goToPage('/unknown');
		await jest.advanceTimersByTimeAsync(10)

		expect(location.pathname).toBe('/404')
	})
})

import * as WB from '@beforesemicolon/web-component'
import {html, WebComponent} from '@beforesemicolon/web-component'
import {goToPage, onPageChange, registerRouteModules, setRoutingMode} from '../pages'
import * as fs from 'fs'
import * as path from 'path'
import {PageRoute, PageRouteQuery} from '../types'
import iniWithRoute from './page-route'
import initPageLink from './page-link';

iniWithRoute(WB)
initPageLink(WB)

const flushMicrotasks = () =>
	new Promise<void>((resolve) =>
		(typeof setImmediate === 'function' ? setImmediate : setTimeout)(resolve, 0)
	);

let routeCacheProbeConnections = 0
let routeCacheProbeDisconnections = 0
class RouteCacheProbe extends HTMLElement {
	connectedCallback() {
		routeCacheProbeConnections += 1
	}

	disconnectedCallback() {
		routeCacheProbeDisconnections += 1
	}
}

if (!customElements.get('route-cache-probe')) {
	customElements.define('route-cache-probe', RouteCacheProbe)
}

beforeAll(() => {
	// Set to history mode for tests
	setRoutingMode('history');
})

beforeEach(async () => {
	document.body.innerHTML = ''
	routeCacheProbeConnections = 0
	routeCacheProbeDisconnections = 0
	await goToPage('/');
})

describe('Page*', () => {
	describe('PageRoute', () => {
		
		it('should fail to load content and show fallback slot', async () => {
			jest.spyOn(window, 'fetch').mockImplementation(() => {
				return Promise.resolve({
					status: 404
				} as Response)
			});
			
			html`<page-route path="/test" src="/test"></page-route>`.render(document.body);
			
			const [r1] = Array.from(document.body.children) as PageRoute[];
			
			let slot = r1.contentRoot.querySelector('slot');
			expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r1.outerHTML).toBe('<page-route path="/test" src="/test" hidden=""></page-route>')
			
			await goToPage('/test');
			
			await flushMicrotasks()
			
			expect(r1.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="fallback"><p>Failed to load content</p></slot>');
		})

		it('treats module failures as terminal until the route is left', async () => {
			let moduleCallCount = 0

			registerRouteModules({
				'/async-fail': () => {
					moduleCallCount++
					return Promise.resolve({
						default: () => {
							throw new Error('boom')
						},
					})
				},
			})

			html`<page-route path="/async-fail" src="/async-fail"></page-route>`.render(document.body)

			const [route] = Array.from(document.body.children) as PageRoute[]

			await goToPage('/async-fail')
			await flushMicrotasks()

			expect(moduleCallCount).toBe(1)
			expect(
				route.contentRoot.querySelector('slot[name="fallback"]')
			).not.toBeNull()

			await goToPage('/async-fail')
			await flushMicrotasks()

			expect(moduleCallCount).toBe(1)

			await goToPage('/async-fail')
			await flushMicrotasks()

			expect(moduleCallCount).toBe(1)
		})

		it('treats load failure as terminal until the route is left', async () => {
			const fetchSpy = jest
				.spyOn(window, 'fetch')
				.mockResolvedValue({ status: 404 } as Response)

			html`<page-route path="/fail" src="/fail"></page-route>`.render(document.body);

			const [r1] = Array.from(document.body.children) as PageRoute[];

			await goToPage('/fail');
			await flushMicrotasks()

			expect(fetchSpy).toHaveBeenCalledTimes(1);
			expect(r1.contentRoot.querySelector('slot[name="fallback"]')).not.toBeNull();

			await goToPage('/fail');
			await flushMicrotasks()

			expect(fetchSpy).toHaveBeenCalledTimes(1);

			await goToPage('/');
			await flushMicrotasks()

			await goToPage('/fail');
			await flushMicrotasks()

			expect(fetchSpy).toHaveBeenCalledTimes(2);
			fetchSpy.mockRestore();
		})
		
		it('should fail during handling loaded content and show fallback slot', async () => {
			jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
				return Promise.resolve({
					status: 200,
					text: () => Promise.resolve(() => {
						throw new Error('failed')
					}),
				} as unknown as Response)
			});
			
			html`<page-route path="/sample" src="/sample"></page-route>`.render(document.body);
			
			const [r1] = Array.from(document.body.children) as PageRoute[];
			
			let slot = r1.contentRoot.querySelector('slot');
			expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r1.outerHTML).toBe('<page-route path="/sample" src="/sample" hidden=""></page-route>')
			
			await goToPage('/sample');
			
			await flushMicrotasks()
			
			expect(r1.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="fallback"><p>Failed to load content</p></slot>');
		})
		
		it('should render inner content with route static and fetched content', async () => {
			jest.spyOn(window, 'fetch').mockImplementation(() => {
				return Promise.resolve({
					status: 200,
					text: () => Promise.resolve('<p>Hello World</p>')
				} as Response)
			});
			
			html`
			<page-route path="/">Hello World</page-route>
			<page-route path="/test" src="/test"></page-route>`.render(document.body);
			
			expect(window.fetch).not.toHaveBeenCalled();
			
			await flushMicrotasks()
			
			const [r1, r2] = Array.from(document.body.children) as PageRoute[];
			
			expect(r1.outerHTML).toBe('<page-route path="/">Hello World</page-route>')
			expect(r1.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
			
			let slot = r2.contentRoot.querySelector('slot');
			expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r2.outerHTML).toBe('<page-route path="/test" src="/test" hidden=""></page-route>')
			
			expect(r2.contentRoot.querySelector('slot[name="loading"]')).toBeNull();
			
			await goToPage('/test');
			
			await flushMicrotasks()
			
			slot = r1.contentRoot.querySelector('slot');
			expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r1.outerHTML).toBe('<page-route path="/" hidden="">Hello World</page-route>')
			
			expect(r2.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
			expect(r2.outerHTML).toBe('<page-route path="/test" src="/test"><p>Hello World</p></page-route>')
		});

		it('unmounts inactive route content but remounts the same cached instance without reloading', async () => {
			let moduleCallCount = 0

			registerRouteModules({
				'/projects': () => {
					moduleCallCount += 1
					return Promise.resolve({
						default: html`<route-cache-probe></route-cache-probe>`,
					})
				},
			})

			html`
			<page-route path="/">Home</page-route>
			<page-route path="/projects" src="/projects"></page-route>
			`.render(document.body);

			const [, projectsRoute] = Array.from(document.body.children) as PageRoute[];

			await goToPage('/projects');
			await flushMicrotasks();

			const firstProbe = projectsRoute.querySelector('route-cache-probe')
			expect(moduleCallCount).toBe(1);
			expect(firstProbe).not.toBeNull();
			expect(routeCacheProbeConnections).toBe(1);
			expect(routeCacheProbeDisconnections).toBe(0);

			await goToPage('/');
			await flushMicrotasks();

			expect(moduleCallCount).toBe(1);
			expect(projectsRoute.querySelector('route-cache-probe')).toBeNull();
			expect(projectsRoute.hidden).toBe(true);
			expect(routeCacheProbeConnections).toBe(1);
			expect(routeCacheProbeDisconnections).toBe(1);

			await goToPage('/projects');
			await flushMicrotasks();

			const secondProbe = projectsRoute.querySelector('route-cache-probe')
			expect(moduleCallCount).toBe(1);
			expect(projectsRoute.hidden).toBe(false);
			expect(secondProbe).not.toBeNull();
			expect(secondProbe).toBe(firstProbe);
			expect(routeCacheProbeConnections).toBe(2);
			expect(routeCacheProbeDisconnections).toBe(1);
		})

		it('restores cached route content before generic page-change listeners run', async () => {
			registerRouteModules({
				'/projects': () =>
					Promise.resolve({
						default: html`<route-cache-probe></route-cache-probe>`,
					}),
				'/editor': () =>
					Promise.resolve({
						default: html`<p>Editor</p>`,
					}),
			})

			html`
			<page-route path="/projects" src="/projects"></page-route>
			<page-route path="/editor" src="/editor"></page-route>
			`.render(document.body)

			const [projectsRoute] = Array.from(document.body.children) as PageRoute[]

			await goToPage('/projects')
			await flushMicrotasks()

			await goToPage('/editor')
			await flushMicrotasks()

			const observedDuringPageChange: Array<Element | null> = []
			const unsubscribe = onPageChange(() => {
				observedDuringPageChange.push(
					projectsRoute.querySelector('route-cache-probe')
				)
			})

			observedDuringPageChange.length = 0

			await goToPage('/projects')
			await flushMicrotasks()

			expect(observedDuringPageChange[0]).not.toBeNull()
			unsubscribe()
		})
		
		it('should allow to nest routes', async () => {
			html`
			<page-route path="/todos" exact="false">
				Todos:
				<page-route path="/pending">pending todos</page-route>
				<page-route path="/in-progress">in progress todos</page-route>
				<page-route path="/completed">completed todos</page-route>
			</page-route>
		`.render(document.body);
			
			const [r1] = Array.from(document.body.children) as PageRoute[];
			const [r11, r12, r13] = Array.from(r1.children) as PageRoute[];
			
			let slot = r1.contentRoot.querySelector('slot');
			expect(r1.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			await goToPage('/todos');
			await flushMicrotasks()
			
			expect(r1.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			await goToPage('/todos/pending');
			await flushMicrotasks()
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			await goToPage('/todos/in-progress');
			await flushMicrotasks()
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			await goToPage('/todos/completed');
			await flushMicrotasks()
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
		})
		
		it('should allow to nest routes inside a component', async () => {
			class PageContent extends WebComponent {
				render() {
					return html`
					<page-route path="/pending">pending todos</page-route>
					<page-route path="/in-progress">in progress todos</page-route>
					<page-route path="/completed">completed todos</page-route>
				`
				}
			}
			
			customElements.define('page-content', PageContent)
			
			html`
			<page-route path="/todos" exact="false">
				Todos:
				<page-content></page-content>
			</page-route>
		`.render(document.body);
			
			const [r1] = Array.from(document.body.children) as PageRoute[];
			
			let slot = r1.contentRoot.querySelector('slot');
			expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			await goToPage('/todos');
			await flushMicrotasks()
			
			expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			const cont = r1.children[0] as  PageRoute;
			const [r11, r12, r13] = Array.from((cont.contentRoot as PageRoute).children) as PageRoute[];
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			await goToPage('/todos/pending');
			await flushMicrotasks()
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			await goToPage('/todos/in-progress');
			await flushMicrotasks()
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			await goToPage('/todos/completed');
			await flushMicrotasks()
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
		})
		
		describe('should import content', () => {
			it('with the js file as src attribute', async () => {
				fs.writeFileSync(path.resolve(__dirname, './sample.js'), `
				module.exports = () => ({render: el => {
					el.innerHTML = 'It works';
				}});
			`.trim())
				html`<page-route path="/sample" src="file:./sample.js"></page-route>`.render(document.body);
				
				const [r1] = Array.from(document.body.children) as PageRoute[];
				
				// content is not shown initially
				const slot = r1.contentRoot.querySelector('slot');
				expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
				expect(r1.outerHTML).toBe('<page-route path="/sample" src="file:./sample.js" hidden=""></page-route>')
				
				await goToPage('/sample');
				await flushMicrotasks()
				
				expect(console.error).not.toHaveBeenCalled();
				
				// r2 slot loses the name to show content
				expect(r1.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
				// the content is placed inside
				expect(r1.outerHTML).toBe('<page-route path="/sample" src="file:./sample.js">It works</page-route>')
				
				fs.rmSync(path.resolve(__dirname, './sample.js'))
			})
			
			it('with nested route', async () => {
				fs.writeFileSync(path.resolve(__dirname, './content.js'), `
				module.exports = () => ({render: el => {
					el.innerHTML = 'Todos:\\n' +
						'<page-route path="/pending">pending todos</page-route>\\n' +
						'<page-route path="/in-progress">in progress todos</page-route>\\n' +
						'<page-route path="/completed">completed todos</page-route>';
				}});
			`.trim())
				
				html`<page-route path="/todos" exact="false" src="file:./content.js"></page-route>`.render(document.body);
				
				const [r1] = Array.from(document.body.children) as PageRoute[];
				
				let slot = r1.contentRoot.querySelector('slot');
				
				expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
				expect(r1.outerHTML).toBe('<page-route path="/todos" exact="false" src="file:./content.js" hidden=""></page-route>')
				
				await goToPage('/todos/pending');
				await flushMicrotasks()
				
				expect(r1.outerHTML).toBe(
					'<page-route path="/todos" exact="false" src="file:./content.js">Todos:\n' +
					'<page-route path="/pending">pending todos</page-route>\n' +
					'<page-route path="/in-progress" hidden="">in progress todos</page-route>\n' +
					'<page-route path="/completed" hidden="">completed todos</page-route></page-route>')
				
				const [r11, r12, r13] = Array.from(r1.children) as PageRoute[];
				
				expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
				expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
				expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
				
				fs.rmSync(path.resolve(__dirname, './content.js'))
			})
			
			it('with the js file returning Node', async () => {
				fs.writeFileSync(path.resolve(__dirname, './diff.js'), `
				const el = document.createElement("p");
				el.textContent = 'It works'
				
				module.exports = el
			`.trim())
				html`<page-route path="/diff" src="file:./diff.js"></page-route>`.render(document.body);
				
				const [r1] = Array.from(document.body.children) as PageRoute[];
				
				// content is not shown initially
				const slot = r1.contentRoot.querySelector('slot');
				expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
				expect(r1.outerHTML).toBe('<page-route path="/diff" src="file:./diff.js" hidden=""></page-route>')
				
				await goToPage('/diff');
				await flushMicrotasks()
				
				expect(console.error).not.toHaveBeenCalled();
				
				// r2 slot loses the name to show content
				expect(r1.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
				// the content is placed inside
				expect(r1.outerHTML).toBe('<page-route path="/diff" src="file:./diff.js"><p>It works</p></page-route>')
				
				fs.rmSync(path.resolve(__dirname, './diff.js'))
			})
			
			it('with data and params', async () => {
				fs.writeFileSync(path.resolve(__dirname, './app.page.js'), `
				module.exports = (data, params, query) => {
					return params.appId + '|' + data.greeting
				};
			`.trim())
				html`<page-route path="/app/:appId" src="file:./app.page.js"></page-route>`.render(document.body);
				
				const [r1] = Array.from(document.body.children) as PageRoute[];
				
				// content is not shown initially
				const slot = r1.contentRoot.querySelector('slot');
				expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
				expect(r1.outerHTML).toBe('<page-route path="/app/:appId" src="file:./app.page.js" hidden=""></page-route>')
				
				await goToPage('/app/my-app', {greeting: "Hello"});
				await flushMicrotasks()
				
				// r2 slot loses the name to show content
				expect(r1.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
				// the content is placed inside
				expect(r1.outerHTML).toBe('<page-route path="/app/:appId" src="file:./app.page.js">my-app|Hello</page-route>')
				
				fs.rmSync(path.resolve(__dirname, './app.page.js'))
			})
		})
	})
	
	describe('PageRouteQuery', () => {
		it('should render inner content with route query static and fetched content', async () => {
			jest.spyOn(window, 'fetch').mockImplementation(() => {
				return Promise.resolve({
					status: 200,
					text: () => Promise.resolve('<p>Hello World</p>')
				} as Response)
			});
			
			expect(location.pathname).toBe('/')
			expect(location.search).toBe('')
			
			html`
				<page-route-query key="tab" value="one">Tab 1</page-route-query>
				<page-route-query key="tab" value="two" src="/tabs"></page-route-query>
			`.render(document.body);
			
			const [r1, r2] = Array.from(document.body.children) as PageRouteQuery[];
			
			expect(r1.outerHTML).toBe('<page-route-query key="tab" value="one" hidden="">Tab 1</page-route-query>')
			expect(r1.contentRoot.innerHTML.trim()).toBe('<slot name="hidden"></slot>')
			expect(r2.outerHTML).toBe('<page-route-query key="tab" value="two" src="/tabs" hidden=""></page-route-query>')
			expect(r2.contentRoot.innerHTML.trim()).toBe('<slot name="hidden"></slot>')
			
			await goToPage('/?tab=one');
			await flushMicrotasks()
			
			expect(location.pathname).toBe('/')
			expect(location.search).toBe('?tab=one')
			
			expect(window.fetch).not.toHaveBeenCalled();
			
			expect(r1.outerHTML).toBe('<page-route-query key="tab" value="one">Tab 1</page-route-query>')
			expect(r1.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
			expect(r2.outerHTML).toBe('<page-route-query key="tab" value="two" src="/tabs" hidden=""></page-route-query>')
			expect(r2.contentRoot.innerHTML.trim()).toBe('<slot name="hidden"></slot>')
			
			await goToPage('/?tab=two');
			
			expect(window.fetch).toHaveBeenCalledTimes(1);
			await flushMicrotasks()
			
			expect(r1.outerHTML).toBe('<page-route-query key="tab" value="one" hidden="">Tab 1</page-route-query>')
			expect(r1.contentRoot.innerHTML.trim()).toBe('<slot name="hidden"></slot>')
			expect(r2.outerHTML).toBe('<page-route-query key="tab" value="two" src="/tabs"><p>Hello World</p></page-route-query>')
			expect(r2.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
		});
		
		it('should render tabs accordingly', async () => {
			html`
				<page-link search="tab=one">Tab 1</page-link>
				<page-link search="tab=two">Tab 2</page-link>
				
				<page-route-query key="tab" value="one">
					Tab One content
				</page-route-query>
				
				<page-route-query key="tab" value="two">
					Tab Two content
				</page-route-query>
			`.render(document.body);

			const [link1, link2, rq1, rq2] = Array.from(document.body.children) as WebComponent[];
			
			expect(document.body.innerHTML).toBe('<page-link search="tab=one">Tab 1</page-link>\n' +
					'\t\t\t\t<page-link search="tab=two">Tab 2</page-link>\n' +
					'\t\t\t\t\n' +
					'\t\t\t\t<page-route-query key="tab" value="one" hidden="">\n' +
					'\t\t\t\t\tTab One content\n' +
					'\t\t\t\t</page-route-query>\n' +
					'\t\t\t\t\n' +
					'\t\t\t\t<page-route-query key="tab" value="two" hidden="">\n' +
					'\t\t\t\t\tTab Two content\n' +
					'\t\t\t\t</page-route-query>');
			
			expect(location.pathname).toBe('/');
			expect(location.search).toBe('');
			
			expect(rq1.hidden).toBeTruthy()
			expect(rq2.hidden).toBeTruthy()
   
			link1.contentRoot.querySelector('a')?.click()
			// Wait for async navigation
            await flushMicrotasks()

			expect(location.search).toBe('?tab=one');

			expect(rq1.hidden).toBeFalsy()
			expect(rq2.hidden).toBeTruthy()

			link2.contentRoot.querySelector('a')?.click()
			// Wait for async navigation
            await flushMicrotasks()

			expect(location.search).toBe('?tab=two');

			expect(rq1.hidden).toBeTruthy()
			expect(rq2.hidden).toBeFalsy()
		});
	})
})

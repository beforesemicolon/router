import * as WB from '@beforesemicolon/web-component'
import {html, WebComponent} from '@beforesemicolon/web-component'
import {goToPage} from '../pages'
import * as fs from 'fs'
import * as path from 'path'
import {PageRoute, PageRouteQuery} from '../types'
import iniWithRoute from './page-route'

iniWithRoute(WB)

beforeEach(() => {
	document.body.innerHTML = ''
	goToPage('/');
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
			
			goToPage('/test');
			
			await jest.advanceTimersByTimeAsync(500)
			
			expect(r1.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="fallback"><p>Failed to load content</p></slot>');
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
			
			goToPage('/sample');
			
			await jest.advanceTimersByTimeAsync(500)
			
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
			
			jest.advanceTimersByTime(300)
			
			const [r1, r2] = Array.from(document.body.children) as PageRoute[];
			
			expect(r1.outerHTML).toBe('<page-route path="/">Hello World</page-route>')
			expect(r1.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
			
			let slot = r2.contentRoot.querySelector('slot');
			expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r2.outerHTML).toBe('<page-route path="/test" src="/test" hidden=""></page-route>')
			
			expect(r2.contentRoot.querySelector('slot[name="loading"]')).toBeNull();
			
			goToPage('/test');
			
			await jest.advanceTimersByTimeAsync(0)
			
			slot = r1.contentRoot.querySelector('slot');
			expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r1.outerHTML).toBe('<page-route path="/" hidden="">Hello World</page-route>')
			
			expect(r2.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
			expect(r2.outerHTML).toBe('<page-route path="/test" src="/test"><p>Hello World</p></page-route>')
		});
		
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
			
			goToPage('/todos');
			await jest.advanceTimersByTimeAsync(0)
			
			expect(r1.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			goToPage('/todos/pending');
			await jest.advanceTimersByTimeAsync(0)
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			goToPage('/todos/in-progress');
			await jest.advanceTimersByTimeAsync(0)
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			goToPage('/todos/completed');
			await jest.advanceTimersByTimeAsync(0)
			
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
			
			goToPage('/todos');
			await jest.advanceTimersByTimeAsync(0)
			
			expect(slot?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			const cont = r1.children[0] as  PageRoute;
			const [r11, r12, r13] = Array.from((cont.contentRoot as PageRoute).children) as PageRoute[];
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			goToPage('/todos/pending');
			await jest.advanceTimersByTimeAsync(0)
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			goToPage('/todos/in-progress');
			await jest.advanceTimersByTimeAsync(0)
			
			expect(r11.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			expect(r12.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot></slot>')
			expect(r13.contentRoot.querySelector('slot')?.outerHTML).toBe('<slot name="hidden"></slot>')
			
			goToPage('/todos/completed');
			await jest.advanceTimersByTimeAsync(0)
			
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
				
				goToPage('/sample');
				await jest.advanceTimersByTimeAsync(0)
				
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
				
				goToPage('/todos/pending');
				await jest.advanceTimersByTimeAsync(0)
				
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
				
				goToPage('/diff');
				await jest.advanceTimersByTimeAsync(0)
				
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
				
				goToPage('/app/my-app', {greeting: "Hello"});
				await jest.advanceTimersByTimeAsync(0)
				
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
			jest.useFakeTimers()
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
			
			goToPage('/?tab=one');
			await jest.advanceTimersByTimeAsync(500)
			
			expect(location.pathname).toBe('/')
			expect(location.search).toBe('?tab=one')
			
			expect(window.fetch).not.toHaveBeenCalled();
			
			expect(r1.outerHTML).toBe('<page-route-query key="tab" value="one">Tab 1</page-route-query>')
			expect(r1.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
			expect(r2.outerHTML).toBe('<page-route-query key="tab" value="two" src="/tabs" hidden=""></page-route-query>')
			expect(r2.contentRoot.innerHTML.trim()).toBe('<slot name="hidden"></slot>')
			
			goToPage('/?tab=two');
			
			expect(window.fetch).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(500)
			
			expect(r1.outerHTML).toBe('<page-route-query key="tab" value="one" hidden="">Tab 1</page-route-query>')
			expect(r1.contentRoot.innerHTML.trim()).toBe('<slot name="hidden"></slot>')
			expect(r2.outerHTML).toBe('<page-route-query key="tab" value="two" src="/tabs"><p>Hello World</p></page-route-query>')
			expect(r2.contentRoot.innerHTML.trim()).toBe('<slot></slot>')
		});
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
				<page-redirect to="/todos/pending"></page-redirect>
			</page-route>
			<page-route path="/404">404 - Page not found</page-route>
			<page-redirect to="/404"></page-redirect>
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
					<page-redirect to="/todos/pending" type="always"></page-redirect>
				</page-route>
				<page-route path="/404"></page-route>
				
				<page-redirect to="/todos" type="always" title="Todo list"></page-redirect>
				<page-redirect to="/404" title="404 - Page not found"></page-redirect>
			`.render(document.body);
			
			expect(location.pathname).toBe('/todos/pending')
			
			goToPage('/unknown');
			
			expect(location.pathname).toBe('/404')
		})
	})
})

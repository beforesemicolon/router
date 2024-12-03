import iniPageRoute from './page-data'
import * as WB from "@beforesemicolon/web-component";
import { html, WebComponent } from '@beforesemicolon/web-component'
import { goToPage, registerRoute } from '../pages'

iniPageRoute(WB)

describe('PageData', () => {
	registerRoute('/sample/:id', true)
	registerRoute('/todos/:id/:name', true)
	
	beforeEach(() => {
		document.body.innerHTML = ''
		goToPage('/');
	})
	
	it('should render param', async () => {
		html`<page-data param="id"></page-data><page-data param="name"></page-data>`.render(document.body)
		
		expect(document.body.innerHTML).toBe('<page-data param="id"></page-data><page-data param="name"></page-data>')
		
		goToPage('/todos/893427neuwidwioerwieru3843/pick kids up');
		jest.advanceTimersToNextTimer()
		
		let[id, name] = [...document.body.children] as WebComponent[];
		
		expect(id.contentRoot.innerHTML).toBe('893427neuwidwioerwieru3843')
		expect(name.contentRoot.innerHTML).toBe('pick kids up')
	});
	
	it('should render data', async () => {
		html`
			<page-data></page-data>
			<page-data>fallback</page-data>
			<page-data key="name"></page-data>
			<page-data key="status.code"></page-data>
			<page-data key="status.name"></page-data>
		`.render(document.body)
		
		const pds = [...document.body.children] as WebComponent[];
		
		expect(pds.map(pd => pd.contentRoot.innerHTML)).toEqual(
			[
				"<slot></slot>",
				"<slot></slot>",
				"<slot></slot>",
				"<slot></slot>",
				"<slot></slot>"
			])
		
		goToPage('/sample/893427neuwidwioerwieru3843', {
			name: 'go to bed',
			status: {
				code: 1,
				name: 'pending'
			}
		})
		jest.advanceTimersToNextTimer()

		expect(pds.map(pd => pd.contentRoot.innerHTML)).toEqual(
			[
				"{\"name\":\"go to bed\",\"status\":{\"code\":1,\"name\":\"pending\"}}",
				"{\"name\":\"go to bed\",\"status\":{\"code\":1,\"name\":\"pending\"}}",
				"go to bed",
				"<slot></slot>",
				"pending"
			])
	});
	
	it('should render search', async () => {
		html`
			<page-data search-param="sample"></page-data>
			<page-data search-param="foo"></page-data>
		`.render(document.body)
		
		const pds = [...document.body.children] as WebComponent[];
		
		expect(pds.map(pd => pd.contentRoot.innerHTML)).toEqual(
			[
				"<slot></slot>",
				"<slot></slot>"
			])
		
		goToPage('/?sample=value')
		jest.advanceTimersToNextTimer()
		
		expect(pds.map(pd => pd.contentRoot.innerHTML)).toEqual(
			[
				"value",
				"<slot></slot>"
			])
		
		goToPage('/?foo=some value')
		jest.advanceTimersToNextTimer()
		
		expect(pds.map(pd => pd.contentRoot.innerHTML)).toEqual(
			[
				"<slot></slot>",
				"some value",
			])
		
		goToPage('/?sample=value&foo=bar')
		jest.advanceTimersToNextTimer()
		
		expect(pds.map(pd => pd.contentRoot.innerHTML)).toEqual(
			[
				"value",
				"bar",
			])
	});
})

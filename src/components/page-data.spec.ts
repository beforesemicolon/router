import iniPageRoute from './page-data'
import * as WB from "@beforesemicolon/web-component";
import {html} from "@beforesemicolon/web-component";
import { goToPage, registerRoute } from '../pages'

iniPageRoute(WB)

describe('PageData', () => {
	registerRoute('/sample/:id', true)
	
	beforeEach(() => {
		document.body.innerHTML = ''
		goToPage('/');
	})
	
	it('should render param', async () => {
		html`
			<page-data param="id"></page-data>
		`.render(document.body)
		
		expect(document.body.innerHTML).toBe('<page-data param="id"></page-data>')
		
		goToPage('/sample/893427neuwidwioerwieru3843')
		
		expect(document.body.innerHTML).toBe('<page-data param="id">893427neuwidwioerwieru3843</page-data>')
	});
	
	it('should render data', async () => {
		html`
			<page-data></page-data>
			<page-data key="name"></page-data>
			<page-data key="status.code"></page-data>
			<page-data key="status.name"></page-data>
		`.render(document.body)
		
		expect(document.body.innerHTML).toBe('<page-data>{}</page-data>\n' +
			'\t\t\t<page-data key="name">{}</page-data>\n' +
			'\t\t\t<page-data key="status.code">{}</page-data>\n' +
			'\t\t\t<page-data key="status.name">{}</page-data>')
		
		goToPage('/sample/893427neuwidwioerwieru3843', {
			name: 'go to bed',
			status: {
				code: 1,
				name: 'pending'
			}
		})
		
		expect(document.body.innerHTML).toBe('<page-data>{"name":"go to bed","status":{"code":1,"name":"pending"}}</page-data>\n' +
			'\t\t\t<page-data key="name">go to bed</page-data>\n' +
			'\t\t\t<page-data key="status.code">1</page-data>\n' +
			'\t\t\t<page-data key="status.name">pending</page-data>')
	});
	
	it('should render search', async () => {
		html`
			<page-data search-param="sample"></page-data>
			<page-data search-param="foo"></page-data>
		`.render(document.body)
		
		expect(document.body.innerHTML).toBe('<page-data search-param="sample"></page-data>\n' +
			'\t\t\t<page-data search-param="foo"></page-data>')
		
		goToPage('/?sample=value')
		
		expect(document.body.innerHTML).toBe('<page-data search-param="sample">value</page-data>\n' +
			'\t\t\t<page-data search-param="foo"></page-data>')
		
		goToPage('/?foo=bar')
		
		expect(document.body.innerHTML).toBe('<page-data search-param="sample"></page-data>\n' +
			'\t\t\t<page-data search-param="foo">bar</page-data>')
		
		goToPage('/?sample=value&foo=bar')
		
		expect(document.body.innerHTML).toBe('<page-data search-param="sample">value</page-data>\n' +
			'\t\t\t<page-data search-param="foo">bar</page-data>')
	});
})

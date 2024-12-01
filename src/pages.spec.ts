import {
	goToPage,
	onPageChange,
	previousPage,
	replacePage,
	nextPage,
	updateSearchQuery,
	registerRoute,
	getPageParams, isRegisteredRoute, parsePathname,
} from './pages'

describe('pages', () => {
	const onPageChangeListener = jest.fn();
	
	const unsub = onPageChange(onPageChangeListener)
	
	afterAll(() => {
		unsub();
	})
	
	beforeEach(() => {
		goToPage('/')
	})
	
	it('should go to page', async () => {
		expect(location.pathname).toBe('/');

		goToPage('/sample')

		expect(onPageChangeListener).toHaveBeenCalledWith('/sample', {}, {})
		
		goToPage('/test', {data: 1000}, 'test page')

		expect(onPageChangeListener).toHaveBeenCalledWith('/test', {}, {data: 1000})
		expect(history.state).toEqual({data: 1000})
		expect(document.title).toBe('test page')
	});
	
	it('should go to previous and next page', () => {
		expect(location.pathname).toBe('/');
		
		goToPage('/sample')
		
		expect(location.pathname).toBe('/sample');
		
		previousPage()
		
		jest.advanceTimersByTime(300)
		
		expect(location.pathname).toBe('/')
		
		nextPage()
		
		jest.advanceTimersByTime(300)
		
		expect(location.pathname).toBe('/sample')
	});
	
	it('should replace page', () => {
		replacePage('/new', {data: 3000}, 'new page')
		
		jest.advanceTimersByTime(300)
		
		expect(location.pathname).toBe('/new')
		expect(history.state).toEqual({data: 3000})
		expect(document.title).toBe('new page')
	});
	
	it('should update search query', () => {
		expect(location.search).toBe('');
		
		updateSearchQuery({
			"date": "2020-01-01",
			"sample": "30"
		})
		
		expect(location.search).toEqual('?date=2020-01-01&sample=30');
		
		updateSearchQuery({
			"item": {name: "test", price: 30}
		})
		
		expect(location.search).toEqual('?date=2020-01-01&sample=30&item=%7B%22name%22%3A%22test%22%2C%22price%22%3A30%7D');
		
		updateSearchQuery(null)
		
		expect(location.search).toEqual('');
	});
	
	it('should get page params', async () => {
		goToPage('/')
		
		expect(getPageParams()).toEqual({})
		
		expect(location.pathname).toBe('/');
		
		registerRoute('/app/:name/details')
		
		goToPage('/app/my-app/details')
		
		expect(location.pathname).toBe('/app/my-app/details');
		expect(getPageParams()).toEqual({"name": "my-app"})
		expect(isRegisteredRoute(location.pathname)).toBeTruthy()
		expect(parsePathname('/app/:name/details')).toBe('/app/my-app/details')
	});
})

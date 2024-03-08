import {goToPage, onPageChange, previousPage, replacePage, nextPage, updateSearchQuery} from "./pages";

describe('pages', () => {
	const onPageChangeListener = jest.fn();
	
	const unsub = onPageChange(onPageChangeListener)
	
	afterAll(() => {
		unsub();
	})
	
	it('should go to page', () => {
		expect(history.length).toBe(1);
		expect(location.pathname).toBe('/');

		goToPage('/sample')

		expect(onPageChangeListener).toHaveBeenCalledWith('/sample', {})
		expect(history.length).toBe(2);

		goToPage('/test', {data: 1000}, 'test page')

		expect(onPageChangeListener).toHaveBeenCalledWith('/test', {})
		expect(history.state).toEqual({data: 1000})
		expect(document.title).toBe('test page')
		expect(history.length).toBe(3);
	});
	
	it('should go to previous page', (done) => {
		expect(history.length).toBe(3);
		
		previousPage()
		
		setTimeout(() => {
			expect(history.length).toBe(3); // remains the same
			expect(location.pathname).toBe('/sample')
			expect(history.state).toEqual({})
			expect(document.title).toBe('test page')
			done()
		}, 300)
	});
	
	it('should go to next page', (done) => {
		expect(history.length).toBe(3);
		nextPage()
		
		setTimeout(() => {
			expect(history.length).toBe(3); // remains the same
			expect(location.pathname).toBe('/test')
			expect(history.state).toEqual({data: 1000})
			expect(document.title).toBe('test page')
			done()
		}, 300)
	});
	
	it('should replace page', (done) => {
		expect(history.length).toBe(3);
		replacePage('/new', {data: 3000}, 'new page')
		
		setTimeout(() => {
			expect(history.length).toBe(3); // remains the same
			expect(location.pathname).toBe('/new')
			expect(history.state).toEqual({data: 3000})
			expect(document.title).toBe('new page')
			done()
		}, 300)
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
})

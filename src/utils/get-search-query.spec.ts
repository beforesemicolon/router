import {getSearchQuery} from './get-search-query';
import {updateSearchQuery} from '../pages';

describe('getSearchQuery', () => {
	it('should return a query string', () => {
		expect(getSearchQuery()).toEqual({});
		
		updateSearchQuery({
			date: "2020-01-01",
			sample: "30",
			item: {name: "test", price: 30}
		})
		
		expect(getSearchQuery()).toEqual({
			"date": "2020-01-01",
			"item": {
				"name": "test",
				"price": 30
			},
			"sample": 30
		});
	});
})

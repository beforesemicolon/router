import {isOnPage} from "./is-on-page";
import {goToPage} from "../pages";

describe('isOnPage', () => {
	it('should match pathname exact', () => {
		goToPage('/sample/name')
		
		expect(isOnPage('/sample/name')).toBeTruthy()
		expect(isOnPage('/sample/name/')).toBeTruthy()
		expect(isOnPage('/sample/name/?tab=one')).toBeFalsy()
		expect(isOnPage('/sample/?tab=one')).toBeFalsy()
		expect(isOnPage('/sample')).toBeFalsy()
		expect(isOnPage('/sample/name/edit')).toBeFalsy()
		expect(isOnPage('/edit')).toBeFalsy()
		
		goToPage('/sample')
		
		expect(isOnPage('/sample/name')).toBeFalsy()
		expect(isOnPage('/sample/name/')).toBeFalsy()
		expect(isOnPage('/sample/name/?tab=one')).toBeFalsy()
		expect(isOnPage('/sample/?tab=one')).toBeFalsy()
		expect(isOnPage('/sample')).toBeTruthy()
		expect(isOnPage('/sample/name/edit')).toBeFalsy()
		expect(isOnPage('/edit')).toBeFalsy()
	});
	
	it('should match pathname NOT exact', () => {
		goToPage('/sample/name')
		
		expect(isOnPage('/sample/name', false)).toBeTruthy()
		expect(isOnPage('/sample/name/', false)).toBeTruthy()
		expect(isOnPage('/sample/name/?tab=one', false)).toBeFalsy()
		expect(isOnPage('/sample/?tab=one', false)).toBeFalsy()
		expect(isOnPage('/sample', false)).toBeTruthy()
		expect(isOnPage('/sample/name/edit', false)).toBeFalsy()
		expect(isOnPage('/edit', false)).toBeFalsy()
		
		goToPage('/sample')
		
		expect(isOnPage('/sample/name', false)).toBeFalsy()
		expect(isOnPage('/sample/name/', false)).toBeFalsy()
		expect(isOnPage('/sample/name/?tab=one', false)).toBeFalsy()
		expect(isOnPage('/sample/?tab=one', false)).toBeFalsy()
		expect(isOnPage('/sample', false)).toBeTruthy()
		expect(isOnPage('/sample/name/edit', false)).toBeFalsy()
		expect(isOnPage('/edit', false)).toBeFalsy()
	});

	it('should match pathname and search', () => {
		goToPage('/sample/?tab=two')

		expect(isOnPage('/sample/?tab=one')).toBeFalsy()
		expect(isOnPage('/sample/?tab=one', false)).toBeFalsy()
		expect(isOnPage('/sample/?tab=two')).toBeTruthy()
		expect(isOnPage('/sample')).toBeTruthy()
		
		goToPage('/sample/?page=one&tab=two')
		
		expect(isOnPage('/sample/?tab=two', false)).toBeFalsy()
		expect(isOnPage('/sample/?page=one&tab=two', false)).toBeTruthy()
		expect(isOnPage('/sample/?page=one', false)).toBeTruthy()
		expect(isOnPage('/sample/?tab=two&page=one', false)).toBeFalsy()
	});
})

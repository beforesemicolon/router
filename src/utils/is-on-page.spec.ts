import {isOnPage} from "./is-on-page";
import {goToPage} from "../pages";

describe('isOnPage', () => {
	it('should match pathname', () => {
		goToPage('/sample/name')

		expect(isOnPage('/sample/name')).toBeTruthy()
		expect(isOnPage('/sample/name/')).toBeTruthy()
		expect(isOnPage('/sample/?tab=one')).toBeFalsy()
		expect(isOnPage('/sample')).toBeFalsy()
		expect(isOnPage('/sample/name/edit')).toBeFalsy()
	});

	it('should match pathname and search', () => {
		goToPage('/sample/?tab=two')

		// expect(isOnPage('/sample/?tab=one')).toBeFalsy()
		expect(isOnPage('/sample/?tab=two')).toBeTruthy()
	});
})

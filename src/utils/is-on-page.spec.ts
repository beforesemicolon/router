import {isOnPage} from "./is-on-page";
import {goToPage} from "../pages";

describe('isOnPage', () => {
	goToPage('/sample/name')
	
	it('should be truthy', () => {
		expect(isOnPage('/sample/name')).toBeTruthy()
		expect(isOnPage('/sample/name/')).toBeTruthy()
	});
	
	it('should be falsy', () => {
		expect(isOnPage('/sample')).toBeFalsy()
		expect(isOnPage('/sample/name/edit')).toBeFalsy()
	});
})

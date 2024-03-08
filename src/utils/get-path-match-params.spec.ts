import {getPathMatchParams} from "./get-path-match-params";
import {pathStringToPattern} from "./path-string-to-pattern";

describe('getPathMatchParams', () => {
	it('should return empty params', () => {
		expect(getPathMatchParams('/', pathStringToPattern('/'))).toEqual({})
		expect(getPathMatchParams('/sample', pathStringToPattern('/sample'))).toEqual({})
		expect(getPathMatchParams('/', pathStringToPattern('/:sample'))).toEqual(null)
	});
	
	it('should return null if no matching path', () => {
		expect(getPathMatchParams('/', pathStringToPattern('/:sample'))).toEqual(null)
		expect(getPathMatchParams('/sample', pathStringToPattern('/'))).toEqual(null)
	});
	
	it('should return all params', () => {
		expect(getPathMatchParams('/123', pathStringToPattern('/:userId'))).toEqual({"userId": '123'})
		expect(getPathMatchParams('/123/delete', pathStringToPattern('/:userId/delete'))).toEqual({"userId": '123'})
		expect(getPathMatchParams('/update/123/name', pathStringToPattern('/update/:userId/name'))).toEqual({"userId": '123'})
	});
})

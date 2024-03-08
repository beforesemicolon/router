import {pathStringToPattern} from "./path-string-to-pattern";

describe('pathStringToPattern', () => {
	
	it('should create pattern and params', () => {
		expect(pathStringToPattern('/')).toEqual({
			"params": [],
			"pattern": /^\/?$/
		})
		expect(pathStringToPattern('/sample')).toEqual({
			"params": [],
			"pattern": /^\/sample$/
		})
		expect(pathStringToPattern('/:sample')).toEqual({
			"params": ['sample'],
			"pattern": /^\/([^/]+)$/
		})
		expect(pathStringToPattern('/sample/name')).toEqual({
			"params": [],
			"pattern": /^\/sample\/name$/
		})
		expect(pathStringToPattern('/sample/:name')).toEqual({
			"params": ['name'],
			"pattern": /^\/sample\/([^/]+)$/
		})
		expect(pathStringToPattern('/sample/:name/end')).toEqual({
			"params": ['name'],
			"pattern": /^\/sample\/([^/]+)\/end$/
		})
		expect(pathStringToPattern('/sample/:name/:end')).toEqual({
			"params": ['name', 'end'],
			"pattern": /^\/sample\/([^/]+)\/([^/]+)$/
		})
	});
})

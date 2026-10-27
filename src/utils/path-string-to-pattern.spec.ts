import {pathStringToPattern} from "./path-string-to-pattern";

describe('pathStringToPattern', () => {
	
	it('should create pattern and params', () => {
		expect(pathStringToPattern('/')).toEqual({
			"params": [],
			"pattern": /^\/$/
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

describe('literal route characters', () => {
    it.each(['.', '+', '*', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\'])('matches repeated %s literally', (character) => {
        const path = `/a${character}b${character}c`
        const { pattern } = pathStringToPattern(path)
        expect(pattern.test(path)).toBe(true)
        expect(pattern.test('/abc')).toBe(false)
    })

    it('does not treat dots or alternation as route patterns', () => {
        expect(pathStringToPattern('/v1.0').pattern.test('/v1x0')).toBe(false)
        expect(pathStringToPattern('/admin|public').pattern.test('/admin/other')).toBe(false)
    })

    it('keeps parameter captures separate from literal parentheses', () => {
        const { pattern, params } = pathStringToPattern('/team(s)/:id/:action')
        expect(params).toEqual(['id', 'action'])
        expect('/team(s)/42/edit'.match(pattern)?.slice(1)).toEqual(['42', 'edit'])
    })

    it('preserves non-exact descendants and optional endings', () => {
        const { pattern } = pathStringToPattern('/v1.0/index.html', false)
        expect(pattern.test('/v1.0')).toBe(true)
        expect(pattern.test('/v1.0/child')).toBe(true)
        expect(pattern.test('/v1x0/child')).toBe(false)
        expect(pattern.test('/v1.0suffix')).toBe(false)
    })

    it('escapes a backslash before a question mark', () => {
        const path = '/a\\?b\\?c'
        expect(pathStringToPattern(path).pattern.test(path)).toBe(true)
    })
})

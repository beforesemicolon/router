import {
	goToPage,
	onPageChange,
	previousPage,
	replacePage,
	nextPage,
	updateSearchQuery,
	registerRoute,
	getPageParams, isRegisteredRoute, parsePathname,
	setRoutingMode, getRoutingMode, registerGlobalGuard, registerRouteModules, getRouteModule, getRouteMeta,
    registerRouteGuard,
} from './pages'

describe('pages', () => {
	const onPageChangeListener = jest.fn();
	
	const unsub = onPageChange(onPageChangeListener)
	
	beforeAll(() => {
		// Set to history mode for tests
		setRoutingMode('history');
	})
	
	afterAll(() => {
		unsub();
	})
    
    beforeEach(async () => {
        // Clean up registered guards before each test
        // Note: We can't easily clear guards, so tests should be independent
        await goToPage('/')
    })
	
	beforeEach(async () => {
		await goToPage('/')
		onPageChangeListener.mockClear();
	})
	
	it('should go to page', async () => {
		expect(location.pathname).toBe('/');

		await goToPage('/sample')

		expect(onPageChangeListener).toHaveBeenCalledWith('/sample', {}, {})
		
		await goToPage('/test', {data: 1000}, 'test page')

		expect(onPageChangeListener).toHaveBeenCalledWith('/test', {}, {data: 1000})
		expect(history.state).toEqual({data: 1000})
		expect(document.title).toBe('test page')
	});
	
	it('should go to previous and next page', async () => {
		expect(location.pathname).toBe('/');
		
		await goToPage('/sample')
		
		expect(location.pathname).toBe('/sample');
		
		previousPage()
		
		jest.advanceTimersByTime(300)
		
		expect(location.pathname).toBe('/')
		
		nextPage()
		
		jest.advanceTimersByTime(300)
		
		expect(location.pathname).toBe('/sample')
	});
	
	it('should replace page', async () => {
		await replacePage('/new', {data: 3000}, 'new page')
		
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
		await goToPage('/')
		
		expect(getPageParams()).toEqual({})
		
		expect(location.pathname).toBe('/');
		
		registerRoute('/app/:name/details')
		
		await goToPage('/app/my-app/details')
		
		expect(location.pathname).toBe('/app/my-app/details');
		expect(getPageParams()).toEqual({"name": "my-app"})
		expect(isRegisteredRoute(location.pathname)).toBeTruthy()
		expect(parsePathname('/app/:name/details')).toBe('/app/my-app/details')
	});
    
    describe('Route Guards', () => {
        it('should allow navigation when guard returns true', async () => {
            let guardCalled = false
            registerRouteGuard('/protected', () => {
                guardCalled = true
                return true
            })
            
            await goToPage('/protected')
            await jest.advanceTimersByTimeAsync(0)
            
            expect(guardCalled).toBe(true)
            expect(location.pathname).toBe('/protected')
        })
        
        it('should block navigation when guard returns false', async () => {
            registerRouteGuard('/blocked', () => {
                return false
            })
            
            await goToPage('/blocked')
            await jest.advanceTimersByTimeAsync(0)
            
            expect(location.pathname).toBe('/') // Should stay at original location
        })
        
        it('should redirect when guard returns string', async () => {
            registerRouteGuard('/admin', () => {
                return '/login' // Redirect to login
            })
            
            await goToPage('/admin')
            await jest.advanceTimersByTimeAsync(0)
            
            expect(location.pathname).toBe('/login')
        })
        
        it('should support async guards', async () => {
            let asyncGuardCompleted = false
            registerRouteGuard('/async-protected', async () => {
                // Simulate async operation without setTimeout
                await Promise.resolve()
                asyncGuardCompleted = true
                return true
            })
            
            await goToPage('/async-protected')
            await jest.advanceTimersByTimeAsync(0)
            
            expect(asyncGuardCompleted).toBe(true)
            expect(location.pathname).toBe('/async-protected')
        })
        
        it('should support global guards', async () => {
            let globalGuardCalled = false
            registerGlobalGuard((pathname) => {
                globalGuardCalled = true
                if (pathname === '/forbidden') {
                    return false
                }
                return true
            })
            
            await goToPage('/some-page')
            await jest.advanceTimersByTimeAsync(0)
            expect(globalGuardCalled).toBe(true)
            expect(location.pathname).toBe('/some-page')
            
            await goToPage('/forbidden')
            await jest.advanceTimersByTimeAsync(0)
            expect(location.pathname).toBe('/some-page') // Should stay at previous location
        })
        
        it('should pass pathname, query, and data to guards', async () => {
            let receivedPathname: string | null = null
            let receivedQuery: Record<string, unknown> | null = null
            let receivedData: Record<string, unknown> | null = null
            
            registerGlobalGuard((pathname, query, data) => {
                receivedPathname = pathname
                receivedQuery = query
                receivedData = data
                return true
            })
            
            await goToPage('/test-guard', { user: 'test' }, 'Test Page')
            await jest.advanceTimersByTimeAsync(0)
            
            expect(receivedPathname).toBe('/test-guard')
            expect(receivedQuery).toBeDefined()
            expect(receivedData).toEqual({ user: 'test' })
        })
    })
    
    describe('Hash Routing', () => {
        it('should switch to hash routing mode', () => {
            setRoutingMode('hash')
            expect(getRoutingMode()).toBe('hash')
            
            setRoutingMode('history')
            expect(getRoutingMode()).toBe('history')
        })
        
        it('should navigate using hash in hash mode', async () => {
            setRoutingMode('hash')
            
            await goToPage('/test-hash')
            await jest.advanceTimersByTimeAsync(0)
            
            expect(location.hash).toBe('#/test-hash')
            
            setRoutingMode('history')
        })
        
        it('should handle search params in hash mode', async () => {
            setRoutingMode('hash')
            
            await goToPage('/test?foo=bar')
            await jest.advanceTimersByTimeAsync(0)
            
            expect(location.hash).toBe('#/test?foo=bar')
            
            setRoutingMode('history')
        })
    })
    
    describe('Module Registry', () => {
        it('should register route modules', () => {
            const modules = {
                './pages/home.ts': () => Promise.resolve({ default: 'Home' }),
                './pages/about.ts': () => Promise.resolve({ default: 'About' }),
            }
            
            registerRouteModules(modules)
            
            expect(getRouteModule('./pages/home.ts')).toBeDefined()
            expect(getRouteModule('./pages/about.ts')).toBeDefined()
        })
        
        it('should return undefined for unregistered modules', () => {
            expect(getRouteModule('./pages/nonexistent.ts')).toBeUndefined()
        })
        
        it('should load registered module', async () => {
            const mockModule = { default: '<h1>Test Content</h1>' }
            registerRouteModules({
                './test-module.ts': () => Promise.resolve(mockModule),
            })
            
            const loader = getRouteModule('./test-module.ts')
            expect(loader).toBeDefined()
            
            if (loader) {
                const result = await loader()
                expect(result).toEqual(mockModule)
            }
        })
    })
    
    describe('Route Metadata', () => {
        it('should store and retrieve route metadata', () => {
            registerRoute('/dashboard', {
                exact: true,
                meta: {
                    title: 'Dashboard',
                    requiresAuth: true,
                    breadcrumb: 'Home > Dashboard',
                },
            })
            
            const meta = getRouteMeta('/dashboard')
            expect(meta).toEqual({
                title: 'Dashboard',
                requiresAuth: true,
                breadcrumb: 'Home > Dashboard',
            })
        })
        
        it('should return undefined for routes without metadata', () => {
            const meta = getRouteMeta('/nonexistent')
            expect(meta).toBeUndefined()
        })
        
        it('should support custom metadata properties', () => {
            registerRoute('/admin', {
                meta: {
                    requiredRole: 'admin',
                    permissions: ['read', 'write', 'delete'],
                    customField: { nested: 'value' },
                },
            })
            
            const meta = getRouteMeta('/admin')
            expect(meta?.requiredRole).toBe('admin')
            expect(meta?.permissions).toEqual(['read', 'write', 'delete'])
            expect(meta?.customField).toEqual({ nested: 'value' })
        })
    })
})

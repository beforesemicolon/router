import {
	goToPage,
	onPage,
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

const flushMicrotasks = () =>
	new Promise<void>((resolve) =>
		(typeof setImmediate === 'function' ? setImmediate : setTimeout)(resolve, 0)
	);

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
		
		await flushMicrotasks()
		await flushMicrotasks()
		
		expect(location.pathname).toBe('/')
		
		nextPage()
		
		await flushMicrotasks()
		await flushMicrotasks()
		
		expect(location.pathname).toBe('/sample')
	});
	
	it('should replace page', async () => {
		await replacePage('/new', {data: 3000}, 'new page')
		
		await flushMicrotasks()
		
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
            await flushMicrotasks()
            
            expect(guardCalled).toBe(true)
            expect(location.pathname).toBe('/protected')
        })
        
        it('should block navigation when guard returns false', async () => {
            registerRouteGuard('/blocked', () => {
                return false
            })
            
            await goToPage('/blocked')
            await flushMicrotasks()
            
            expect(location.pathname).toBe('/') // Should stay at original location
        })
        
        it('should redirect when guard returns string', async () => {
            registerRouteGuard('/admin', () => {
                return '/login' // Redirect to login
            })
            
            await goToPage('/admin')
            await flushMicrotasks()
            
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
            await flushMicrotasks()
            
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
            await flushMicrotasks()
            expect(globalGuardCalled).toBe(true)
            expect(location.pathname).toBe('/some-page')
            
            await goToPage('/forbidden')
            await flushMicrotasks()
            expect(location.pathname).toBe('/some-page') // Should stay at previous location
        })

        it('should apply global guards when subscribing on the current location', async () => {
            window.history.replaceState({}, document.title, '/guarded-login')

            registerGlobalGuard((pathname) => {
                if (pathname === '/guarded-login') {
                    return '/guarded-projects'
                }

                return true
            })

            const listener = jest.fn()
            const unsubscribe = onPageChange(listener)

            await flushMicrotasks()
            await flushMicrotasks()

            expect(location.pathname).toBe('/guarded-projects')
            expect(listener).toHaveBeenCalledWith('/guarded-projects', {}, {})

            unsubscribe()
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
            await flushMicrotasks()
            
            expect(receivedPathname).toBe('/test-guard')
            expect(receivedQuery).toBeDefined()
            expect(receivedData).toEqual({ user: 'test' })
        })

        it('should normalize null history state before guard redirects on current location', async () => {
            window.history.replaceState(null, document.title, '/guarded-login')

            registerGlobalGuard((pathname) => {
                if (pathname === '/guarded-login') {
                    return '/guarded-projects'
                }

                return true
            })

            const listener = jest.fn()
            const unsubscribe = onPageChange(listener)

            await flushMicrotasks()
            await flushMicrotasks()

            expect(location.pathname).toBe('/guarded-projects')
            expect(history.state).toEqual({})
            expect(listener).toHaveBeenCalledWith('/guarded-projects', {}, {})

            unsubscribe()
        })

        it('should only evaluate current-location guards once for concurrent subscribers', async () => {
            window.history.replaceState({}, document.title, '/guarded-projects')

            const guard = jest.fn(() => true)
            registerGlobalGuard(guard)

            const listenerA = jest.fn()
            const listenerB = jest.fn()
            const unsubscribeA = onPageChange(listenerA)
            const unsubscribeB = onPageChange(listenerB)

            await flushMicrotasks()
            await flushMicrotasks()

            expect(guard).toHaveBeenCalledTimes(1)
            expect(listenerA).toHaveBeenCalledWith('/guarded-projects', {}, {})
            expect(listenerB).toHaveBeenCalledWith('/guarded-projects', {}, {})

            unsubscribeA()
            unsubscribeB()
        })

        it('should notify only relevant onPage subscribers for a route change', async () => {
            const homeListener = jest.fn()
            const projectsListener = jest.fn()
            const unsubscribeHome = onPage('/', homeListener)
            const unsubscribeProjects = onPage('/projects', projectsListener)

            homeListener.mockClear()
            projectsListener.mockClear()

            await goToPage('/projects')
            await flushMicrotasks()

            expect(homeListener).toHaveBeenCalledTimes(1)
            expect(homeListener).toHaveBeenCalledWith(false, {
                pathname: '/projects',
                query: {},
                data: {},
                params: {},
            })
            expect(projectsListener).toHaveBeenCalledTimes(1)
            expect(projectsListener).toHaveBeenCalledWith(true, {
                pathname: '/projects',
                query: {},
                data: {},
                params: {},
            })

            homeListener.mockClear()
            projectsListener.mockClear()

            await goToPage('/about')
            await flushMicrotasks()

            expect(homeListener).toHaveBeenCalledTimes(0)
            expect(projectsListener).toHaveBeenCalledTimes(1)
            expect(projectsListener).toHaveBeenCalledWith(false, {
                pathname: '/about',
                query: {},
                data: {},
                params: {},
            })

            unsubscribeHome()
            unsubscribeProjects()
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
            await flushMicrotasks()
            
            expect(location.hash).toBe('#/test-hash')
            
            setRoutingMode('history')
        })
        
        it('should handle search params in hash mode', async () => {
            setRoutingMode('hash')
            
            await goToPage('/test?foo=bar')
            await flushMicrotasks()
            
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

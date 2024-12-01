// @ts-ignore
global.crypto.randomUUID = () => String(Math.floor(Math.random() * 1000))
document.documentElement.lang = 'en'

const ogFetch = window.fetch

beforeEach(() => {
    window.fetch = jest.fn()
    jest.spyOn(console, 'error')
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        const id = Math.random()
        cb(id)
        return id
    })
    document.body.innerHTML = ''
    jest.useFakeTimers()
})

afterEach(() => {
    window.requestAnimationFrame?.mockRestore?.()
    jest.clearAllMocks()
    window.fetch = ogFetch
    jest.useRealTimers()
})

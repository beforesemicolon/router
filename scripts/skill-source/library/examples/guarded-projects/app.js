import { routes } from './routes.js'

const { registerRouteGuard, registerRouteModules, replacePage } =
    window.BFS.ROUTER

const hasSession = () => sessionStorage.getItem('demo-session') === 'signed-in'

// Install policy and loaders before connecting the inert route markup.
registerRouteGuard(routes.project, () => hasSession() || routes.signIn)
registerRouteModules({
    '/project-page.js': () => import('./project-page.js'),
})
document
    .querySelector('#boot')
    .replaceWith(document.querySelector('#app').content.cloneNode(true))

const alphaLink = document.querySelector('#alpha')
alphaLink.payload = {
    projectId: 'alpha',
    notice: 'Opened from the project list.',
}

async function changeSession(signedIn) {
    const status = document.querySelector('#action-status')
    status.textContent = ''
    try {
        if (signedIn) sessionStorage.setItem('demo-session', 'signed-in')
        else sessionStorage.removeItem('demo-session')
        await replacePage(signedIn ? routes.home : routes.signIn)
    } catch {
        status.textContent = 'Could not change the demo session.'
    }
}

document.querySelector('main').addEventListener('click', (event) => {
    if (event.target.id === 'sign-in') void changeSession(true)
})
document.querySelector('#sign-out').addEventListener('click', () => {
    void changeSession(false)
})

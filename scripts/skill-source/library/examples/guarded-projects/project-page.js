import { routes } from './routes.js'

const { onPage } = window.BFS.ROUTER

class ProjectDetails extends HTMLElement {
    #stop
    #request = new AbortController()

    connectedCallback() {
        this.#stop = onPage(routes.project, (active, { data, params }) => {
            this.#request.abort()
            if (!active) return
            const request = new AbortController()
            this.#request = request
            void this.#load(params.id, data, request.signal)
        })
    }

    disconnectedCallback() {
        this.#stop?.()
        this.#request.abort()
    }

    async #load(projectId, data, signal) {
        const title = this.querySelector('h1')
        const status = this.querySelector('[role="status"]')
        title.textContent = 'Project'
        status.textContent = 'Loading project…'
        try {
            const response = await fetch(
                '/data/' + encodeURIComponent(projectId) + '.json',
                { signal }
            )
            if (!response.ok) throw new Error('Project not available')
            const project = await response.json()
            if (signal.aborted) return
            title.textContent = project.name
            // History payload is optional, scope it to this route's ID. Never use it for access.
            status.textContent =
                data.projectId === projectId && typeof data.notice === 'string'
                    ? data.notice
                    : ''
        } catch {
            if (!signal.aborted)
                status.textContent = 'Could not load this project.'
        }
    }
}
customElements.define('demo-project-details', ProjectDetails)

export default () => `
  <demo-project-details>
    <h1>Project</h1>
    <p role="status">Loading project…</p>
  </demo-project-details>
`

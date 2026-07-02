export default (props = {}) => {
    const isDocs = props.path?.startsWith('/documentation')
    const siteName =
        props.projectMeta?.name || props.name || props.title || 'Documentation'
    const logo = `
                <span class="site-logo-pair">
                    <img class="site-logo site-logo-dark" src="/assets/logo.dark.svg" alt="${siteName} logo" width="90" height="27" />
                    <img class="site-logo site-logo-light" src="/assets/logo.light.svg" alt="" width="90" height="27" aria-hidden="true" />
                </span>`

    return `
<header class="site-header">
    <div class="header-inner wrapper">
        <h1>
            <a href="/" aria-label="${siteName} home">
                ${logo}
            </a>
        </h1>
        ${
            isDocs
                ? `
        <nav class="nav-actions docs-actions">
            <a href="https://github.com/beforesemicolon/router" target="_blank" rel="noopener" aria-label="Router GitHub repository" class="github-link docs-github-link">
                <span>v${props.projectMeta?.version || ''}</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
        </nav>
        `
                : `
        <nav class="nav-links">
            <a href="/#features">Features</a>
            <a href="/#code">Code</a>
            <a href="/#install">Install</a>
        </nav>
        <nav class="nav-actions">
            <a href="https://github.com/beforesemicolon/router" target="_blank" rel="noopener" aria-label="GitHub" class="github-link">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="/documentation" class="btn-primary">Documentation</a>
        </nav>
        `
        }
    </div>
</header>
`
}

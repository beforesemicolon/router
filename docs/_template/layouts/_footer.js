const social = [
    {
        link: 'https://medium.com/before-semicolon',
        icon: 'assets/medium2.svg',
        name: 'Medium blog',
    },
    {
        link: 'https://www.facebook.com/beforesemicolon/',
        icon: 'assets/facebook.svg',
        name: 'Facebook',
    },
    {
        link: 'https://www.instagram.com/before_semicolon_/',
        icon: 'assets/instagram.svg',
        name: 'Instagram',
    },
    {
        link: 'https://www.reddit.com/r/beforesemicolon/',
        icon: 'assets/reddit.svg',
        name: 'Reddit',
    },
    {
        link: 'https://twitter.com/BeforeSemicolon',
        icon: 'assets/twitter.svg',
        name: 'Twitter',
    },
    {
        link: 'https://www.youtube.com/channel/UCrU33aw1k9BqTIq2yKXrmBw',
        icon: 'assets/youtube.svg',
        name: 'YouTube',
    },
]

export default (props = {}) => {
    const siteName =
        props.projectMeta?.name || props.name || props.title || 'Documentation'
    const logo = `
            <span class="site-logo-pair">
                <img class="site-logo site-logo-dark" src="/assets/logo.dark.svg" alt="${siteName} logo" width="100" height="30" />
                <img class="site-logo site-logo-light" src="/assets/logo.light.svg" alt="" width="100" height="30" aria-hidden="true" />
            </span>`

    return `
<footer class="site-footer">
    <div class="footer-inner wrapper">
        <div class="footer-brand">
            ${logo}
            <p>A tiny, plug-and-play router built on Web Component. Route by pathname or search query, load HTML/JS pages, and nest routes.</p>
        </div>
        <ul class="footer-links">
            <li><h4>Learning Resources</h4></li>
            <li><a href="/documentation">Documentation</a></li>
        </ul>
        <ul class="footer-links">
            <li><h4>About <em>Before Semicolon</em></h4></li>
            <li><a href="https://github.com/beforesemicolon" rel="noopener" target="_blank">Open Source</a></li>
            <li><a href="https://beforesemicolon.com/" rel="noopener" target="_blank">Website</a></li>
            <li><a href="https://medium.com/before-semicolon" rel="noopener" target="_blank">Blog</a></li>
            <li><a href="https://www.youtube.com/channel/UCrU33aw1k9BqTIq2yKXrmBw" rel="noopener" target="_blank">YouTube Channel</a></li>
        </ul>
        <div class="footer-social" aria-label="social-media">
            ${social
                .map(
                    (s) => `
                    <a href="${s.link}" rel="noopener" target="_blank" aria-label="${s.name}">
                        <span class="footer-social-icon" style="--icon: url('/${s.icon}')" aria-hidden="true"></span>
                    </a>
                `
                )
                .join('')}
        </div>
        <div class="footer-credit">
            <span>Copyright &copy; ${new Date().getFullYear()} Before Semicolon. All rights reserved.</span>
        </div>
    </div>
</footer>
`
}

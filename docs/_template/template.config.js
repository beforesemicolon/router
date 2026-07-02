const renderGoogleAnalyticsScript = () => `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8GPFPFW87C"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-8GPFPFW87C');
</script>`

export default {
    meta: {
        siteName: 'Router',
        title: 'Router by Before Semicolon',
        description:
            'A tiny, plug-and-play router built on Web Component. Route by pathname or search query, load HTML/JS pages, and nest routes.',
        image: '/assets/router-banner.jpg',
    },
    site: {
        name: 'Router',
        packageName: '@beforesemicolon/router',
        repositoryUrl: 'https://github.com/beforesemicolon/router',
        repositoryLabel: 'Router GitHub repository',
        docsEditUrl: 'https://github.com/beforesemicolon/router/tree/main/docs',
        footerDescription:
            'A tiny, plug-and-play router for pathname, query, and hybrid navigation with Web Component support.',
        footerGroups: [
            {
                title: 'Learning Resources',
                links: [{ label: 'Documentation', href: '/documentation' }],
            },
            {
                title: 'About Before Semicolon',
                links: [
                    {
                        label: 'Open Source',
                        href: 'https://github.com/beforesemicolon',
                    },
                    {
                        label: 'Website',
                        href: 'https://beforesemicolon.com/',
                    },
                    {
                        label: 'Blog',
                        href: 'https://medium.com/before-semicolon',
                    },
                    {
                        label: 'YouTube Channel',
                        href: 'https://www.youtube.com/channel/UCrU33aw1k9BqTIq2yKXrmBw',
                    },
                ],
            },
        ],
        socialLinks: [
            {
                name: 'Medium blog',
                href: 'https://medium.com/before-semicolon',
                icon: '/assets/medium2.svg',
            },
            {
                name: 'Facebook',
                href: 'https://www.facebook.com/beforesemicolon/',
                icon: '/assets/facebook.svg',
            },
            {
                name: 'Instagram',
                href: 'https://www.instagram.com/before_semicolon_/',
                icon: '/assets/instagram.svg',
            },
            {
                name: 'Reddit',
                href: 'https://www.reddit.com/r/beforesemicolon/',
                icon: '/assets/reddit.svg',
            },
            {
                name: 'Twitter',
                href: 'https://twitter.com/BeforeSemicolon',
                icon: '/assets/twitter.svg',
            },
            {
                name: 'YouTube',
                href: 'https://www.youtube.com/channel/UCrU33aw1k9BqTIq2yKXrmBw',
                icon: '/assets/youtube.svg',
            },
        ],
        copyright: `Copyright &copy; ${new Date().getFullYear()} Before Semicolon. All rights reserved.`,
    },
    headScripts: {
        analytics: renderGoogleAnalyticsScript,
    },
    theme: {
        light: {
            '--background': 'oklch(0.98 0.012 160)',
            '--foreground': 'oklch(0.18 0.025 165)',
            '--heading': 'var(--foreground)',
            '--card': 'oklch(1 0 0)',
            '--primary': 'oklch(0.58 0.17 150)',
            '--primary-glow': 'oklch(0.64 0.18 145)',
            '--primary-foreground': 'oklch(0.98 0.012 160)',
            '--secondary': 'oklch(0.93 0.02 160)',
            '--muted': 'oklch(0.94 0.018 160)',
            '--muted-foreground': 'oklch(0.42 0.035 165)',
            '--accent': 'oklch(0.55 0.14 170)',
            '--border': 'oklch(0.86 0.028 160)',
            '--ring': 'oklch(0.58 0.17 150)',
            '--surface': 'color-mix(in oklch, var(--card) 86%, transparent)',
            '--surface-muted':
                'color-mix(in oklch, var(--muted) 78%, transparent)',
            '--surface-hover':
                'color-mix(in oklch, var(--primary) 8%, var(--card))',
            '--surface-border':
                'color-mix(in oklch, var(--border) 78%, transparent)',
            '--header-bg':
                'color-mix(in oklch, var(--background) 72%, transparent)',
            '--footer-bg':
                'color-mix(in oklch, var(--background) 96%, var(--foreground) 4%)',
            '--grid-line':
                'color-mix(in oklch, var(--foreground) 7%, transparent)',
            '--gradient-hero':
                'radial-gradient(ellipse at top, oklch(0.7 0.12 150 / 0.26), transparent 60%)',
            '--gradient-primary':
                'linear-gradient(135deg, var(--primary), var(--primary-glow))',
            '--gradient-text':
                'linear-gradient(135deg, oklch(0.18 0.025 165), oklch(0.36 0.08 150))',
            '--gradient-border':
                'linear-gradient(135deg, oklch(0.58 0.17 150 / 0.45), oklch(0.6 0.14 110 / 0.25))',
            '--shadow-glow': '0 0 60px -15px oklch(0.58 0.17 150 / 0.35)',
            '--shadow-card':
                '0 1px 0 0 oklch(1 0 0 / 0.75) inset, 0 20px 40px -20px oklch(0.18 0.025 165 / 0.16)',
        },
        dark: {
            '--background': 'oklch(0.12 0.015 160)',
            '--foreground': 'oklch(0.96 0.008 160)',
            '--heading': 'var(--foreground)',
            '--card': 'oklch(0.18 0.02 160)',
            '--primary': 'oklch(0.68 0.18 150)',
            '--primary-glow': 'oklch(0.74 0.19 145)',
            '--primary-foreground': 'oklch(0.12 0.02 160)',
            '--secondary': 'oklch(0.22 0.025 160)',
            '--muted': 'oklch(0.2 0.02 160)',
            '--muted-foreground': 'oklch(0.7 0.035 160)',
            '--accent': 'oklch(0.68 0.18 150)',
            '--border': 'oklch(0.28 0.035 160)',
            '--ring': 'oklch(0.68 0.18 150)',
            '--surface': 'color-mix(in oklch, var(--card) 46%, transparent)',
            '--surface-muted':
                'color-mix(in oklch, var(--card) 62%, transparent)',
            '--surface-hover':
                'color-mix(in oklch, var(--primary) 9%, var(--card))',
            '--surface-border':
                'color-mix(in oklch, var(--border) 70%, transparent)',
            '--header-bg':
                'color-mix(in oklch, var(--background) 60%, transparent)',
            '--footer-bg':
                'color-mix(in oklch, var(--background) 88%, black 12%)',
            '--grid-line':
                'color-mix(in oklch, var(--foreground) 5%, transparent)',
            '--gradient-hero':
                'radial-gradient(ellipse at top, oklch(0.28 0.08 150 / 0.35), transparent 60%)',
            '--gradient-primary':
                'linear-gradient(135deg, var(--primary), var(--primary-glow))',
            '--gradient-text':
                'linear-gradient(135deg, oklch(0.98 0.005 160), oklch(0.78 0.08 150))',
            '--gradient-border':
                'linear-gradient(135deg, oklch(0.68 0.18 150 / 0.5), oklch(0.7 0.16 110 / 0.3))',
            '--shadow-glow': '0 0 60px -15px oklch(0.68 0.18 150 / 0.5)',
        },
    },
}

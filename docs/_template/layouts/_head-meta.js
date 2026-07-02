/* global process */
const isDev = process.env.NODE_ENV === 'development'

const siteUrl = 'https://router.beforesemicolon.com'
const siteName = 'Router'
const defaultTitle = 'Router by Before Semicolon'
const defaultDescription =
    'A tiny, plug-and-play router built on Web Component. Route by pathname or search query, load HTML/JS pages, and nest routes.'
const defaultImage = `${siteUrl}/assets/router-banner.jpg`
const baseKeywords = [
    'Router',
    '@beforesemicolon/router',
    'web component routing',
    'single page application routing',
    'multi page application routing',
    'hash routing',
    'route guards',
    'nested routing',
    'lazy loading pages',
    'vanilla JavaScript',
]

const escapeHTML = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

const canonicalPath = (path = '/') => {
    const cleanPath = path.split('?')[0].split('#')[0] || '/'

    if (cleanPath === '/index.html') return '/'
    if (cleanPath.endsWith('/index.html')) {
        return cleanPath.replace(/index\.html$/, '')
    }

    return cleanPath.replace(/\.html$/, '')
}

const absoluteUrl = (path = '/') => `${siteUrl}${canonicalPath(path)}`

const compactDescription = (description) =>
    (description || defaultDescription).replace(/\s+/g, ' ').trim()

const pageKeywords = ({ title, name, keywords } = {}) => {
    const values = [
        ...baseKeywords,
        title?.replace(/ - Router by Before Semicolon$/, ''),
        name,
        ...(Array.isArray(keywords)
            ? keywords
            : String(keywords || '').split(',')),
    ]

    return [...new Set(values.map((value) => value?.trim()).filter(Boolean))]
        .slice(0, 18)
        .join(', ')
}

const jsonScript = (data) =>
    `<script type="application/ld+json">${JSON.stringify(data)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026')}</script>`

const breadcrumbJson = ({ title, path }) => {
    const cleanPath = canonicalPath(path)
    const parts = cleanPath.split('/').filter(Boolean)
    const items = [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
        },
    ]

    let current = ''
    parts.forEach((part, index) => {
        current += `/${part}`
        items.push({
            '@type': 'ListItem',
            position: index + 2,
            name:
                index === parts.length - 1
                    ? title.replace(/ - Router by Before Semicolon$/, '')
                    : part
                          .split('-')
                          .map((word) => word[0]?.toUpperCase() + word.slice(1))
                          .join(' '),
            item: `${siteUrl}${current}`,
        })
    })

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items,
    }
}

const pageJson = ({ title, description, path, name }) => {
    const isDocsPage = canonicalPath(path).startsWith('/documentation')
    const url = absoluteUrl(path)

    if (isDocsPage) {
        return {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: title,
            name: name || title,
            description,
            url,
            image: defaultImage,
            inLanguage: 'en-US',
            isPartOf: {
                '@type': 'TechArticle',
                name: 'Router Documentation',
                url: `${siteUrl}/documentation`,
            },
            about: [
                'Web Component Routing',
                'Single Page Application (SPA)',
                'Multi Page Application (MPA)',
                'Route Guards',
                'Hash Routing',
            ],
            publisher: {
                '@type': 'Organization',
                name: 'Before Semicolon',
                url: 'https://beforesemicolon.com',
                logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/assets/logo.svg`,
                },
            },
            mainEntityOfPage: url,
        }
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'Router',
        alternateName: '@beforesemicolon/router',
        description,
        url,
        image: defaultImage,
        codeRepository: 'https://github.com/beforesemicolon/router',
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Browser',
        license: 'https://github.com/beforesemicolon/router/blob/main/LICENSE',
        publisher: {
            '@type': 'Organization',
            name: 'Before Semicolon',
            url: 'https://beforesemicolon.com',
        },
    }
}

export default (props = {}) => {
    const title = props.title || defaultTitle
    const description = compactDescription(props.description)
    const url = absoluteUrl(props.path)
    const canonical = escapeHTML(url)
    const image = props.image || defaultImage
    const cacheKey = props.cacheKey ? `?v=${escapeHTML(props.cacheKey)}` : ''
    const type = canonicalPath(props.path).startsWith('/documentation')
        ? 'article'
        : 'website'

    return `
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
<title>${escapeHTML(title)}</title>
<meta name="description" content="${escapeHTML(description)}" />
<meta name="keywords" content="${escapeHTML(pageKeywords(props))}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<meta name="googlebot" content="index, follow" />
<meta name="author" content="Before Semicolon" />
<meta name="publisher" content="Before Semicolon" />
<meta name="application-name" content="${siteName}" />
<meta name="generator" content="@beforesemicolon/builder" />
<meta name="theme-color" content="#080d12" />
<meta name="color-scheme" content="dark light" />
<link rel="canonical" href="${canonical}" />
<link rel="home" href="${siteUrl}/" />
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
<link rel="alternate" type="text/plain" title="LLMs guide" href="/llms.txt" />
<link rel="alternate" type="text/plain" title="Full LLM documentation export" href="/llms-full.txt" />
<meta property="og:title" content="${escapeHTML(title)}" />
<meta property="og:type" content="${type}" />
<meta property="og:description" content="${escapeHTML(description)}" />
<meta property="og:image" content="${escapeHTML(image)}" />
<meta property="og:image:secure_url" content="${escapeHTML(image)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${escapeHTML(title)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:site_name" content="${siteName}" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@BeforeSemicolon" />
<meta name="twitter:creator" content="@BeforeSemicolon" />
<meta name="twitter:title" content="${escapeHTML(title)}" />
<meta name="twitter:image" content="${escapeHTML(image)}" />
<meta name="twitter:description" content="${escapeHTML(description)}" />
<meta name="twitter:image:alt" content="${escapeHTML(title)}" />
<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png" />
<link rel="manifest" href="/assets/favicon/site.webmanifest" />
<link rel="icon" type="image/x-icon" href="/assets/favicon/favicon.ico" />
<link rel="stylesheet" href="/stylesheets/github-dark.hightlighter.css${cacheKey}">
${jsonScript(pageJson({ ...props, title, description }))}
${jsonScript(breadcrumbJson({ title, path: props.path }))}
${
    isDev
        ? ''
        : `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-N3MXGDP5PS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-N3MXGDP5PS');
</script>`
}
`
}

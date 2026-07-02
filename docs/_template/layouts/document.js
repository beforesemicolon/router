import meta from './_head-meta.js'
import header from './_header.js'
import footer from './_footer.js'

const githubDocsPath =
    'https://github.com/beforesemicolon/router/tree/main/docs'

const navCategoryToHTML = (docs, currentPath) =>
    Array.from(docs.entries())
        .map(([k, v]) => {
            if (k.endsWith('.html')) {
                const href = v.path.replace(/(index)?\.html/, '')

                return `<li ${
                    currentPath === v.path ? 'class="active"' : ''
                }><a href="${href}">${v.name}</a></li>`
            }

            return `<ol><span>${k}</span>${navCategoryToHTML(
                v,
                currentPath
            )}</ol>`
        })
        .join('')

export default (props) => {
    const docs = props.siteMap.get('documentation')
    const isDocsIndex = props.path === '/documentation/index.html'
    const cacheKey = props.cacheKey ? `?v=${props.cacheKey}` : ''
    const docsMenu = `<ul>${navCategoryToHTML(docs, props.path)}</ul>`
    const pages = [...docs.values()].flatMap((page) =>
        page instanceof Map ? [...page.values()] : [page]
    )

    let nextPage, previousPage

    for (let i = 0; i < pages.length; i++) {
        if (pages[i].path === props.path) {
            nextPage = pages[i + 1]
            previousPage = pages[i - 1]
        }
    }

    return `
<!doctype html>
<html lang="en">
    <head>
        ${meta(props)}
        <link rel="stylesheet" href="/stylesheets/documentation.css${cacheKey}">
        ${
            props.themeStylesheet
                ? `<link rel="stylesheet" href="${props.themeStylesheet}">`
                : ''
        }
    </head>
    <body>
        ${header(props)}
        
        <div id="mobile-menu-toggle">
            <a href="#docs-nav" role="button" aria-label="toggle mobile menu open"></a>
        </div>
        
        <main id="documentation" class="wrapper${isDocsIndex ? ' docs-index' : ''}">
            <nav id="docs-nav">
                ${docsMenu}
                <a href="${props.path}" class="close-mobile-menu" role="button" aria-label="toggle mobile menu close"></a>
            </nav>
            <article>
                ${props.content}
                
                <div id="page-navigation">
                    ${previousPage ? `<a href="${previousPage.path.replace('.html', '')}" id="prev-doc"><span aria-hidden="true">&lt;&lt;</span> ${previousPage.name}</a>` : ''}
                    ${nextPage ? `<a href="${nextPage.path.replace('.html', '')}" id="next-doc">${nextPage.name} <span aria-hidden="true">&gt;&gt;</span></a>` : ''}
                </div>
                
                <a href="${`${githubDocsPath}${props.path.replace('.html', '')}.md`}" id="edit-doc">edit this doc</a>
            </article>
            <aside id="table-of-content">
                <h4>Content</h4>
                <ul>
                    ${props.tableOfContent
                        .map(
                            (c) => `<li><a href="${c.path}">${c.label}</a></li>`
                        )
                        .join('')}
                </ul>
            </aside>
        </main>
        
        ${footer(props)}
        ${props.scripts?.join('') || ''}
        
    </body>
</html>
`
}

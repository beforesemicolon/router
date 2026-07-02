import meta from './_head-meta.js'
import header from './_header.js'
import footer from './_footer.js'

export default (props) => {
    const cacheKey = props.cacheKey ? `?v=${props.cacheKey}` : ''

    return `
<!doctype html>
<html lang="en">
    <head>
        ${meta(props)}
        <link rel="stylesheet" href="/stylesheets/landing.css${cacheKey}">
        ${
            props.themeStylesheet
                ? `<link rel="stylesheet" href="${props.themeStylesheet}">`
                : ''
        }
    </head>
    <body>
        ${header(props)}
        ${props.content}
        ${footer(props)}
        ${props.scripts?.join('') || ''}
    </body>
</html>
`
}

import { buildBrowser, buildModules } from '@beforesemicolon/builder'

Promise.all([buildBrowser(), buildModules()]).catch((error) => {
    console.error(error)
    process.exit(1)
})

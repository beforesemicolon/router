import { buildModules, buildBrowser } from '@beforesemicolon/builder'

Promise.all([buildBrowser(), buildModules()]).catch(console.error)

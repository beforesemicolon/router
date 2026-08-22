import { buildBrowser, buildModules } from '@beforesemicolon/builder'

await Promise.all([
    buildBrowser({
        esbuildOptions: {
            keepNames: false,
            sourcemap: false,
        },
    }),
    buildModules({
        esbuildOptions: {
            keepNames: false,
        },
    }),
])

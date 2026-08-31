import { buildBrowser, buildModules } from '@beforesemicolon/builder'
import { writeFile } from 'node:fs/promises'

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
            tsconfig: 'tsconfig.json',
            plugins: [
                {
                    name: 'commonjs-module-interop',
                    setup(build) {
                        if (build.initialOptions.format !== 'cjs') return
                        // Compile sibling modules together as CommonJS, not
                        // Node ESM imports of already-transpiled CommonJS.
                        build.onResolve({ filter: /.*/ }, (args) =>
                            args.kind === 'entry-point'
                                ? { path: args.path, namespace: 'cjs-source' }
                                : undefined
                        )
                    },
                },
            ],
        },
    }),
])

await writeFile(
    new URL('./dist/cjs/package.json', import.meta.url),
    `${JSON.stringify({ type: 'commonjs' }, null, 4)}\n`
)

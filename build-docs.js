import { buildDocs } from '@beforesemicolon/site-builder'

const run = async () => {
    try {
        await buildDocs()

        console.log('Documentation built successfully.')
    } catch (error) {
        console.error('Failed to build documentation:', error)
        process.exit(1)
    }
}

run()

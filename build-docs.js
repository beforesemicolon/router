import { buildDocs } from '@beforesemicolon/builder'
import fs from 'fs'
import path from 'path'

const docsOptions = {
    template: 'fading-citrus',
    siteUrl: 'https://router.beforesemicolon.com',
    generatedFiles: {
        netlify: true,
    },
}

const cleanAssets = () => {
    const assetsDir = path.join(process.cwd(), 'website/assets')
    const filesToDelete = [
        'markup-banner.jpg',
        'markup-essentials-training.jpg',
        'markup-favicon.jpg',
        'markup-favicon.png',
        'markup-logo-name.svg',
        'markup-logo-name@2x.png',
        'markup-logo.svg',
        'markup-logo@2x.png',
        'client-server.svg',
        'fast.svg',
        'independent.svg',
        'reactive.svg',
        'simple.svg',
        'small.svg',
    ]

    filesToDelete.forEach((file) => {
        const filePath = path.join(assetsDir, file)
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath)
                console.log(`Cleared default asset: ${file}`)
            } catch (err) {
                console.error(`Failed to delete default asset ${file}:`, err)
            }
        }
    })
}

const run = async () => {
    try {
        fs.rmSync(path.join(process.cwd(), 'website'), {
            recursive: true,
            force: true,
        })
        await buildDocs(docsOptions)
        // Wait for the unawaited async writeFile calls in builder's forEach to finish
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Clear out builder default assets that are Markup-specific
        cleanAssets()

        console.log('Documentation built successfully.')
    } catch (error) {
        console.error('Failed to build documentation:', error)
        process.exit(1)
    }
}

run()

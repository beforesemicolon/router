// This script turns verified release records and reviewed local guides into an offline skill.
import assert from 'node:assert/strict'
import {
    readFileSync,
    readdirSync,
    mkdirSync,
    rmSync,
    writeFileSync,
    existsSync,
} from 'node:fs'
import path from 'node:path'
import { descriptions } from './skill-source/notes.mjs'

const text = (file) => readFileSync(file, 'utf8')
const write = (directory, file, value) => {
    const destination = path.join(directory, file)
    mkdirSync(path.dirname(destination), { recursive: true })
    writeFileSync(destination, value)
}
const readFiles = (directory) =>
    readdirSync(directory, { withFileTypes: true, recursive: true })
        .filter((entry) => entry.isFile())
        .map((entry) =>
            path
                .relative(directory, path.join(entry.parentPath, entry.name))
                .split(path.sep)
                .join('/')
        )
        .sort()
const tick = String.fromCharCode(96)
const code = (item) => tick + item + tick
const block = (lang, source) =>
    tick.repeat(4) + lang + '\n' + source.trim() + '\n' + tick.repeat(4)
const list = (values, toLine) =>
    values.map((item) => '- ' + toLine(item)).join('\n')
const panels = (...lines) => lines.filter(Boolean).join('\n\n') + '\n'
const packageURL = ({ package: name, version, path: file }) =>
    `https://cdn.jsdelivr.net/npm/${name}@${version}/${file}`
const safePath = (file) =>
    /^[a-z0-9_.\-/]+$/iu.test(file) &&
    !file.startsWith('/') &&
    file.split('/').every((p) => !['', '.', '..'].includes(p))
const language = (source) => (source.trim().startsWith('<') ? 'html' : 'js')

export function buildSkillLibrary(
    index,
    recordEntries,
    releaseFiles,
    validateSnippet,
    check
) {
    const short = index.package.split('/').at(-1)
    const folder = `skills/${index.skill.name}`
    const sourceDir = 'scripts/skill-source/library'
    const files = new Map(
        readFiles(sourceDir).map((file) => [
            file,
            text(path.join(sourceDir, file)),
        ])
    )
    assert.ok(files.size, 'No offline guides or examples')
    assert.ok(files.has('references/workflows.md'), 'Missing workflow guide')
    assert.ok(files.has('examples/README.md'), 'Missing example guide')

    // Copy the actual release examples and their dependent fixtures into the skill.
    for (const [file, value] of releaseFiles)
        if (file.startsWith('examples/')) {
            const skillExample = file.replace(
                /^examples\//,
                'examples/classic/'
            )
            assert.ok(
                !files.has(skillExample),
                `Duplicate example ${skillExample}`
            )
            files.set(skillExample, value)
        }

    for (const [file, value] of files) {
        if (file.endsWith('.js')) validateSnippet(file, 'example script', value)
        if (!file.endsWith('.html')) continue
        validateSnippet(file, 'example page', value)
        const directory = path.posix.dirname(file)
        const local = (relativeFile) => path.posix.join(directory, relativeFile)
        for (const [, src] of value.matchAll(
            /<script\b[^>]*\bsrc=["']([^"']+)["']/giu
        )) {
            if (src.startsWith('https://')) continue
            const bundle = src.replace(/^\//u, '')
            const packagePath = local('package.json')
            if (files.has(packagePath)) {
                const entry =
                    JSON.parse(files.get(packagePath)).scripts?.start ?? ''
                if (entry.includes('--outfile=' + bundle)) {
                    assert.ok(
                        files.has(local('app.js')),
                        `Missing bundler source for ${file}`
                    )
                    continue
                }
            }
            assert.ok(
                files.has(local(bundle)),
                `Missing local script for ${file}: ${src}`
            )
        }
        for (const [, directoryPath] of value.matchAll(
            /\bsrc-dir=["']([^"']+)["']/giu
        )) {
            const directoryName = directoryPath.replace(/^\//u, '')
            const localeIds = new Set(
                [
                    ...value.matchAll(
                        /(?:\blocale=|<option\s+value=)["']([a-z-]+)["']/giu
                    ),
                ].map((match) => match[1])
            )
            for (const locale of localeIds) {
                const resource = local(`${directoryName}/${locale}.json`)
                assert.ok(
                    files.has(resource),
                    `Missing locale data for ${file}: ${resource}`
                )
                JSON.parse(files.get(resource))
            }
        }
    }

    const members = new Map()
    const tags = new Map()
    const symbolNotes = descriptions.symbols
    const componentNotes = descriptions.components
    const inlineExample = (kind, value, record) => {
        if (!value) return null
        if (typeof value === 'object') {
            const file = value.path.replace(/^examples\//, 'examples/classic/')
            assert.ok(
                files.has(file),
                `Missing offline ${kind} example for ${record.id}`
            )
            return `[Open the complete local example](../../${file}).`
        }
        if (value.startsWith('// Register in the app entry:')) {
            const tag = value.split('\n').slice(2).join('\n')
            return panels(
                block('js', record.setup.npm.import),
                block('html', tag)
            ).trim()
        }
        if (
            kind === 'Classic' &&
            !value.trim().startsWith('<') &&
            /\bawait\b/u.test(value)
        ) {
            return block(
                'html',
                '<script type="module">\n' + value + '\n</script>'
            )
        }
        return block(language(value), value)
    }

    for (const { record } of recordEntries) {
        const slug = record.id.split('/').at(-1)
        const dest = `references/apis/${slug}.md`
        const { signatures = {}, types = {}, tag } = record.api
        const fnNames = Object.keys(signatures)
        const typeNames = Object.keys(types)
        const extras = descriptions.records[slug] || {}
        for (const name of [...fnNames, ...typeNames]) {
            assert.ok(!members.has(name), `Duplicate symbol entry: ${name}`)
            members.set(name, dest)
        }

        let tagSection = null
        if (tag) {
            tags.set(tag, dest)
            const metadata = componentNotes[tag]
            assert.ok(metadata, `No component semantics for ${tag}`)
            const attrs = metadata.attributes
            assert.deepEqual(
                Object.keys(attrs).sort(),
                [...record.api.attributes].sort(),
                `Attribute docs do not match shipped ${tag}`
            )
            tagSection = panels(
                `## Element ${code('<' + tag + '>')}`,
                metadata.behavior,
                list(
                    record.api.attributes,
                    (key) => `${code(key)}: ${attrs[key]}`
                ),
                record.api.slots
                    ? '**Slots:** ' +
                          record.api.slots.map(code).join(', ') +
                          '.'
                    : null,
                record.api.events
                    ? '### Events\n\n' +
                          list(
                              Object.entries(record.api.events),
                              ([event, info]) =>
                                  `${code(event)}: detail type ${code(info.detail)}.${info.description ? ' ' + info.description : ''}`
                          )
                    : null,
                record.api.properties
                    ? '### Properties\n\n' +
                          list(
                              Object.entries(record.api.properties),
                              ([prop, signature]) =>
                                  `${code(prop)}: ${code(signature)}.`
                          )
                    : null,
                metadata.recipe ? block('html', metadata.recipe) : null
            )
            if (metadata.recipe)
                validateSnippet(record.id, 'component recipe', metadata.recipe)
        }
        const values = fnNames.length
            ? panels(
                  '## Public values',
                  ...fnNames.map((name) => {
                      const info = symbolNotes[name]
                      assert.ok(
                          info?.description && info?.example,
                          `Missing API description or example: ${name}`
                      )
                      validateSnippet(record.id, name, info.example)
                      return panels(
                          `### ${code(name)}`,
                          block('typescript', name + ': ' + signatures[name]),
                          info.description,
                          block('js', info.example)
                      ).trim()
                  })
              ).trim()
            : null
        const typeDocs = typeNames.length
            ? panels(
                  '## Type-only exports',
                  'Import these with `import type` in TypeScript. They are not runtime values.',
                  ...typeNames.map((name) =>
                      panels(
                          `### ${code(name)}`,
                          block('typescript', types[name]),
                          descriptions.types[name] || null
                      ).trim()
                  )
              ).trim()
            : null

        const npm = record.setup.npm
        const classic = record.setup.classic
        const classicSetup = classic
            ? panels(
                  '### Classic scripts',
                  list(classic.scripts, (s) => code(packageURL(s))),
                  classic.globals.length
                      ? '**Available globals for this record:** ' +
                            classic.globals.map(code).join(', ') +
                            '.'
                      : null,
                  'Load scripts in the listed order. No bundler is needed.'
              ).trim()
            : '### Classic scripts\n\nThis record does not expose a classic-script API.'
        const selectedComponent =
            index.package === '@beforesemicolon/intl' && tag
                ? tag === 'intl-relative-time'
                    ? 'intl-rel-time'
                    : tag
                : null
        const subpath = selectedComponent
            ? `${index.package}/components/${selectedComponent}`
            : null
        if (subpath) assert.ok(index.exports[subpath].names.includes('default'))
        const selective = subpath
            ? panels(
                  '### Selective npm registration',
                  'The default export of the component subpath is an initializer, not a custom element class. Call it with the public Web Component module. Import the full root instead if the app needs every Intl element.',
                  block(
                      'js',
                      `import * as webComponent from '@beforesemicolon/web-component'\nimport register from '${subpath}'\n\nregister(webComponent)`
                  )
              ).trim()
            : null

        const documents = (record.links || [])
            .filter((link) => !link.url.startsWith('https:'))
            .map(
                ({ label, url }) =>
                    `[${label}](${url.replace(/\.json$/u, '.md')})`
            )
        files.set(
            dest,
            panels(
                `# ${record.name}`,
                `${code(index.package + '@' + index.version)} · ${code(record.id)}`,
                record.summary,
                record.guidance?.length
                    ? list(record.guidance, (value) => value)
                    : null,
                extras.context || null,
                '## Setup',
                '### npm',
                npm.registration,
                block('js', npm.import),
                selective,
                classicSetup,
                tagSection?.trim(),
                values,
                typeDocs,
                '## Examples',
                inlineExample('Npm', record.example.npm, record),
                record.example.classic ? '### Classic' : null,
                inlineExample('Classic', record.example.classic, record),
                extras.usage || null,
                documents.length
                    ? '## Related local reference\n\n' + documents.join(' · ')
                    : null,
                '[Back to the offline reference index](../index.md)'
            )
        )
    }

    // Prop subpaths may re-export types and intentionally expose a default initializer.
    // Prove every public export is represented without assuming all paths are equivalent.
    for (const [specifier, surface] of Object.entries(index.exports)) {
        for (const name of [...surface.names, ...surface.types]) {
            if (name === 'default') {
                const tag = specifier.split('/').at(-1)
                assert.ok(
                    tags.has(tag),
                    `Missing offline default initializer: ${specifier}`
                )
            } else {
                assert.ok(
                    members.has(name),
                    `Missing offline docs: ${specifier} : ${name}`
                )
            }
        }
    }
    assert.deepEqual(
        [...Object.keys(symbolNotes)].sort(),
        [
            ...recordEntries.flatMap((r) =>
                Object.keys(r.record.api.signatures || {})
            ),
        ].sort(),
        'Stale or incomplete symbol example inventory'
    )

    files.set(
        'references/index.md',
        panels(
            `# ${short[0].toUpperCase() + short.slice(1)} offline reference`,
            `Complete public surface for ${code(index.package + '@' + index.version)}. No web access required. These pages are generated from the same verified release records as the package index. Browse a section or search the symbol list.`,
            '[Practical workflows](workflows.md) · [Runnable offline examples](../examples/README.md) · [Skill entry](../SKILL.md)',
            '## Record pages',
            list(
                recordEntries,
                ({ record }) =>
                    `[${record.name}](apis/${record.id.split('/').at(-1)}.md): ${record.summary}`
            ),
            '## Symbol locator',
            list(
                [...members].sort(([a], [b]) => a.localeCompare(b)),
                ([name, path]) =>
                    `[${code(name)}](${path.replace(/^references\//u, '')})`
            ),
            '## Public npm entry points',
            ...Object.entries(index.exports).map(([specifier, surface]) => {
                const defaultTag = specifier.split('/').at(-1)
                const toLink = (name) =>
                    `[${code(name)}](${(name === 'default' ? tags.get(defaultTag) : members.get(name)).replace(/^references\//u, '')})`
                return panels(
                    `### ${code(specifier)}`,
                    '**Values:** ' + surface.names.map(toLink).join(', '),
                    surface.types.length
                        ? '**Types:** ' + surface.types.map(toLink).join(', ')
                        : null
                ).trim()
            }),
            '## Classic browser script order',
            list(index.classic.scripts, (script) => code(packageURL(script))),
            '## Classic browser global members',
            list(index.classic.globals, (global) => {
                const name = global.split('.').at(-1)
                assert.ok(
                    members.has(name),
                    `Missing browser global documentation for ${global}`
                )
                return `[${code(global)}](${members.get(name).replace(/^references\//u, '')})`
            })
        )
    )

    const skillText = text(folder + '/SKILL.md')
    const inventory = ['SKILL.md', ...[...files.keys()].sort()]
    assert.ok(inventory.every(safePath), 'Unsafe offline package path')
    const available = new Set(inventory)
    for (const [file, value] of [...files, ['SKILL.md', skillText]]) {
        if (file.endsWith('.md'))
            for (const [, link] of value.matchAll(/\]\(([^\s)]+)\)/gu)) {
                if (/^(?:https?:|mailto:|#)/u.test(link)) continue
                const local = path.posix.normalize(
                    path.posix.join(
                        path.posix.dirname(file),
                        link.split('#')[0]
                    )
                )
                assert.ok(
                    available.has(local),
                    `Unresolved offline link ${file} -> ${link}`
                )
            }
    }
    const manifestFile = 'manifest.json'
    assert.equal(index.skill.manifest, `${folder}/${manifestFile}`)
    files.set(
        manifestFile,
        JSON.stringify(
            {
                schemaVersion: 1,
                name: index.skill.name,
                files: inventory,
                coverage: Object.fromEntries(
                    recordEntries.map(({ record }) => [
                        record.id,
                        `references/apis/${record.id.split('/').at(-1)}.md`,
                    ])
                ),
            },
            null,
            2
        ) + '\n'
    )

    if (check) {
        for (const [file, expected] of files)
            assert.equal(
                text(path.join(folder, file)),
                expected,
                `Stale offline docs: ${file}`
            )
        assert.deepEqual(
            readFiles(folder),
            [...available, manifestFile].sort(),
            'Unexpected files in the skill folder'
        )
    } else {
        for (const dir of ['references', 'examples'])
            rmSync(path.join(folder, dir), { recursive: true, force: true })
        for (const [file, body] of files) write(folder, file, body)
    }
    console.log(
        `${index.skill.name}: ${inventory.length} offline files, ${members.size} public symbols with reference pages, ${tags.size} documented browser elements`
    )
}

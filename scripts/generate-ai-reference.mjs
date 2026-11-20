/* Generate static references from published entry-point declarations and built code. */
import assert from 'node:assert/strict'
import {
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    rmSync,
    writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'
import { JSDOM } from 'jsdom'
import { records as guide } from './ai-guidance.mjs'
import { buildSkillLibrary } from './generate-skill-library.mjs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const short = pkg.name.split('/').at(-1)
const repository = pkg.repository.url
const version = pkg.version
const namespace = short.toUpperCase()
const tag = /^[a-z].+-[a-z]/u
const from = (file) => readFileSync(file, 'utf8')
const cdn = ({ package: name, version: pin, path: file }) =>
    `https://cdn.jsdelivr.net/npm/${name}@${pin}/${file}`
const dependency = {
    package: '@beforesemicolon/web-component',
    version: '1.22.0',
    path: 'dist/client.js',
    global: 'BFS.WebComponent',
}
const browser = {
    package: pkg.name,
    version,
    path: 'dist/client.js',
    global: `BFS.${namespace}`,
}
const classicScripts = [dependency, browser]
const dom = new JSDOM('', {
    url: 'https://example.test/',
    runScripts: 'outside-only',
})
const nodeGlobals = [
    'window',
    'document',
    'location',
    'history',
    'customElements',
    'HTMLElement',
    'HTMLTemplateElement',
    'CustomEvent',
    'DOMParser',
    'Node',
    'Element',
    'DocumentFragment',
    'MutationObserver',
    'Text',
    'Comment',
    'Event',
    'EventTarget',
]
try {
    dom.window.eval(
        from('node_modules/@beforesemicolon/web-component/dist/client.js')
    )
    assert.equal(typeof dom.window.BFS.MARKUP.html, 'function')
    assert.equal(typeof dom.window.BFS.WebComponent, 'function')
    dom.window.eval(from(browser.path))
} catch (error) {
    dom.window.close()
    throw error
}
const browserNames = Object.keys(dom.window.BFS[namespace]).sort()

const exportMap = pkg.exports['.'] ? pkg.exports : { '.': pkg.exports }
const definitions = Object.values(exportMap).map(({ types }) =>
    path.resolve(types)
)
const program = ts.createProgram(definitions, {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
})
const checker = program.getTypeChecker()
const surfaces = {}
const tsSignatures = {}
const runtimeDOM = new JSDOM('', { url: 'https://example.test/' })
const require = createRequire(import.meta.url)
{
    for (const key of nodeGlobals)
        Object.defineProperty(globalThis, key, {
            value:
                key === 'window' ? runtimeDOM.window : runtimeDOM.window[key],
            configurable: true,
        })
    for (const [suffix, entry] of Object.entries(exportMap)) {
        const specifier = suffix === '.' ? pkg.name : pkg.name + suffix.slice(1)
        const declaration = program.getSourceFile(path.resolve(entry.types))
        assert.ok(declaration, `No declaration for ${specifier}`)
        const exports = checker.getExportsOfModule(
            checker.getSymbolAtLocation(declaration)
        )
        assert.ok(
            existsSync(entry.import),
            `Missing ESM target for ${specifier}`
        )
        const active = require(path.resolve(entry.require))
        const functions = {}
        const types = {}
        for (const symbol of exports) {
            const resolved =
                symbol.flags & ts.SymbolFlags.Alias
                    ? checker.getAliasedSymbol(symbol)
                    : symbol
            const decl = resolved.valueDeclaration || resolved.declarations?.[0]
            assert.ok(decl, `No declaration for ${symbol.name}`)
            if (resolved.flags & ts.SymbolFlags.Value) {
                assert.ok(
                    Object.hasOwn(active, symbol.name),
                    `${specifier}: ${symbol.name} missing from package output`
                )
                functions[symbol.name] = checker.typeToString(
                    checker.getTypeOfSymbolAtLocation(resolved, decl),
                    decl,
                    ts.TypeFormatFlags.NoTruncation |
                        ts.TypeFormatFlags.UseStructuralFallback
                )
            } else if (resolved.flags & ts.SymbolFlags.Type) {
                types[symbol.name] = decl.getText()
            }
        }
        assert.deepEqual(
            Object.keys(active).sort(),
            Object.keys(functions).sort(),
            `Unexpected package exports for ${specifier}`
        )
        surfaces[specifier] = {
            names: Object.keys(functions).sort(),
            types: Object.keys(types).sort(),
        }
        tsSignatures[specifier] = { functions, types }
    }
}

const tags = new Map()
const visit = (node, test) => {
    test(node)
    ts.forEachChild(node, (child) => visit(child, test))
}
for (const file of readdirSync('src/components').filter(
    (name) => name.endsWith('.ts') && !name.endsWith('.spec.ts')
)) {
    const source = ts.createSourceFile(
        file,
        from(path.join('src/components', file)),
        ts.ScriptTarget.Latest,
        true
    )
    visit(source, (node) => {
        if (
            !ts.isCallExpression(node) ||
            !ts.isPropertyAccessExpression(node.expression) ||
            node.expression.expression.getText(source) !== 'customElements' ||
            node.expression.name.text !== 'define'
        )
            return
        const arg = node.arguments[0]
        assert.ok(
            ts.isStringLiteral(arg) && tag.test(arg.text),
            `Cannot extract registered tag from ${file}`
        )
        const name = arg.text
        assert.ok(
            dom.window.customElements.get(name),
            `${name} is missing from the classic artifact`
        )
        assert.ok(
            runtimeDOM.window.customElements.get(name),
            `${name} is missing from the npm artifact`
        )
        tags.set(name, { file })
    })
}

function validateSnippet(id, mode, snippet) {
    assert.equal(typeof snippet, 'string')
    for (const match of snippet.matchAll(
        /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g
    )) {
        const [, bindings, fromSpecifier] = match
        if (
            fromSpecifier !== pkg.name &&
            !fromSpecifier.startsWith(pkg.name + '/')
        )
            continue
        for (const binding of bindings
            .split(',')
            .filter((word) => word.trim())) {
            const key = binding.trim().split(/\s+/)[0]
            assert.ok(
                surfaces[fromSpecifier]?.names.includes(key),
                `${id}: ${mode} example imports absent name ${key}`
            )
        }
    }
    for (const [, globalName] of snippet.matchAll(
        new RegExp(`BFS\\.${namespace}\\.([a-zA-Z0-9]+)`, 'g')
    )) {
        assert.ok(
            browserNames.includes(globalName),
            `${id}: example uses absent classic global ${globalName}`
        )
    }
    for (const [, customTag] of snippet.matchAll(
        /<((?:page|intl)-[a-z-]+)[\s>]/g
    )) {
        assert.ok(
            tags.has(customTag),
            `${id}: ${mode} example uses absent tag ${customTag}`
        )
    }
}

const ids = new Set()
const seenTags = new Set()
const seenFunctions = new Set()
const seenTypes = new Set()
const seenGlobals = new Set()
const output = []
const exampleFiles = new Map()
for (const entry of guide) {
    const {
        name,
        summary,
        keywords,
        doc,
        typeNames = [],
        attributes,
        events,
        slots,
        notes,
        npm,
        classic,
        component,
        related,
        properties,
        examplePaths = {},
    } = entry
    const slug = entry.id
    assert.match(slug, /^[a-z0-9-]+$/)
    const id = `${short}/${slug}`
    assert.ok(!ids.has(id), `Duplicate record ${id}`)
    ids.add(id)
    assert.ok(
        existsSync(`docs/${doc}.md`),
        `Missing documentation file for ${id}: ${doc}`
    )
    const specifier = npm?.specifier ?? pkg.name
    assert.ok(surfaces[specifier], `Unknown npm public specifier ${specifier}`)
    const names = npm?.names ?? []
    for (const name of names) {
        assert.ok(
            surfaces[specifier].names.includes(name),
            `${id}: unknown value export ${name}`
        )
        seenFunctions.add(name)
    }
    for (const name of typeNames) {
        assert.ok(
            surfaces[specifier].types.includes(name),
            `${id}: unknown type ${name}`
        )
        seenTypes.add(name)
    }
    const globals = (
        classic?.names ?? names.filter((n) => browserNames.includes(n))
    ).map((value) => {
        assert.ok(
            browserNames.includes(value),
            `${id}: unknown classic export ${value}`
        )
        seenGlobals.add(value)
        return `BFS.${namespace}.${value}`
    })
    const componentDetails = {}
    if (component) {
        assert.ok(
            tags.has(component),
            `${id}: component is not publicly registered`
        )
        seenTags.add(component)
        const actual = [
            ...dom.window.customElements.get(component).observedAttributes,
        ]
        assert.deepEqual(
            actual,
            [
                ...runtimeDOM.window.customElements.get(component)
                    .observedAttributes,
            ],
            `${id}: npm and classic attributes differ`
        )
        if (attributes) {
            for (const key of attributes)
                assert.ok(
                    actual.includes(key),
                    `${id}: unknown attribute ${key}`
                )
        }
        componentDetails.tag = component
        componentDetails.attributes = actual
        if (properties) componentDetails.properties = properties
        if (slots) componentDetails.slots = slots
        if (events) componentDetails.events = events
    }

    const snippets = { ...examplePaths }
    if (npm?.example) snippets.npm = npm.example
    if (classic?.example) snippets.classic = classic.example
    if (entry.files) {
        for (const [file, value] of Object.entries(entry.files)) {
            assert.match(file, /^examples\/[a-z0-9/.\-]+$/u)
            assert.ok(
                !file.includes('..') && !exampleFiles.has(file),
                `Invalid repeated local file ${file}`
            )
            exampleFiles.set(file, value)
        }
    }
    for (const [mode, snippet] of Object.entries(snippets)) {
        const code =
            typeof snippet === 'string'
                ? snippet
                : exampleFiles.get(snippet.path)
        const compiled =
            typeof code === 'function'
                ? code({ scripts: classicScripts.map(cdn) })
                : code
        validateSnippet(id, mode, compiled)
    }

    const links = [
        {
            label: 'Documentation',
            url: `https://${short}.beforesemicolon.com/${doc}.html`,
        },
    ]
    if (related)
        links.push(
            ...related.map((r) => ({
                label: r,
                url: `${r.split('/').at(-1)}.json`,
            }))
        )
    const npmEntry = {
        specifier,
        names,
        import: names.length
            ? `import { ${names.join(', ')} } from '${specifier}'`
            : `import '${specifier}'`,
    }
    npmEntry.registration =
        specifier === pkg.name
            ? 'The npm root registers its custom elements automatically.'
            : 'No custom elements register when importing this subpath.'
    const record = {
        schemaVersion: 1,
        id,
        package: pkg.name,
        version,
        name,
        summary,
        setup: {
            npm: npmEntry,
            ...(component || globals.length
                ? {
                      classic: {
                          scripts: classicScripts,
                          globals,
                          requiredGlobals: ['BFS.WebComponent', 'BFS.MARKUP'],
                          registration:
                              'The script registers its custom elements automatically.',
                      },
                  }
                : {}),
        },
        api: {
            ...componentDetails,
            ...(names.length
                ? {
                      signatures: Object.fromEntries(
                          names.map((key) => [
                              key,
                              tsSignatures[specifier].functions[key],
                          ])
                      ),
                  }
                : {}),
            ...(typeNames.length
                ? {
                      types: Object.fromEntries(
                          typeNames.map((key) => [
                              key,
                              tsSignatures[specifier].types[key],
                          ])
                      ),
                  }
                : {}),
        },
        example: snippets,
        links,
        ...(notes ? { guidance: notes } : {}),
    }
    output.push({
        index: { id, name, summary, path: `records/${slug}.json`, keywords },
        record,
    })
}
const uncoveredTags = [...tags.keys()].filter((name) => !seenTags.has(name))
assert.deepEqual(uncoveredTags, [], 'Missing component records')
const uncovered = surfaces[pkg.name].names.filter(
    (name) => !seenFunctions.has(name)
)
assert.deepEqual(uncovered, [], 'Missing npm API records')
assert.deepEqual(
    surfaces[pkg.name].types.filter((name) => !seenTypes.has(name)),
    [],
    'Missing npm type records'
)
assert.deepEqual(
    browserNames.filter((name) => !seenGlobals.has(name)),
    [],
    'Missing browser API records'
)
for (const { record } of output)
    for (const link of record.links) {
        if (!link.url.startsWith('https:')) {
            assert.ok(
                output.some(
                    ({ index }) => index.path === `records/${link.url}`
                ),
                `Bad local reference ${record.id}: ${link.url}`
            )
        }
    }

function expectedFiles() {
    const skill = {
        name: 'beforesemicolon-router',
        path: 'skills/beforesemicolon-router/SKILL.md',
        manifest: 'skills/beforesemicolon-router/manifest.json',
    }
    const skillText = from(skill.path)
    assert.match(
        skillText,
        new RegExp(`^---\\nname: ${skill.name}\\ndescription: [^\\n]+\\n---\\n`)
    )
    for (const [, language, snippet] of skillText.matchAll(
        /```(html|js)\n([\s\S]*?)\n```/g
    )) {
        validateSnippet(skill.name, language, snippet)
    }
    const index = {
        schemaVersion: 1,
        package: pkg.name,
        version,
        repository,
        sourceRef: version,
        sourceRefStatus: 'expected-release-tag',
        skill,
        records: output.map((item) => item.index),
        exports: surfaces,
        classic: {
            scripts: classicScripts,
            globals: browserNames.map((name) => `BFS.${namespace}.${name}`),
        },
    }
    const files = new Map([
        ['index.json', `${JSON.stringify(index, null, 2)}\n`],
    ])
    for (const { index: item, record } of output) {
        files.set(item.path, `${JSON.stringify(record, null, 2)}\n`)
    }
    for (const [file, value] of exampleFiles) {
        files.set(
            file,
            typeof value === 'function'
                ? value({ scripts: classicScripts.map(cdn) })
                : value
        )
    }
    return files
}
for (const { record } of output)
    for (const value of Object.values(record.example)) {
        if (typeof value === 'object')
            assert.ok(
                exampleFiles.has(value.path),
                `Missing local example in ${record.id}: ${value.path}`
            )
    }
const files = expectedFiles()
buildSkillLibrary(
    JSON.parse(files.get('index.json')),
    output,
    files,
    validateSnippet,
    process.argv.includes('--check')
)
if (process.argv.includes('--check')) {
    for (const [file, value] of files)
        assert.equal(
            from(path.join('ai', file)),
            value,
            `Stale ai/${file}; npm run ai:generate`
        )
    const actual = readdirSync('ai', { recursive: true, withFileTypes: true })
        .filter((file) => file.isFile())
        .map((file) =>
            path.relative('ai', path.join(file.parentPath, file.name))
        )
        .sort()
    assert.deepEqual(actual, [...files.keys()].sort(), 'Stale files under ai/')
} else {
    rmSync('ai', { recursive: true, force: true })
    for (const [file, value] of files) {
        const destination = path.join('ai', file)
        mkdirSync(path.dirname(destination), { recursive: true })
        writeFileSync(destination, value)
    }
}
console.log(
    `${pkg.name}@${version}: ${output.length} records; ${tags.size} browser registrations; ${Object.keys(surfaces).length} npm entries`
)
dom.window.close()
runtimeDOM.window.close()

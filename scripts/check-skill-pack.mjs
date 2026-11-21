import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const read = (file) => JSON.parse(readFileSync(file, 'utf8'))
const index = read('ai/index.json')
const folder = path.posix.dirname(index.skill.path)
const manifest = read(index.skill.manifest)
const pack = JSON.parse(
    execFileSync('npm', ['pack', '--ignore-scripts', '--dry-run', '--json'], {
        encoding: 'utf8',
    })
)[0]
const packedFiles = new Set(pack.files.map(({ path }) => path))

assert.equal(pack.name, index.package)
assert.equal(pack.version, index.version)
assert.ok(
    packedFiles.has(index.skill.manifest),
    'No offline skill manifest in tarball'
)
for (const record of index.records)
    assert.ok(
        packedFiles.has('ai/' + record.path),
        'Missing packed API record ' + record.id
    )
assert.deepEqual(
    Object.keys(manifest.coverage).sort(),
    index.records.map((r) => r.id).sort(),
    'Missing offline reference coverage'
)
for (const file of Object.values(manifest.coverage))
    assert.ok(
        manifest.files.includes(file),
        'Undiscoverable offline API doc: ' + file
    )
for (const file of manifest.files)
    assert.ok(
        packedFiles.has(folder + '/' + file),
        'Missing packed offline skill file: ' + file
    )
console.log(
    `${index.skill.name}: verified all ${manifest.files.length} offline documentation and sample files in npm pack`
)

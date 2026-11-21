# Contributing

Thank you for helping improve Router. Bug reports, documentation fixes, tests,
and focused feature proposals are welcome.

## Before You Start

-   Search existing issues and pull requests before opening a duplicate.
-   Use the issue templates and include a minimal reproduction for bugs.
-   Discuss substantial API or behavior changes in an issue before implementation.
-   Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
-   Report vulnerabilities through the private process in [SECURITY.md](SECURITY.md).

## Development

Use a Node.js and npm version supported by `package.json` and CI.

```sh
npm ci
npm test
npm run lint
npm run build
```

Keep changes focused and add or update tests for behavior changes. Update the
documentation when public APIs or documented behavior change.

## Pull Requests

1. Create a branch from `main`.
2. Make a focused change with clear commit messages.
3. Run the test, lint, and build commands above.
4. Complete the pull request template and link any related issue.
5. Address review feedback and keep the branch current with `main`.

Pull requests require review before merge. By contributing, you agree that your
contribution is licensed under this project's [BSD 3-Clause License](LICENSE).

## Versioned AI references

Maintain version-specific judgments and compact examples in
`scripts/ai-guidance.mjs`, the skill entry in
`skills/beforesemicolon-router/SKILL.md`, and the rest of the hand-written
guides and example sources in `scripts/skill-source/`. Update the version-pinned
links in the README and AI docs when releasing a new version.

The artifact build generates `ai/` and the skill's offline reference pages,
examples, and manifest from those inputs plus the emitted declarations, npm
entry point, and browser bundle. Do not edit or commit those generated outputs.
Published npm tarballs contain their own version-specific output.

From a checkout with dependencies installed:

```sh
npm run build
npm pack
```

`npm run build:artifacts` builds only the distribution and generated AI
references. A normal `npm pack` runs that step automatically; the full build also
checks that npm packaging includes every generated reference and example.

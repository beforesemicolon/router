# Runnable Router examples

- [npm history navigation](npm-history/index.html): includes [browser entry](npm-history/app.js) and [package.json](npm-history/package.json).
- [No-build two-view routing](classic/two-views.html): native hash links and locally tested Back navigation.
- [Offline public reference](../references/index.md) and [workflows](../references/workflows.md).

## npm and browser history

Copy the `npm-history` directory to a writable location. After Router 1.5.0 has
been published, run:

```sh
npm install
npm start
```

Open the local esbuild URL root. Click **Project settings**, click **Members**,
then use Back. Expect `/projects/settings?tab=activity` and the Activity
heading. Reload that URL to test fallback. The development server is for local
testing only; add a deployment-specific history fallback in production.

Before npm publication, install the candidate tarballs for Router, Web
Component and Markup instead of requesting unpublished versions from the npm
registry. Keep the exact candidate dependency versions.

## Classic

Copy the `classic` directory to a writable place and serve it, for example with
`python3 -m http.server 8000`. Open `/two-views.html`. This HTML uses browser
files from the exact matching npm releases over CDN; it requires no npm install
or build. Offline, use the same browser files extracted from the package
tarballs and replace the two script URLs with local paths in the same order.

Click About and use Back. Expect `#/about` and then the original URL and Home
heading. If a request for `/about` leaves the shell, it is not running the
expected hash configuration.

## Guarded projects with lazy modules

Copy the [example directory](guarded-projects/index.html) with
[app.js](guarded-projects/app.js), [routes.js](guarded-projects/routes.js),
[project-page.js](guarded-projects/project-page.js), and both data fixtures
([Alpha](guarded-projects/data/alpha.json), [Beta](guarded-projects/data/beta.json)).
No build is needed. Use a history-fallback server; a plain Python static
server does not support direct reloads for this example. From the copied
directory, with Node/npm available:

```sh
npx --yes esbuild@0.28.2 --servedir=. --serve=127.0.0.1:8000 --serve-fallback=index.html
```

Open `/projects/alpha` in a new session. Expect Sign in and no request for
`/project-page.js` or a project record. Start the demo session, then click
Alpha and Beta. Expect a project heading for the active URL. The Alpha link
supplies an optional notice that Back can restore; a fresh tab does not need
the notice to show Alpha. Slow the network and click Beta while Alpha is
loading; the old Alpha response must not replace Beta. Sign out and navigate
Back to a protected URL; expect Sign in again.

The data files are public fixtures and the session flag is only for browser
behavior. In an application, replace both with the existing session store and
authorized API. For offline candidate testing, replace the two CDN scripts in
HTML with the extracted browser files from the exact package tarballs.

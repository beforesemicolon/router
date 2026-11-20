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

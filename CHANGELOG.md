# Changelog

## UNRELEASED / v0.9.0

- **[Deps]** Upgrading CodeMirror from v5.65.21 to v6.0.2
- **[Deps]** Packaging Highlight.js locally

## 2026.02.15 / v0.8.3

- **[Deps]** Upgrading jQuery from v3.7.1 to v4.0.0
- **[Deps]** Upgrading marked from v16.3.0 to v17.0.2
- **[Deps]** Upgrading other dependencies (except eslint and codemirror major)

## 2025.09.15 / v0.8.2

- **[Edit]** Better RTL support

## 2025.09.14 / v0.8.1

- **[Edit]** Correcting `sweetalert2` includes
- **[Deps]** Replace `ghostdown` with `marked` and `codemirror` v5.x
- **[Deps]** Remove `fitvids.js` replacing with CSS
- **[Deps]** Remove `masonry-layout` replacing with CSS
- **[Deps]** Remove `jquery.backstretch` as it is unused
- **[Deps]** Upgrade `highlight.js` from v11.9.0 to v11.11.1 (footer CDN link)

## 2025.09.13 / v0.8.0

- **[Edit]** Updated Design (for testing)

## 2025.09.13 / v0.7.0

- **[Edit]** Upgrade ESLint to v9.x
- **[Misc]** Upgrade packages

## 2025.01.02 / v0.6.0

- **[Misc]** Upgrade packages

## 2024.05.02 / v0.5.0

- **[Edit]** Updated Icons
- **[Perf]** Minify JS files
- **[Perf]** Remove unused packages lunr and lunr-languages
- **[Misc]** Add Prettier

## 2024.05.01 / v0.4.0

- **[Deps]** Swap SweetAlert2 `v11.4.8` to fork `@fixhq/sweetalert2@v11.10.8` without protestware
- **[Deps]** Upgrade `gulp` from `v4.0.2` to `v5.0.0`.
- **[Deps]** Remove `bootstrap-rtl` as `bootstrap@v5.x` has native support included.
- **[Deps]** Remove `markdown-toc` as it is unused.

## 2024.04.30 / v0.3.0

- **[Fix]** Word count restored in editor
- **[Fix]** Highlight.js code syntax highlighting restored
- **[Edit]** Highlight.js theme was removed, so moved to new accessibility-focused theme
- **[Deps]** Kept SweetAlert2 at `v11.4.8` due to protestware [CWE-912](https://github.com/advisories/GHSA-qq6h-5g6j-q3cm)
- **[Deps]** Kept `gulp` at `v4.x.x` due to image corruption. Needs further review.
- **[Deps]** Kept `eslint` at `v8.x.x` as plugins have not updated yet.
- **[Deps]** All other dependencies up-to-date

## 2023.08.02 / v0.1.0

- **[Deps]** Upgrade to latest `bootstrap`
- **[Deps]** Kept `marked` at `v5.x.x` due to `v6.x.x` being a major upgrade
- **[Deps]** Kept SweetAlert2 at `v11.4.8` due to protestware [CWE-912](https://github.com/advisories/GHSA-qq6h-5g6j-q3cm)
- **[Deps]** All other dependencies up-to-date

## 2023.06.20 / v0.0.2

All dependencies up-to-date except for `bootstrap` which needs to be a separate task.

- **[Deps]** Dependency upgrades
- **[Deps]** Downgrade SweetAlert2 to `v11.4.8` due to protestware [CWE-912](https://github.com/advisories/GHSA-qq6h-5g6j-q3cm)

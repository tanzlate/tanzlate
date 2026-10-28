---
'@tanzlate/core': patch
'@tanzlate/vanilla': patch
'@tanzlate/vue': patch
---

Give every package a real npm page.

`@tanzlate/core` and `@tanzlate/vanilla` had no README at all, so their npm pages were blank.
`@tanzlate/vue`'s README was still the original research notes under the old `i18next-compose-vue`
name, including links to a private repo and Notion.

All three now have a short README (what it is, install, a working example, links to the docs), plus
the `description`, `keywords`, `license`, `author`, `homepage` and `bugs` fields they were missing —
without which npm shows no summary, no license and nothing in search results.

Also corrects the `CHANGELOG.md` titles for `vanilla` (`# core`) and `vue` (`# i18next-compose-vue`).

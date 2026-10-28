---
outline: [2, 3]
order: 0
title: Best Practices
titleTemplate: tanzlate
description: Conventions for translation keys and component interpolation.
---

# Best Practices

Conventions that come out of running this pattern on a production codebase.

## Keys

- [Naming Conventions](/best-practices/naming-convention-for-the-keys) — snake_case, three levels
  (`{application_name}.{section_or_component}.{description_of_the_content}`), and why you should
  never concatenate translations.

## Component interpolation

- **Register a component once, not per call site.** `registerComponent` is app-wide; `:components`
  is for props that genuinely vary. If you find yourself passing the same props everywhere, they
  belong in the component's defaults instead.
- **Keep the whole sentence in one key.** The reason to interpolate components at all is so a
  translator reads a full sentence. Splitting a sentence across keys to avoid a tag defeats it.
- **Only tag what has to be a component.** A `<b>` or `<a>` needs no registration and no props —
  reach for a PascalCase component when there is real behavior behind it.
- **Don't put logic in the string.** Tag names and `{{ values }}` only. Conditionals and counts are
  i18next's job (plurals, context), not the parser's.

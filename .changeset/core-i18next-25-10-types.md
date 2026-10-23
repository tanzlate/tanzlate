---
'@tanzlate/core': patch
---

Fix the build break under i18next 25.10.x.

`i18nFormatterHelper` passed `TOptions | undefined` straight into `i18nextInstance.t`. i18next
25.10's `t` overloads infer the key against typed resources, so a generic wrapper with a runtime
key cannot satisfy the first overload and TypeScript falls through to
`t(key, defaultValue: string, options?)`, failing with `Type 'undefined' is not assignable to type
'string'`. `t` is now narrowed to the signature `TFunc` already exposes publicly.

No runtime change — types only.

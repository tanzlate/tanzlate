---
layout: home
title: tanzlate
titleTemplate: i18n for Vue 3 and Nuxt
description: i18n for Vue 3 and Nuxt, built on i18next — render real components inside your translation strings.
hero:
  name: tanzlate
  text: Component interpolation for Vue
  tagline: Keep the whole sentence in one translation key. Register components once, pass props per usage.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Component Interpolation
      link: /vue/components-interpolation
    - theme: alt
      text: Vanilla JS
      link: /vanilla/
features:
  - title: Components inside translation strings
    details: '"Your <UserBadge /> is ready. <AppButton>Start tour</AppButton>" renders as real Vue components — one key, no template slots.'
  - title: Register once, props per usage
    details: registerComponent resolves a tag app-wide. The :components prop supplies only props, so the same component can appear in hundreds of strings.
  - title: Namespace-scoped helpers
    details: useI18n('home') scopes keys to a context. No global $t, no guessing which component owns a key.
outline: [2, 3]
sidebar: false
---

```mermaid
flowchart LR
  subgraph T["Translation Sources"]
    F1["JSON / YAML / Remote <br />(i18next resources)"]
  end

  subgraph I18N["i18next Instance"]
    I["i18next.t(key, values)"]
  end

  F1 --> I

  C[["@tanzlate/vanilla<br/>i18next runtime<br/>namespace helpers"]]

  subgraph FW["Framework Renderers"]
    V["@tanzlate/vue<br />parse → &lt;Tanzlate&gt;"]
    R["@tanzlate/react<br />(planned)"]
  end

  I -->|string| C
  C --> V
  C --> R

  subgraph Inputs["Per-Framework Inputs"]
    VC["registerComponent('NuxtLink', NuxtLink) <br />once per app<br /><br />:components = <br />{ NuxtLink: { to:'/courses' } }<br />props, per usage"]
    RC["(planned)"]
  end

  VC --> V
  RC --> R

  V -->|VNode tree| OUTV["Rendered UI (Vue)"]
  R -->|React elements| OUTR["Rendered UI (React)"]

  classDef k fill:#eef,stroke:#99c,stroke-width:1px,color:#223;
  classDef s fill:#efe,stroke:#9c9,stroke-width:1px,color:#223;
  classDef r fill:#ffe,stroke:#cc9,stroke-width:1px,color:#223;

  class T k
  class I18N s
  class C k
  class FW r
  class Inputs r

```

```mermaid
flowchart LR
  subgraph T["Translators / CW"]
    T1["Define key names<br />(naming + namespaces)"]
    T2["Write translation values<br />with allowed <Component/> tags"]
    T3["Submit for review"]
  end

  subgraph D["Developers"]
    D1["Define component allow-list<br />& props schema"]
    D2["Provide components map<br />{TagName: props}"]
    D3["Add parser/render tests"]
  end

  subgraph R["Runtime (App)"]
    R1[Fetch i18n JSON by key/locale]
    R2[Parse string → AST]
    R3[Render AST → Vue nodes]
    R4[Fallbacks for unknown tags/props]
  end

  subgraph Q["QA / Review"]
    Q1["Preview in staging"]
    Q2["Check accessibility & copy"]
  end

  %% Flow
  T1 --> T2 --> T3 --> D1
  D1 --> D2 --> D3 --> R1
  R1 --> R2 --> R3 --> R4 --> Q1 --> Q2
```

```mermaid
sequenceDiagram
    autonumber
    participant CW as CW / Translator
    participant Repo as i18n JSON (per locale)
    participant Dev as Developer
    participant App as Vue App (&lt;Tanzlate/&gt;)
    participant Parser as Tanzlate Parser
    participant User as End User

    Note over CW,Dev: Conventions: namespaces, tag allow-list, props schema

    CW->>Repo: Create/update key & value with <Component/> tags
    Dev->>App: Provide components map & values (props, slots)
    App->>Repo: Fetch translation by key + locale
    App->>Parser: Parse translation string
    Parser-->>App: AST (array of strings + { tag, content, props })
    App-->>User: Rendered output (components interpolated)

    alt Missing component mapping / invalid tag
      Parser-->>App: Warning + fallback (plain text or safe tag)
      App-->>User: Graceful degraded render
    end

    Note over CW,Repo: Review translations (style, accessibility, semantics)
    Note over Dev,App: Unit tests for parser + render (critical keys)
```

---
title: Naming Conventions
titleTemplate: tanzlate
outline: [2, 3]
---

# What are translation keys?

Translation keys are unique identifiers to reference specific text strings that require translation.

They serve as a placeholder for the actual text content that will be translated accordingly.

e.g. a key named `course_name` will be translated in the corresponding language depending on user’s settings.

# Casing

We will use using snake_case as a naming scheme for the keys.

# Key categories

We will use 3 levels of categories when defining a key, for example:

`{application_name}.{section_or_component}.{description_of_the_content}`

The `application_name` will be the main namespace, e.g. `admin_frontend` or `academy_frontend` . See https://www.i18next.com/principles/namespaces for more informations.

This namespace can then be changed (in the case of merging / changing applications directories) but it will reference the key to avoid duplications.

The `section_or_component` will be the component and / or the page where the key is located, e.g:

- global
- dashboard
- authentication
- sidebar
- course_list
- course_detail
- course_catalogue
- customers
- mailings
- analytics
- settings
- …

The `description_of_the_content` will be the direct description of the key content, e .g.

- share_modal_title
- publish
- header_title
- …

Note: in some specific cases, we can consider using 4 levels of categories, such in a case of a nested form.

## The `global` Namespace

The `global` namespace is where are stored translations that are likely to be used multiple times in the app. Some example can be:

```json
{
  "global": {
    "ok": "Okay",
    "cancel": "Cancel",
    "next": "Next",
    "previous": "Previous"
  }
}
```

# Content Matters

It usually doesn’t matter if the key in question is part of the footer navigation used in a specific controller or within a special layout.

What matters is the section and the key description that should be human-readable and provide informations about the purpose and the context of the key.

## Avoid complexity

The `description_of_the_content` part should indicate precisely what is the purpose of the key.

Don’t hesitate to use a long description e.g. `data_processing_agreement_not_signed_text` that could be understood by a person who is not directly using the codebase.

# Avoid concatenating translations

It seems sometimes intuitive and easier to concatenate existing keys to create a new string.

For example, in a case where you have two different keys “agree” and “proceed” already existing.

Then, you might face a string that should display “Agree and proceed”, so we could think of doing something like:

```tsx
t('agree') + ' ' + t('proceed');
```

The problem is that in some languages, this concatenation is not working as such, and it is usually better to create a new key when there is a new value.

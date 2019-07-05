# remark-tree-sitter

[![Build Status](https://dev.azure.com/samlanning/tree-sitter/_apis/build/status/remark-tree-sitter?branchName=master)](https://dev.azure.com/samlanning/tree-sitter/_build/latest?definitionId=3&branchName=master) [![Total alerts](https://img.shields.io/lgtm/alerts/g/samlanning/remark-tree-sitter.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/samlanning/remark-tree-sitter/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/samlanning/remark-tree-sitter.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/samlanning/remark-tree-sitter/context:javascript) [![](https://img.shields.io/npm/v/remark-tree-sitter.svg)](https://www.npmjs.com/package/remark-tree-sitter)

Highlight code in Markdown files using
[tree-sitter](https://github.com/tree-sitter/tree-sitter) and
[remark][].
Powered by [tree-sitter-hast](https://github.com/samlanning/tree-sitter-hast).

## Installation

```bash
npm install remark-tree-sitter
```

or

```bash
yarn add remark-tree-sitter
```

## Usage

This plugin uses the same mechanism and data as Atom for syntax highlighting,
So to highlight a particular language, you need to either:

* Install the APM (Atom) package for that language and tell `remark-tree-sitter`
  to import it, using the [`grammarPackages` option](#options.grammarpackages).
  *(See [Atom language packages](#atom-language-packages))*
* Provide the `tree-sitter` grammar and scopeMappings manually,
  using the using the [`grammars` option](#options.grammars).

*For more information on how this mechanism works,
[check out the documentation for `tree-sitter-hast`](https://github.com/samlanning/tree-sitter-hast#scope-mappings).*

Any code blocks that are encountered for which there is not a matching language will be ignored.

### Example

The following example is also in the [examples](examples/) directory
and can be run directly from there.
It uses `@atom-languages/language-typescript` to provide the TypeScript grammar and 

```
npm install to-vfile vfile-reporter remark remark-tree-sitter remark-html @atom-languages/language-typescript
```

[`examples/example.js`](examples/example.js)
```js
const vfile = require('to-vfile')
const report = require('vfile-reporter')
const remark = require('remark')
const treeSitter = require('remark-tree-sitter')
const html = require('remark-html')

remark()
  .use(treeSitter, {
    grammarPackages: ['@atom-languages/language-typescript']
  })
  .use(html)
  .process(vfile.readSync('example.md'), (err, file) => {
    console.error(report(err || file))
    console.log(String(file))
  })
```

**Output:**

```html
example.md: no issues found
<pre><code class="tree-sitter language-typescript"><span class="source ts"><span class="storage type function">function</span> <span class="entity name function">foo</span><span class="punctuation definition parameters begin bracket round">(</span><span class="punctuation definition parameters end bracket round">)</span> <span class="punctuation definition function body begin bracket curly">{</span>
  <span class="keyword control">return</span> <span class="constant numeric">1</span><span class="punctuation terminator statement semicolon">;</span>
<span class="punctuation definition function body end bracket curly">}</span></span></code></pre>
```

## Atom language packages

To use an Atom language package,
like any package you first need to install it using `npm install` or `yarn add`.
Unfortunately most **APM** packages are not made available on **NPM**,
so I've started to make some of them available under the NPM organization
[`@atom-languages`](https://www.npmjs.com/org/atom-languages).
Here's a list of packages with which languages they provide highlighting for.

* [`@atom-languages/language-typescript`](https://www.npmjs.com/package/@atom-languages/language-typescript):
  `typescript`, `tsx` (TypeScriptReact), `flow`

## API

### `remark.use(treeSitter, options)`

Note that `options` is required, and either `grammarPackages` or `grammars` needs to be provided. (Both can be provided, and grammars specified in `grammars` will overide those loaded in `grammarPackages`).

#### `options.grammarPackages`

An array of all [Atom language packages](#atom-language-packages) that should be loaded.

**Example:**

```ts
remark().use(treeSitter, {
    grammarPackages: ['@atom-languages/language-typescript']
  })
```

The language names that code blocks must then use
to refer to a language is based on the filenames in the atom package.
For example the above package
[has the files](https://github.com/atom/language-typescript/tree/master/grammars):
`tree-sitter-flow.cson`, `tree-sitter-tsx.cson`, `tree-sitter-typescript.cson`...
so this will make the languages `flow`, `tsx` and `typescript`
available for use within code blocks.

If you want to make loaded languages available to use via different names,
you can use [`options.languageAliases`](#options.languagealiases).

#### `options.grammars`

An object mapping language keys objects containing `grammar` and `scopeMappings`.

Anything specified here will overwrite the languages loaded by [`options.grammarPackages`](#options.grammarpackages).

*For more information on scopeMappings, [check out the documentation for `tree-sitter-hast`](https://github.com/samlanning/tree-sitter-hast#scope-mappings).*

**Example:**

See a working example at [`examples/example-grammars.js`](examples/example-grammars.js).

```ts
remark().use(treeSitter, {
    grammars: {
      typescript: {
        grammar: typescriptGrammar,
        scopeMappings: typescriptScopeMappings
      },
      'custom-language': {
        grammar: customLanguageGrammar,
        scopeMappings: customLanguageScopeMappings
      }
    }
  })
```

You can then use both the `typescript` and `custom-language` languages in code blocks:

````md
```custom-language
some code
```

```typescript
let foo = 'bar';
```
````

If you want to make loaded languages available to use via different names,
you can use [`options.languageAliases`](#options.languagealiases).

#### `options.classWhitelist`

Sometimes including the full list of classes applied by the scope mappings
can be too much,
and you'd like to only include those that you have stylesheets for.

To do this, you can pass in a whitelist of classes that you actually care about.

**Example:** The following configuration...

```ts
remark().use(treeSitter, {
    grammarPackages: ['@atom-languages/language-typescript'],
    classWhitelist: ['storage', 'numeric']
  })
```

...will convert the following markdown...

````md
```typescript
function foo() {
  return 1;
}
```
````

...to this:

```html
<pre><code class="tree-sitter language-typescript"><span><span class="storage">function</span> foo() {
  return <span class="numeric">1</span>;
}</span></code></pre>
```


#### `options.languageAliases`

*TODO: `options.languageAliases` is not implemented yet*

TODO:

* Add unit tests for `grammars` option

## Related

*   [`remark-rehype`](https://github.com/remarkjs/remark-rehype)
    — Transform Markdown to HTML
*   [`remark-midas`](https://github.com/remarkjs/remark-midas)
    — Highlight CSS code blocks with midas (rehype compatible)
*   [`remark-highlight.js`](https://github.com/remarkjs/remark-highlight.js)
    — Highlight code with highlight.js (via lowlight)
*   [`remark-code-frontmatter`](https://github.com/samlanning/remark-code-frontmatter)
    — Extract frontmatter from markdown code blocks
*   [`remark-code-extra`](https://github.com/samlanning/remark-code-extra)
    — Add to or transform the HTML output of code blocks (rehype compatible)
*   [`rehype-highlight`](https://github.com/rehypejs/rehype-highlight)
    — [rehype][] plugin to highlight code (via lowlight)
*   [`rehype-prism`](https://github.com/mapbox/rehype-prism)
    — [rehype][] plugin to highlight code (via refractor)
*   [`rehype-shiki`](https://github.com/rsclarke/rehype-shiki)
    — [rehype][] plugin to highlight code with shiki

<!-- Definitions -->

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype
import * as unified from 'unified';
import * as markdown from 'remark-parse';
import * as remark2rehype from 'remark-rehype';
import * as html from 'rehype-stringify';

import * as treeSitter from 'remark-tree-sitter';

const processor = unified()
  .use(markdown)
  .use(treeSitter.plugin, {
    grammarPackages: ['language-javascript'],
    classWhitelist: ['storage', 'numeric']
  } as treeSitter.Options)
  .use(remark2rehype)
  .use(html);

const example = `
# Hello World

A **example**.

\`\`\`\`\`my-language
---
foo: bar
---
This is a code snippet
\`\`\`\`\`

\`\`\`
---
foo: bar
---
This is a code snippet
\`\`\`

\`\`\`\`\`javascript
function foo() {
  return 1;
}
\`\`\`\`\`

\`\`\`\`\`js
function foo() {
  return 1;
}
\`\`\`\`\`

`;

processor.process(example, (err, file) => {
  if (err) console.error(err);
  console.log(file.contents);
});

import * as unified from 'unified';
import * as markdown from 'remark-parse';
import * as treeSitter from 'remark-tree-sitter';
import * as remark2rehype from 'remark-rehype';
import * as html from 'rehype-stringify';

const processor = unified()
  .use(markdown)
  .use(treeSitter)
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
let x = 1; console.log(x);
\`\`\`\`\`

`;

processor.process(example, (err, file) => {
  if (err) console.error(err);
  console.log(file.contents);
});

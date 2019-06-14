import * as unified from 'unified';
import * as markdown from 'remark-parse';
import * as remark2rehype from 'remark-rehype';
import * as html from 'rehype-stringify';

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(html);

const example = `
# Hello World

## Table of Content

## Install

A **example**.

## Use

More \`text\`.

## License

MIT
`;

processor.process(example, (err, file) => {
  if (err) console.error(err);
  console.log(file.contents);
});

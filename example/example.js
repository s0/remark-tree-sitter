const vfile = require('to-vfile')
const report = require('vfile-reporter')
const unified = require('unified')
const markdown = require('remark-parse')
const treeSitter = require('remark-tree-sitter')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')

unified()
  .use(markdown)
  .use(treeSitter, {
    grammarPackages: ['@atom-languages/language-typescript']
  })
  .use(remark2rehype)
  .use(html)
  .process(vfile.readSync('example.md'), (err, file) => {
    console.error(report(err || file))
    console.log(String(file))
  })

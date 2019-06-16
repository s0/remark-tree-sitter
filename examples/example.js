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
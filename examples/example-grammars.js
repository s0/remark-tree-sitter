const vfile = require('to-vfile')
const report = require('vfile-reporter')
const unified = require('unified')
const markdown = require('remark-parse')
const treeSitter = require('remark-tree-sitter')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')

const loadLanguages = require('tree-sitter-hast').loadLanguagesFromPackage;

loadLanguages('@atom-languages/language-typescript').then(languages => {
  const language = languages.get('typescript');
  unified()
    .use(markdown)
    .use(treeSitter, {
      grammars: {
        typescript: {
          grammar: language.grammar,
          scopeMappings: language.scopeMappings
        }
      }
    })
    .use(remark2rehype)
    .use(html)
    .process(vfile.readSync('example.md'), (err, file) => {
      console.error(report(err || file))
      console.log(String(file))
    })
});


const vfile = require('to-vfile')
const report = require('vfile-reporter')
const remark = require('remark')
const treeSitter = require('remark-tree-sitter')
const html = require('remark-html')

const loadLanguages = require('tree-sitter-hast').loadLanguagesFromPackage;

loadLanguages('@atom-languages/language-typescript').then(languages => {
  const language = languages.get('typescript');
  remark()
    .use(treeSitter, {
      grammars: {
        typescript: {
          grammar: language.grammar,
          scopeMappings: language.scopeMappings
        }
      }
    })
    .use(html)
    .process(vfile.readSync('example.md'), (err, file) => {
      console.error(report(err || file))
      console.log(String(file))
    })
});

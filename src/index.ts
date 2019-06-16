import {Node} from 'unist';
import {Attacher, Transformer} from 'unified';
import * as treeSitterHast from 'tree-sitter-hast';
import visit = require('unist-util-visit');

import {validateOptions} from './options';
import {Grammars, MultiLanguageParser} from './parse';

interface MDASTCode extends Node {
  lang?: string;
  meta: null | string;
  value: string;
}

const attacher: Attacher = (options) =>  {
  if (!validateOptions(options))
    throw new Error('Invalid options');

  // Load required packages
  let loaders = (options.grammarPackages || []).map(pkg => treeSitterHast.loadLanguagesFromPackage(pkg));

  const parserPromise = Promise.all(loaders).then(loadedLanguages => {
    const grammars: Grammars = Object.assign({}, options.grammars);
    for (const map of loadedLanguages) {
      for (const entry of map.entries()) {
        grammars[entry[0]] = entry[1];
      }
    }
    // Add extra grammars after that (to allow for overriding)
    Object.assign(grammars, options.grammars);
    // TODO: allow additional language keys

    return new MultiLanguageParser(grammars);
  });

  const transformer: Transformer = async (tree, _file) => {
    const parser = await parserPromise;
    visit<MDASTCode>(tree, 'code', node => {
      const lang = node.lang;

      if (lang && parser.canParseLanguage(lang)) {
        // Parse & Highlight
        const highlighted = treeSitterHast.highlightText(
          parser.getParser(lang),
          parser.getScopeMappings(lang),
          node.value,
          { classWhitelist: options.classWhitelist }
          );

        if (!node.data) {
          node.data = {};
        }

        // Convert to Tree-Sitter Node
        node.data.hProperties = {
          className: [
            'tree-sitter',
            ...(lang ? [`language-${lang}`] : [])
          ]
        };
        node.data.hChildren = [highlighted];
      }
    });

    return tree;
  };

  return transformer;
};

(attacher as any).validateOptions = validateOptions;

export = attacher;


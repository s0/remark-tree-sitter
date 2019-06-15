import {Node} from 'unist';
import {Attacher, Transformer} from 'unified';
import * as treeSitterHast from 'tree-sitter-hast';
import visit = require('unist-util-visit');

import {Element, Text} from 'tree-sitter-hast/hast';

import {Grammars, MultiLanguageParser} from './parse';

interface MDASTCode extends Node {
  lang?: string;
  meta: null | string;
  value: string;
}

interface TreeSitterData {
  [id: string]: unknown;
  hName: 'div';
  hProperties: {
    className: string[];
  };
  hChildren?: (Element | Text)[];
}

export type Options = {
  /**
   * Mapping from language keys to grammars to use for parsing
   */
  grammars: Grammars;
};

function isOptions(value: any): value is Options {
  return value && !!(value as Options).grammars;
}

const attacher: Attacher = (options) =>  {
  if (!isOptions(options)) {
    throw new Error('Missing `grammars` in options');
  }

  const parser = new MultiLanguageParser(options.grammars);

  const transformer: Transformer = (tree, _file) => {
    visit<MDASTCode>(tree, 'code', node => {
      console.log(node);
      const lang = node.lang;


      if (lang && parser.canParseLanguage(lang)) {
        const tree = parser.parse(lang, node.value);
        console.log(tree.rootNode.toString());

        // Parse & Highlight
        const highlighted = treeSitterHast.highlightTree(parser.getScopeMappings(lang), node.value, tree);

        // Convert to Tree-Sitter Node
        node.type = 'tree-sitter';
        const data: TreeSitterData = {
          hName: 'div',
          hProperties: {
            className: [
              'tree-sitter',
              ...(lang ? [`language-${lang}`] : [])
            ]
          },
          hChildren: [
            {
              type: 'element',
              tagName: 'pre',
              children: [
                highlighted
              ]
            }
          ]
        };
        node.data = data;
      }
    });

    return tree;
  };

  return transformer;
};

export {attacher, attacher as plugin};
export default attacher;


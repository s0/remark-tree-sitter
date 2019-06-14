import {Node, Parent} from 'unist';
import {Attacher, Transformer} from 'unified';
import visit = require('unist-util-visit');

import {Grammars, MultiLanguageParser} from './parse';

interface MDASTCode extends Node {
  lang?: string;
  meta: null | string;
  value: string;
}

interface HastParent extends Parent {
  children: HastElement[];
}

interface HastElement extends HastParent {
  type: 'element';
  tagName: string;
  properties?: unknown;
}

interface TreeSitterData {
  [id: string]: unknown;
  hName: 'div';
  hProperties: {
    className: string[];
  };
  hChildren?: HastElement[];
}

type Options = {
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
        const parsed = parser.parse(lang, node.value);
        console.log(parsed.rootNode.toString());
      }

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
            children: []
          }
        ]
      };
      node.data = data;
    });

    return tree;
  };

  return transformer;
};

export = attacher;


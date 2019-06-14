import {Node, Parent} from 'unist';
import {Attacher, Transformer} from 'unified';
import visit = require('unist-util-visit');

import {parse, canParseLanguage} from './parse';

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

const attacher: Attacher = () =>  {
  const transformer: Transformer = (tree, _file) => {
    visit<MDASTCode>(tree, 'code', node => {
      console.log(node);
      const lang = node.lang;

      if (lang && canParseLanguage(lang)) {
        const parsed = parse(lang, node.value);
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


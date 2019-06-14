import {Node, Parent} from 'unist';
import {Attacher, Transformer} from 'unified';
import visit = require('unist-util-visit');

interface MDASTCode extends Node {
  lang?: string;
  meta: null | string;
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
      const lang = node.lang;

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


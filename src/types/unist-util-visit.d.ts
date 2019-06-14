declare module 'unist-util-visit' {
  import {Node} from 'unist';
  import {} from 'unified';

  type Visitor<T> = (node: T) => void;

  function visit<T extends Node>(node: Node, nodeName: string, visitor: Visitor<T>): void;

  export = visit;
}

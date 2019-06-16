import {Grammars} from './parse';

export type Options = {
  /**
   * Mapping from language keys to prepared langauges to use for parsing and highlighting
   */
  grammars?: Grammars;

  /**
   * List of APM language packages to load the grammars from
   */
  grammarPackages?: string[];
  /**
   * If specified, only the classes in the given whitelist will be used and output.
   *
   * Use this to reduce the output when only certain classes are styled.
   */
  classWhitelist?: string[];
};

export function validateOptions(value: any): value is Options {
  if (!value)
    throw new Error('Missing options');
  if (!(value as Options).grammars && !(value as Options).grammarPackages)
    throw new Error('grammars or grammarPackages must be specified in options');
  return true;
}

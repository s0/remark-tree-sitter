import * as Parser from 'tree-sitter';

type Grammar = any;

/**
 * Mapping from language keys to grammars to use for parsing
 */
export type Grammars = {[id: string]: Grammar};

export class MultiLanguageParser {

  /**
   * Mapping from language keys to grammars to use for those languages
   */
  private readonly grammars: Grammars;

  /**
   * Map from grammars to active parsers available to use
   * (we map grammars instead of languages due to the many-to-one mapping of Language to grammars)
   */
  private readonly parsers = new Map<Grammar, Parser>();

  constructor(grammars: Grammars) {
    this.grammars = grammars;
  }

  /**
   * Return true if we can parse this language
   */
  public canParseLanguage(language: string): boolean {
    return !!this.grammars[language];
  }

  public parse(language: string, code: string) {
    const grammar = this.grammars[language];
    if (!grammar) throw new Error('invalid language');
    let parser = this.parsers.get(grammar);
    if (!parser) {
      this.parsers.set(grammar, parser = new Parser());
      parser.setLanguage(grammar);
    }
    return parser.parse(code);
  }
}

import * as Parser from 'tree-sitter';
import * as javascript from 'tree-sitter-javascript';

type Grammar = any;

/**
 * Mapping from language keys to grammars to use for those languages
 */
const LANGUAGES = {
  js: javascript,
  javascript: javascript
};

type Language = keyof typeof LANGUAGES;

/**
 * Map from grammars to active parsers available to use
 * (we map grammars instead of languages due to the many-to-one mapping of Language to grammars)
 */
const parsers = new Map<Grammar, Parser>();

/**
 * Return true if we can parse this language
 */
export function canParseLanguage(language: string): language is Language {
  return !!LANGUAGES[language];
}

export function parse(language: Language, code: string) {
  const grammar = LANGUAGES[language];
  let parser = parsers.get(grammar);
  if (!parser) {
    parsers.set(grammar, parser = new Parser());
    parser.setLanguage(LANGUAGES[language]);
  }
  return parser.parse(code);
}

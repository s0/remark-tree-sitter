import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as remark from 'remark';
import * as html from 'remark-html';

import * as treeSitter from 'remark-tree-sitter';
import {promisify} from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const FILES_DIR = path.join(path.dirname(__dirname), 'files');

const TESTS = [
  'basic-usage',
  'typescript',
  'typescript-nogrammar',
  'typescript-whitelist',
  'typescript-whitelist-empty'
];

describe('main tests', () => {
  for (const testCase of TESTS) {
    it(testCase, async () => {

      const markdownPath = path.join(FILES_DIR, testCase + '.md');
      const optionsPath = path.join(FILES_DIR, testCase + '.options.json');
      const htmlPath = path.join(FILES_DIR, testCase + '.expected.html');

      const options = JSON.parse(await readFile(optionsPath, 'utf8'));

      const processor = remark()
        .use(treeSitter, options)
        .use(html);

      const markdownSource = await readFile(markdownPath, 'utf8');
      const htmlResult = await promisify(processor.process)(markdownSource);

      try {
        const expected = await readFile(htmlPath, 'utf8');
        assert.equal(htmlResult.contents, expected);
      } catch (e) {
        if (process.env.TEST_FIX === 'true') {
          await writeFile(htmlPath, htmlResult.contents);
          throw new Error(`Result Unexpected, written new contents to ${htmlPath}`);
        } else {
          throw e;
        }
      }
    });
  }
});

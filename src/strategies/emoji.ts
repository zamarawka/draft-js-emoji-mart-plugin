import { ContentBlock } from 'draft-js';
import findWithRegex from 'find-with-regex';

import { unicodeEmojiRegexp } from '../constants';

function emojiStrategy(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
): void {
  findWithRegex(unicodeEmojiRegexp, contentBlock, callback);
}

export default emojiStrategy;

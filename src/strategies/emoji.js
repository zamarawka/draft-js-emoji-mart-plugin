// @flow

import { ContentBlock } from 'draft-js';
import findWithRegex from 'find-with-regex';

import { unicodeEmojiRegexp } from '../constants';

export default (contentBlock: ContentBlock, callback: Function) => {
  findWithRegex(unicodeEmojiRegexp, contentBlock, callback);
};

// @flow

// Original: https://github.com/missive/emoji-mart/pull/250

import { uncompress } from 'emoji-mart/dist/utils/data';
import { unifiedToNative, getSanitizedData } from 'emoji-mart/dist/utils';

type EmojiEntity = {
  id: string,
  unified: string,
  short_names: Array<string>
};

type DataSet = {
  compressed: bool,
  emojis: {
    [string]: EmojiEntity
  }
};

const skinTones: Array<string> = ['', '🏻', '🏼', '🏽', '🏾', '🏿'];

const getEmojiDataFromNative = (data: DataSet, set: string) => (nativeString: string) => {
  if (data.compressed) {
    uncompress(data);
  }

  let skin;
  let baseNativeString = nativeString;

  skinTones.forEach((skinTone) => {
    baseNativeString = baseNativeString.replace(skinTone, '');
    if (nativeString.indexOf(skinTone) > 0) {
      skin = skinTones.indexOf(skinTone) + 1;
    }
  });

  // $FlowFixMe
  const emojiData: ?EmojiEntity = Object.values(data.emojis).find(
    // $FlowFixMe
    (emoji: EmojiEntity) => unifiedToNative(emoji.unified) === baseNativeString,
  );

  if (!emojiData) {
    return null;
  }

  const [id] = emojiData.short_names;

  emojiData.id = id;

  return getSanitizedData(emojiData, skin, set, data);
};

export default getEmojiDataFromNative;

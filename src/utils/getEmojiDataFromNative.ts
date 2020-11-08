// Original: https://github.com/missive/emoji-mart/pull/250

import { Data, Emoji, uncompress } from 'emoji-mart/dist-es/utils/data';
import { BaseEmoji, EmojiSkin } from 'emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index';
import { unifiedToNative, getSanitizedData } from 'emoji-mart/dist-es/utils';
import { EmojiSet } from 'emoji-mart/dist-es/utils/shared-props';

const skinTones: string[] = ['', '🏻', '🏼', '🏽', '🏾', '🏿'];

const getEmojiDataFromNative = (data: Data, set: EmojiSet) => (nativeString: string): BaseEmoji | null => {
  if (data.compressed) {
    uncompress(data);
  }

  let skin: EmojiSkin;
  let baseNativeString = nativeString;

  skinTones.forEach((skinTone) => {
    baseNativeString = baseNativeString.replace(skinTone, '');

    if (nativeString.indexOf(skinTone) > 0) {
      skin = (skinTones.indexOf(skinTone) + 1) as EmojiSkin;
    }
  });

  const emojiData: Emoji = Object.values(data.emojis).find(
    (emoji: Emoji) => unifiedToNative(emoji.unified) === baseNativeString,
  );

  if (!emojiData) {
    return null;
  }

  const [id] = emojiData.short_names;

  // @ts-expect-error Emoji type don't have id. getSanitizedData typeless.
  emojiData.id = id;

  return getSanitizedData(emojiData, skin, set, data);
};

export default getEmojiDataFromNative;

declare module 'emoji-mart/dist-es/utils' {
  import { BaseEmoji, EmojiSkin } from 'emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index';
  import { Data, Emoji } from 'emoji-mart/dist-es/utils/data';
  import { EmojiSet } from 'emoji-mart/dist-es/utils/shared-props';

  function getSanitizedData(
    emoji: string | BaseEmoji | Emoji,
    skin: EmojiSkin,
    set: EmojiSet,
    data: Data
  ): BaseEmoji;
  function unifiedToNative(unified: string): string;

  export { unifiedToNative, getSanitizedData };
}


declare module 'find-with-regex' {
  export type StrategyCallback = (start: number, end: number) => void;

  export default function findWithRegex(
    regex: RegExp,
    contentBlock: ContentBlock,
    callback: StrategyCallback
  ): void;
}

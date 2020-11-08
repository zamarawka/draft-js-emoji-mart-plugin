// Original: https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-emoji-plugin/src/utils/convertShortNameToUnicode.js
export default function convertShortNameToUnicode(unicode: string): string {
  if (unicode.indexOf('-') > -1) {
    const parts: string[] = [];

    const s = unicode.split('-');

    for (let i = 0; i < s.length; i += 1) {
      let part: number | string = parseInt(s[i], 16);

      if (part >= 0x10000 && part <= 0x10FFFF) {
        const hi = Math.floor((part - 0x10000) / 0x400) + 0xD800;
        const lo = ((part - 0x10000) % 0x400) + 0xDC00;
        part = (String.fromCharCode(hi) + String.fromCharCode(lo));
      } else {
        part = String.fromCharCode(part);
      }

      parts.push(part);
    }

    return parts.join('');
  }

  const s = parseInt(unicode, 16);

  if (s >= 0x10000 && s <= 0x10FFFF) {
    const hi = Math.floor((s - 0x10000) / 0x400) + 0xD800;
    const lo = ((s - 0x10000) % 0x400) + 0xDC00;

    return (String.fromCharCode(hi) + String.fromCharCode(lo));
  }

  return String.fromCharCode(s);
}

[![Ci Status](https://github.com/zamarawka/draft-js-emoji-mart-plugin/workflows/CI/badge.svg)](https://github.com/zamarawka/draft-js-emoji-mart-plugin/actions)
[![Npm version](https://img.shields.io/npm/v/draft-js-emoji-mart-plugin?style=flat&logo=npm)](https://www.npmjs.com/package/draft-js-emoji-mart-plugin)
[![Draft.js version](https://img.shields.io/npm/dependency-version/draft-js-emoji-mart-plugin/peer/draft-js.svg?style=flat)](https://draftjs.org)
[![React.js version](https://img.shields.io/npm/dependency-version/draft-js-emoji-mart-plugin/peer/react.svg?style=flat&logo=react)](https://reactjs.org)

# Emoji-mart integration with DraftJS

*This plugin for [draft-js-editor](https://www.npmjs.com/package/draft-js-plugins-editor)*

Package includes its TypeScript Definition file

## Install

```sh
npm install -S draft-js-emoji-mart-plugin
```

Install peer dependencies

```sh
npm install -S emoji-mart draft-js
```

## Usage

```js
import Editor from 'draft-js-plugins-editor';
import createEmojiMartPlugin from 'draft-js-emoji-mart-plugin';
import data from 'emoji-mart/data/apple.json';

import 'emoji-mart/css/emoji-mart.css'

const emojiPlugin = createEmojiMartPlugin({
  data,
  set: 'apple'
});

// NimblePicker from emoji-mart binded with draftjs
const { Picker } = emojiPlugin;

const MyEditor = ({ editorState, onChange }) => (
  <div>
    <Editor
      editorState={editorState}
      onChange={onChange}
      plugins={[emojiPlugin]}
    />
    {/*
      Any props supported by emoji-mart NimblePicker.
      Feel free to style it and trigger for view.
    */}
    <Picker
      perLine={7}
      showPreview={false}
    />
  </div>
)

export default MyEditor;
```

## Configuration Parameters

| Name | Required | Default | Description |
| ---- | -------- | ------- | ----------- |
| data | true | `undefined` | [Dataset](https://github.com/missive/emoji-mart/blob/master/README.md#datasets) from emoji-mart. Used for bind picker and replace emoji in editor. |
| set | true | `undefined` | Addtional param to Dataset, used by emoji-mart. |
| sheetSize | false | 32 | [Sheet size](https://github.com/missive/emoji-mart#sheet-sizes) wich pass to Emoji component from emoji-mart. |
| emojiSize | false | sheetSize / 2 | [Size](https://github.com/missive/emoji-mart/blob/master/README.md#emoji) wich pass to Emoji component from emoji-mart. By default sheetSize / 2. |
| onChange | false | undefined | Call then DraftJS recieve new state. |

## Additional plugin feature

### Emoji component

Plugin provide `Emoji` component, wich could replace native utf-8 emoji by `NimbleEmoji` component from emoji-mart.

```js
// MyEditor.jsx
export const emojiPlugin = createEmojiMartPlugin({
  data,
  set: 'apple'
});

// Text.jsx
import { emojiPlugin } from './MyEditor.jsx';

const { Emoji } = emojiPlugin;

const TextViewer = ({ props }) => (
  <div>
    Useful text with emoji <Emoji decoratedText={'😈'} />
  </div>
);

export default TextViewer;
```

### Emoji RegExp

Useful to find native emoji in string. Could be used with `Emoji` component provided by plugin for replace emoji in plane text.

```js
import { unicodeEmojiRegexp } from 'draft-js-emoji-mart-plugin/lib/constants';
import { emojiPlugin } from './MyEditor.jsx';

const { Emoji } = emojiPlugin;

// Not for production usage.
const parsedText = 'some string with 😈 '.split(unicodeEmojiRegexp).map(term => {
  if (term.match(unicodeEmojiRegexp)) {
    return <Emoji decoratedText={term} />
  }

  return term;
});

console.log(parsedText); // ['some string with', <Emoji decoratedText={'😈'}>]

// Render it by React
const MyEmojifiedText = () => (
  <div>{parsedText}</div>
);
```

## Development

Run development env

```sh
npm run watch # for build ts on change
npm run storybook # run sandbox with base example
```

Local build

```sh
npm run lint
npm run build # build ts by babel and generate typings
```

Active maintenance with care and ❤️.

Feel free to send a PR.

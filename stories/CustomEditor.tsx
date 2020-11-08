import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import createEmojiMartPlugin from '../lib'; // type 'draft-js-emoji-mart-plugin' for real usage
import data from 'emoji-mart/data/apple.json';

import 'emoji-mart/css/emoji-mart.css';

import './custom-editor.css';

const emojiPlugin = createEmojiMartPlugin({
  data,
  set: 'apple'
});

// NimblePicker from emoji-mart binded with draftjs
const { Picker } = emojiPlugin;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customEmojis: any[] = [
  {
    name: 'Octocat',
    short_names: ['octocat'],
    text: '',
    emoticons: [],
    keywords: ['github'],
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
    customCategory: 'GitHub'
  },
  {
    name: 'Test Flag',
    short_names: ['test'],
    text: '',
    emoticons: [],
    keywords: ['test', 'flag'],
    spriteUrl: 'https://unpkg.com/emoji-datasource-twitter@4.0.4/img/twitter/sheets-256/64.png',
    sheet_x: 1,
    sheet_y: 1,
    size: 64,
    sheetColumns: 52,
    sheetRows: 52,
  },
]

const CustomEditor: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty()
  );
  const [isShowPicker, setPickerVisible] = useState(true);

  return (
    <>
      <div className="custom-editor">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          plugins={[emojiPlugin]}
        />
        <button
          className="custom-editor__button"
          onClick={() => setPickerVisible((val) => !val)}
        >{isShowPicker ? 'Close' : 'Open'} Picker</button>
      </div>
      {isShowPicker &&
        <div className="custom-editor__picker">
          <Picker
            perLine={7}
            showPreview={false}
            custom={customEmojis}
          />
        </div>
      }
    </>
  );
}

export default CustomEditor;

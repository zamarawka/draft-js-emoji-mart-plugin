/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */

import React from 'react';
import { NimbleEmoji as Emoji, NimblePicker as Picker } from 'emoji-mart';
import { EditorState } from 'draft-js';

import attachImmutableEntitiesToEmojis from './modifiers/attachImmutableEntitiesToEmojis';
import addEmoji from './modifiers/addEmoji';
import emoji from './strategies/emoji';
import getEmojiDataFromNative from './utils/getEmojiDataFromNative';

export default function ({
  onChange = null,
  data,
  set,
  emojiSize = 16,
} = {}) {
  const getEmoji = getEmojiDataFromNative(data, set);
  const addEmojiModifier = addEmoji.bind(null, getEmoji);

  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
  };

  const EmojiComponent = React.memo(({ decoratedText, children }) => {
    const foundedEmoji = getEmoji(decoratedText);

    if (foundedEmoji) {
      return (
        <Emoji
          emoji={foundedEmoji}
          size={emojiSize}
          data={data}
          set={set}
        >
          {children}
        </Emoji>
      );
    }

    return decoratedText;
  });

  const handleEmoji = (emojiSymbol) => {
    const newEditorState = addEmojiModifier(store.getEditorState(), emojiSymbol.native);

    store.setEditorState(newEditorState);
  };

  const PickerComponent = React.forwardRef((props, ref) => (
    <Picker
      ref={ref}
      set={set}
      data={data}
      onSelect={handleEmoji}
      {...props}
    />
  ));

  const decorators = [
    {
      strategy: emoji,
      component: EmojiComponent,
    },
  ];

  return {
    Emoji: EmojiComponent,
    Picker: PickerComponent,
    decorators,
    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },
    willUnmount: () => {
      store.getEditorState = undefined;
      store.setEditorState = undefined;
    },
    modifiers: {
      addEmoji: addEmojiModifier,
    },
    onChange: (editorState) => {
      let newEditorState = attachImmutableEntitiesToEmojis(editorState);

      if (!newEditorState.getCurrentContent().equals(editorState.getCurrentContent())) {
        // Forcing the current selection ensures that it will be at it's right place.
        // This solves the issue where inserting an Emoji on OSX with Apple's Emoji
        // selector led to the right selection the data, but wrong position in
        // the contenteditable.
        newEditorState = EditorState.forceSelection(
          newEditorState,
          newEditorState.getSelection(),
        );
      }

      if (onChange) {
        return onChange(newEditorState);
      }

      return newEditorState;
    },
  };
}

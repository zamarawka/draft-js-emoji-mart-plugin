import React from 'react';

// Reduce bundle size. Tree shaking issue https://github.com/missive/emoji-mart/issues/229#issuecomment-448080501
import Picker, { NimblePickerProps } from 'emoji-mart/dist-es/components/picker/nimble-picker';
import Emoji from 'emoji-mart/dist-es/components/emoji/nimble-emoji';
import { Data, Emoji as DataEmoji } from 'emoji-mart/dist-es/utils/data';
import { EmojiSet, EmojiSheetSize } from 'emoji-mart/dist-es/utils/shared-props';
import { EmojiData, BaseEmoji, CustomEmoji } from 'emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index';
import { EditorState } from 'draft-js';
import { EditorPlugin } from 'draft-js-plugins-editor';

import attachImmutableEntitiesToEmojis from './modifiers/attachImmutableEntitiesToEmojis';
import addEmoji from './modifiers/addEmoji';
import emoji from './strategies/emoji';
import getEmojiDataFromNative from './utils/getEmojiDataFromNative';

type Store = {
  getEditorState?: () => EditorState,
  setEditorState?: (EditorState: EditorState) => void
};

// Types in @types/emoji-mart not compatible with emoji-mart 3 version
// Don't use this typings in package. Patch for usage.
export type DataSet = Omit<Data, 'emojis'> & {
  emojis: {
    [key: string]: Omit<DataEmoji, 'skin_variations'>
  }
};

export interface Config {
  onChange?: (EditorState: EditorState) => EditorState,
  set: EmojiSet,
  emojiSize?: number,
  sheetSize?: EmojiSheetSize,
  data: DataSet
}

interface EmojiComponentProps {
  decoratedText: string,
  offsetKey?: string,
}

type PickerComponentProps = Omit<NimblePickerProps, 'set' | 'data' | 'sheetSize' | 'onSelect'>

type EmojiPlugin = EditorPlugin & {
  Emoji: React.ComponentType<EmojiComponentProps>,
  Picker: React.ComponentType<PickerComponentProps>,
  modifiers: {
    addEmoji: typeof addEmoji
  }
};

export default function createPlugin({
  onChange,
  data,
  set,
  sheetSize = 32,
  emojiSize = sheetSize / 2,
}: Config): EmojiPlugin {
  const getEmoji = getEmojiDataFromNative(data, set);

  const store: Store = {
    getEditorState: undefined,
    setEditorState: undefined,
  };

  const EmojiComponent = React.memo<EmojiComponentProps>(({ decoratedText, children }) => {
    const foundedEmoji = getEmoji(decoratedText);

    // Draft for caret position fix
    // Based on top of https://github.com/missive/emoji-mart#using-with-contenteditable
    // if (foundedEmoji) {
    //   let emojiMarkup = Emoji({
    //     set,
    //     data,
    //     sheetSize,
    //     html: true,
    //     size: emojiSize,
    //     emoji: foundedEmoji,
    //     children: decoratedText,
    //   });

    //   // // @ts-expect-error Add draft-js data attrs for element detection
    //   // emojiMarkup = emojiMarkup.replace('></span>', `data-text="true">${decoratedText}</span>`);

    //   return (
    //     <span
    //       style={{ fontSize: emojiSize }}
    //       className="emoji-mart-emoji-wrapper"
    //       data-offset-key={offsetKey}
    //       contentEditable={false}
    //       data-text="true"
    //       // @ts-expect-error Emoji component with html prop return markup string
    //       dangerouslySetInnerHTML={{ __html: emojiMarkup }}
    //     />
    //   );
    // }

    if (foundedEmoji) {
      return (
        <Emoji
          emoji={foundedEmoji}
          skin={foundedEmoji.skin || 1}
          size={emojiSize}
          sheetSize={sheetSize}
          data={data}
          set={set}
        >
          {children || decoratedText}
        </Emoji>
      );
    }

    return <>{decoratedText}</>;
  });

  const handleEmoji = (emojiSymbol: EmojiData) => {
    if (!store.getEditorState) {
      throw new Error('Emoji-mart plugin: handle emoji fired on unbinded instace.');
    }

    let emoji: string;
    const baseEmojiSymbol = emojiSymbol as BaseEmoji;
    const customEmojiSymbol = emojiSymbol as CustomEmoji;

    if (baseEmojiSymbol.native) {
      emoji = baseEmojiSymbol.native;
    }

    if (
      !emoji &&
      customEmojiSymbol.short_names &&
      customEmojiSymbol.short_names.length > 0
    ) {
      // Custom emoji case
      emoji = `:${customEmojiSymbol.short_names[0]}:`;
    }

    const newEditorState = addEmoji(store.getEditorState(), emoji);

    if (!store.setEditorState) {
      throw new Error('Emoji-mart plugin: handle emoji fired on unbinded instace.');
    }

    store.setEditorState(newEditorState);
  };

  const PickerComponent = React.forwardRef<Picker, PickerComponentProps>((props, ref) => (
    <Picker
      ref={ref}
      set={set}
      data={data}
      sheetSize={sheetSize}
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
    modifiers: {
      addEmoji,
    },
    decorators,
    initialize: ({ getEditorState, setEditorState }: Store) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },
    willUnmount: () => {
      store.getEditorState = undefined;
      store.setEditorState = undefined;
    },
    onChange: (editorState: EditorState) => {
      let newEditorState = attachImmutableEntitiesToEmojis(editorState);
      const selection = editorState.getSelection();

      if (!newEditorState.getCurrentContent().equals(editorState.getCurrentContent())) {
        // Forcing the current selection ensures that it will be at it's right place.
        // This solves the issue where inserting an Emoji on OSX with Apple's Emoji
        // selector led to the right selection the data, but wrong position in
        // the contenteditable.
        newEditorState = EditorState.forceSelection(
          newEditorState,
          selection,
        );
      }

      if (onChange) {
        return onChange(newEditorState);
      }

      return newEditorState;
    },
  };
}

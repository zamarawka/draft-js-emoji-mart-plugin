// @flow

// Original: https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-emoji-plugin/src/modifiers/attachImmutableEntitiesToEmojis.js
import { EditorState, Modifier, SelectionState } from 'draft-js';
import findWithRegex from 'find-with-regex';

import { unicodeEmojiRegexp } from '../constants';

/*
 * Attaches Immutable DraftJS Entities to the Emoji text.
 *
 * This is necessary as emojis consist of 2 characters (unicode). By making them
 * immutable the whole Emoji is removed when hitting backspace.
 */
export default function attachImmutableEntitiesToEmojis(editorState: EditorState): EditorState {
  const contentState = editorState.getCurrentContent();
  const blocks = contentState.getBlockMap();
  let newContentState = contentState;

  blocks.forEach((block) => {
    const plainText = block.getText();

    const addEntityToEmoji = (start, end) => {
      const existingEntityKey = block.getEntityAt(start);
      if (existingEntityKey) {
        // avoid manipulation in case the emoji already has an entity
        const entity = newContentState.getEntity(existingEntityKey);
        if (entity && entity.get('type') === 'emoji') {
          return;
        }
      }

      const selection = SelectionState.createEmpty(block.getKey())
        .set('anchorOffset', start)
        .set('focusOffset', end);
      const emojiText = plainText.substring(start, end);
      const contentStateWithEntity = newContentState.createEntity(
        // $FlowFixMe
        'emoji',
        'IMMUTABLE',
        { emojiUnicode: emojiText },
      );

      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      newContentState = Modifier.replaceText(
        newContentState,
        selection,
        emojiText,
        null,
        entityKey,
      );
    };

    findWithRegex(unicodeEmojiRegexp, block, addEntityToEmoji);
  });

  if (!newContentState.equals(contentState)) {
    return EditorState.push(
      editorState,
      newContentState,
      // $FlowFixMe
      'convert-to-immutable-emojis',
    );
  }

  return editorState;
}

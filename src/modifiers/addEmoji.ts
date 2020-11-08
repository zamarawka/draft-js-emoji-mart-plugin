// Original: https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-emoji-plugin/src/modifiers/addEmoji.js
import { Modifier, EditorState } from 'draft-js';

// This modifier can inserted emoji to current cursor position (with replace selected fragment),
// or replaced emoji shortname like ":thumbsup:". Behavior determined by `Mode` parameter.
export const Mode = {
  INSERT: 'INSERT', // insert emoji to current cursor position
  REPLACE: 'REPLACE', // replace emoji shortname
};

export default function addEmoji(
  editorState: EditorState,
  emoji: string,
  mode: string = Mode.INSERT,
): EditorState {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState
    .createEntity('emoji', 'IMMUTABLE', { emojiUnicode: emoji });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const currentSelectionState = editorState.getSelection();

  let emojiAddedContent;

  switch (mode) {
    case Mode.INSERT: {
      // in case text is selected it is removed and then the emoji is added
      const afterRemovalContentState = Modifier.removeRange(
        contentState,
        currentSelectionState,
        'backward',
      );

      // deciding on the position to insert emoji
      const targetSelection = afterRemovalContentState.getSelectionAfter();

      emojiAddedContent = Modifier.insertText(
        afterRemovalContentState,
        targetSelection,
        emoji,
        undefined,
        entityKey,
      );

      break;
    }

    default:
      throw new Error('Unidentified value of "mode"');
  }

  const newEditorState = EditorState.push(
    editorState,
    emojiAddedContent,
    'insert-fragment',
  );

  return EditorState.forceSelection(
    newEditorState,
    emojiAddedContent.getSelectionAfter()
  );
}

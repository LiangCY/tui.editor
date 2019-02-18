import mermaid from 'mermaid';

import Editor from './editorProxy';

const {codeBlockManager} = Editor;
const MERMAID_LANGUAGES = ['mermaid'];

/**
 * mermaid plugin
 * @param {Editor} editor - editor
 */
function mermaidExtension(editor) {
  /**
   * render html from mermaid
   * @param {string} mermaidCode - mermaid code text
   * @returns {string} - rendered html
   */
  function mermaidReplacer(mermaidCode) {
    let renderedHTML;

    try {
      mermaid.parse(mermaidCode);
      renderedHTML = `<div class="mermaid">${mermaidCode}</div>`;
    } catch (err) {
      renderedHTML = 'not valid';
    }

    return renderedHTML;
  }

  editor.on('previewRenderAfter', () => {
    mermaid.init();
  });

  const {codeBlockLanguages} = editor.options;

  MERMAID_LANGUAGES.forEach(language => {
    if (codeBlockLanguages.indexOf(language) < 0) {
      codeBlockLanguages.push(language);
    }
    codeBlockManager.setReplacer(language, mermaidReplacer);
  });
}

Editor.defineExtension('mermaid', mermaidExtension);

export default mermaidExtension;

import sequenceDiagram from 'js-sequence-diagrams';

import Editor from './editorProxy';

const {codeBlockManager} = Editor;
const SEQUENCE_LANGUAGES = ['sequence'];

/**
 * sequence plugin
 * @param {Editor} editor - editor
 */
function sequenceExtension(editor) {
  let container = document.querySelector('#tui-sequence-container');
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', 'tui-sequence-container');
    container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;';
    document.body.appendChild(container);
  }

  /**
   * render html from sequence diagrams
   * @param {string} code - sequence code text
   * @returns {string} - rendered html
   */
  function sequenceReplacer(code) {
    let renderedHTML = code;
    try {
      const diagram = sequenceDiagram.parse(code);
      diagram.drawSVG(container, {theme: 'simple'});
      renderedHTML = `<div class="sequence">${container.firstChild.outerHTML}</div>`;
      if (container.children.length >= 2) {
        container.removeChild(container.firstChild);
      }
    } catch (err) {
      renderedHTML = 'invalid code';
    }

    return renderedHTML;
  }

  const {codeBlockLanguages} = editor.options;

  SEQUENCE_LANGUAGES.forEach(language => {
    if (codeBlockLanguages.indexOf(language) < 0) {
      codeBlockLanguages.push(language);
    }
    codeBlockManager.setReplacer(language, sequenceReplacer);
  });
}

Editor.defineExtension('sequence', sequenceExtension);

export default sequenceExtension;

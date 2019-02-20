import flowchart from 'flowchart.js';

import Editor from './editorProxy';

const {codeBlockManager} = Editor;
const FLOWCHART_LANGUAGES = ['flow'];

/**
 * flowchart plugin
 * @param {Editor} editor - editor
 */
function flowchartExtension(editor) {
  let container = document.querySelector('#tui-flowchart-container');
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', 'tui-flowchart-container');
    container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;';
    document.body.appendChild(container);
  }

  /**
   * render html from flowchart
   * @param {string} code - flowchart code text
   * @returns {string} - rendered html
   */
  function flowchartReplacer(code) {
    let renderedHTML = code;
    try {
      const diagram = flowchart.parse(code);
      diagram.drawSVG(container);
      renderedHTML = `<div class="flowchart">${container.firstChild.outerHTML}</div>`;
      if (container.children.length >= 2) {
        container.removeChild(container.firstChild);
      }
    } catch (err) {
      renderedHTML = 'invalid code';
    }

    // const randomId = `flowchart-${Math.random().toString(36).substr(2, 10)}`;
    // let renderedHTML = `<div id="${randomId}" class="flowchart" />`;
    // setTimeout(() => {
    //   const chartContainer = document.querySelector(`#${randomId}`);
    //   try {
    //     const diagram = flowchart.parse(code);
    //     diagram.drawSVG(chartContainer);
    //   } catch (e) {
    //     chartContainer.innerHTML = 'invalid flowchart data';
    //   }
    // }, 0);

    return renderedHTML;
  }

  const {codeBlockLanguages} = editor.options;

  FLOWCHART_LANGUAGES.forEach(language => {
    if (codeBlockLanguages.indexOf(language) < 0) {
      codeBlockLanguages.push(language);
    }
    codeBlockManager.setReplacer(language, flowchartReplacer);
  });
}

Editor.defineExtension('flowchart', flowchartExtension);

export default flowchartExtension;

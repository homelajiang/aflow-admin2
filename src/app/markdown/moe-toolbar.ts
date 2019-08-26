import {MoeApp} from './moe-app';

let that;

export class MoeToolbar {

  bindings = {
    toggleBold: this.toggleBold,
    toggleItalic: this.toggleItalic,
    drawLink: this.drawLink,
    toggleHeadingSmaller: this.toggleHeadingSmaller,
    toggleHeadingBigger: this.toggleHeadingBigger,
    drawImage: this.drawImage,
    toggleBlockquote: this.toggleBlockquote,
    toggleOrderedList: this.toggleOrderedList,
    toggleUnorderedList: this.toggleUnorderedList,
    toggleCodeBlock: this.toggleCodeBlock,
    toggleEdit: this.toggleEdit(),
    togglePreview: this.togglePreview,
    toggleStrikethrough: this.toggleStrikethrough,
    toggleHeading1: this.toggleHeading1,
    toggleHeading2: this.toggleHeading2,
    toggleHeading3: this.toggleHeading3,
    cleanBlock: this.cleanBlock,
    drawTable: this.drawTable,
    drawHorizontalRule: this.drawHorizontalRule,
    undo: this.undo,
    redo: this.redo,
    toggleSideBySide: this.toggleSideBySide,
    toggleFullScreen: this.toggleFullScreen
  };

  toolbarBuiltInButtons = {
    bold: {
      name: 'bold',
      action: this.toggleBold,
      className: 'fa fa-bold',
      title: 'Bold',
      default: true
    },
    italic: {
      name: 'italic',
      action: this.toggleItalic,
      className: 'fa fa-italic',
      title: 'Italic',
      default: true
    },
    strikethrough: {
      name: 'strikethrough',
      action: this.toggleStrikethrough,
      className: 'fa fa-strikethrough',
      title: 'Strikethrough'
    },
    heading: {
      name: 'heading',
      action: this.toggleHeadingSmaller,
      className: 'fas fa-heading',
      title: 'Heading',
      default: true
    },
    'heading-smaller': {
      name: 'heading-smaller',
      action: this.toggleHeadingSmaller,
      className: 'fa fa-header fa-header-x fa-header-smaller',
      title: 'Smaller Heading'
    },
    'heading-bigger': {
      name: 'heading-bigger',
      action: this.toggleHeadingBigger,
      className: 'fa fa-header fa-header-x fa-header-bigger',
      title: 'Bigger Heading'
    },
    'heading-1': {
      name: 'heading-1',
      action: this.toggleHeading1,
      className: 'fa fa-header fa-header-x fa-header-1',
      title: 'Big Heading'
    },
    'heading-2': {
      name: 'heading-2',
      action: this.toggleHeading2,
      className: 'fa fa-header fa-header-x fa-header-2',
      title: 'Medium Heading'
    },
    'heading-3': {
      name: 'heading-3',
      action: this.toggleHeading3,
      className: 'fa fa-header fa-header-x fa-header-3',
      title: 'Small Heading'
    },
    'separator-1': {
      name: 'separator-1'
    },
    code: {
      name: 'code',
      action: this.toggleCodeBlock,
      className: 'fa fa-code',
      title: 'Code'
    },
    quote: {
      name: 'quote',
      action: this.toggleBlockquote,
      className: 'fa fa-quote-left',
      title: 'Quote',
      default: true
    },
    'unordered-list': {
      name: 'unordered-list',
      action: this.toggleUnorderedList,
      className: 'fa fa-list-ul',
      title: 'Generic List',
      default: true
    },
    'ordered-list': {
      name: 'ordered-list',
      action: this.toggleOrderedList,
      className: 'fa fa-list-ol',
      title: 'Numbered List',
      default: true
    },
    'clean-block': {
      name: 'clean-block',
      action: this.cleanBlock,
      className: 'fa fa-eraser fa-clean-block',
      title: 'Clean block'
    },
    'separator-2': {
      name: 'separator-2'
    },
    link: {
      name: 'link',
      action: this.drawLink,
      className: 'fa fa-link',
      title: 'Create Link',
      default: true
    },
    image: {
      name: 'image',
      action: this.drawImage,
      className: 'fas fa-image',
      title: 'Insert Image',
      default: true
    },
    table: {
      name: 'table',
      action: this.drawTable,
      className: 'fa fa-table',
      title: 'Insert Table'
    },
    'horizontal-rule': {
      name: 'horizontal-rule',
      action: this.drawHorizontalRule,
      className: 'fa fa-minus',
      title: 'Insert Horizontal Line'
    },
    'separator-3': {
      name: 'separator-3'
    },
    edit: {
      name: 'edit',
      action: this.toggleEdit,
      className: 'fa fa-file-alt',
      title: 'Toggle Edit',
      default: true
    },
    preview: {
      name: 'preview',
      action: this.togglePreview,
      className: 'fa fa-eye no-disable',
      title: 'Toggle Preview',
      default: true
    },
    'side-by-side': {
      name: 'side-by-side',
      action: this.toggleSideBySide,
      className: 'fa fa-columns no-disable no-mobile',
      title: 'Toggle Side by Side',
      default: true
    },
    fullscreen: {
      name: 'fullscreen',
      action: this.toggleFullScreen,
      className: 'fa fa-arrows-alt no-disable no-mobile',
      title: 'Toggle Fullscreen',
      default: true
    },
    'separator-4': {
      name: 'separator-4'
    },
    guide: {
      name: 'guide',
      action: 'https://simplemde.com/markdown-guide',
      className: 'fa fa-question-circle',
      title: 'Markdown Guide',
      default: true
    },
    'separator-5': {
      name: 'separator-5'
    },
    undo: {
      name: 'undo',
      action: this.undo,
      className: 'fa fa-undo no-disable',
      title: 'Undo'
    },
    redo: {
      name: 'redo',
      action: this.redo,
      className: 'fa fa-repeat no-disable',
      title: 'Redo'
    }
  };

  shortcuts = {
    toggleBold: 'Cmd-B',
    toggleItalic: 'Cmd-I',
    drawLink: 'Cmd-K',
    toggleHeadingSmaller: 'Cmd-H',
    toggleHeadingBigger: 'Shift-Cmd-H',
    cleanBlock: 'Cmd-E',
    drawImage: 'Cmd-Alt-I',
    toggleBlockquote: 'Cmd-\'',
    toggleOrderedList: 'Cmd-Alt-L',
    toggleUnorderedList: 'Cmd-L',
    toggleCodeBlock: 'Cmd-Alt-C',
    togglePreview: 'Cmd-P',
    toggleSideBySide: 'F9',
    toggleFullScreen: 'F11'
  };


  createToolbar(items) {
    that = this;
    if (!items || items.length === 0) {
      return;
    }

    const bar = document.createElement('div');
    bar.className = 'editor-toolbar';

    const toolbarData = {};

    for (let item of items) {

      // 匹配string类型菜单
      if (this.toolbarBuiltInButtons[item] !== undefined) {
        item = this.toolbarBuiltInButtons[item];
      }

      let el;
      if (item === '|') {
        el = this.createSep();
      } else {
        el = this.createIcon(item, true, this.shortcuts);
      }

      // bind events, special for info
      if (item.action) {
        if (typeof item.action === 'function') {
          el.onclick = (e) => {
            e.preventDefault();
            item.action(e);
          };
        } else if (typeof item.action === 'string') {
          el.href = item.action;
          el.target = '_blank';
        }
      }

      toolbarData[item.name || item] = el;
      bar.appendChild(el);
    }

    MoeApp.toolbarElements = toolbarData;

    // Will be fired when the cursor or selection moves, or any change is made to the editor content.
    MoeApp.editor.on('cursorActivity', () => {
      const stat = getState();

      for (const key in toolbarData) {
        const el = toolbarData[key];
        if (stat[key]) {
          el.className += ' active';
        } else if (key !== 'fullscreen' && key !== 'side-by-side' && key !== 'edit') {
          el.className = el.className.replace(/\s*active\s*/g, '');
        }
      }
    });
    const toolbar = document.getElementById('main-container');
    toolbar.parentNode.insertBefore(bar, toolbar);

    const keyMaps = {
      // 'Cmd-Y': 'deleteLine',
      // 'Shift-Enter': 'goLineEndnewlineAndIndent',
      Enter: 'newlineAndIndentContinueMarkdownList',
      Tab: 'tabAndIndentMarkdownList',
      'Shift-Tab': 'shiftTabAndUnindentMarkdownList',
      // Esc: undefined,
    };

    const defaultKeyMaps = {
      Enter: 'newlineAndIndentContinueMarkdownList',
      Home: 'goLineLeft',
      End: 'goLineRight',
      'Shift-Tab': 'indentLess',
    };

    // Enter: 'newlineAndIndentContinueMarkdownList',
    // Tab: 'tabAndIndentMarkdownList',
    // 'Shift-Tab': 'shiftTabAndUnindentMarkdownList',
    // 'Cmd-Y': 'deleteLine',
    // 'Shift-Enter': 'goLineEndnewlineAndIndent',

    // 注册快捷键
    for (const key in defaultKeyMaps) {
      if (defaultKeyMaps[key]) {
        keyMaps[this.fixShortcut(key)] = defaultKeyMaps[key];
      }
    }

    for (const key in this.shortcuts) {
      if (this.shortcuts[key] !== null && this.bindings[key] != null) {
        keyMaps[this.fixShortcut(this.shortcuts[key])] = () => {
          that.bindings[key]();
        };
      }
    }

    // 键位自定义
    // keyMaps.Esc = (cm) => {
    //   if (cm.getOption('fullScreen')) {
    //     this.toggleFullScreen();
    //   }
    // };

    MoeApp.editor.setOption('extraKeys', keyMaps);

    return bar;
  }

  private createIcon(options: any, enableTooltips, shortcuts) {
    options = options || {};
    const el = document.createElement('a');
    enableTooltips = enableTooltips === undefined ? true : enableTooltips;

    if (options.title && enableTooltips) {
      el.title = this.createTootlip(options.title, options.action, shortcuts);

      if (this.isMac()) {
        el.title = el.title.replace('Ctrl', '⌘');
        el.title = el.title.replace('Alt', '⌥');
      }
    }

    el.tabIndex = -1;
    el.className = options.className;
    return el;
  }

  private createSep() {
    const el = document.createElement('i');
    el.className = 'separator';
    el.innerHTML = '|';
    return el;
  }


  private createTootlip(title: string, action: any, shortcuts: any) {
    let tooltip = title;
    if (action) {
      const actionName = this.getBindingName(action);
      if (shortcuts[actionName]) {
        tooltip += '(' + this.fixShortcut(shortcuts[actionName]) + ')';
      }
    }
    return tooltip;
  }


  private getBindingName(f): string {
    for (const key in this.bindings) {
      if (this.bindings[key] === f) {
        return key;
      }
    }
    return null;
  }


  private fixShortcut(name) {
    if (this.isMac()) {
      name = name.replace('Ctrl', 'Cmd');
    } else {
      name = name.replace('Cmd', 'Ctrl');
    }
    return name;
  }


  private isMac() {
    return /Mac/.test(navigator.platform);
  }

  /**
   * Action for toggling bold.
   */
  private toggleBold() {
    _toggleBlock('bold', MoeApp.options.blockStyles.bold);
  }


  /**
   * Action for toggling italic.
   */
  private toggleItalic() {
    _toggleBlock('italic', MoeApp.options.blockStyles.italic);
  }


  /**
   * Action for toggling strikethrough.
   */
  private toggleStrikethrough() {
    _toggleBlock('strikethrough', '~~');
  }

  /**
   * Action for toggling code block.
   */
  private toggleCodeBlock() {
    const fenceCharsToInsert = MoeApp.options.blockStyles.code;

    const cm = MoeApp.editor;
    const curStart = cm.getCursor('start');
    const curEnd = cm.getCursor('end');
    const tok = cm.getTokenAt({
      line: curStart.line,
      ch: curStart.ch || 1
    }); // avoid ch 0 which is a cursor pos but not token
    let line = cm.getLineHandle(curStart.line);
    const isCode = code_type(cm, curStart.line, line, tok);
    let blockStart;
    let blockEnd;
    let lineCount;

    if (isCode === 'single') {
      // similar to some SimpleMDE _toggleBlock logic
      const start = line.text.slice(0, curStart.ch).replace('`', '');
      const end = line.text.slice(curStart.ch).replace('`', '');
      cm.replaceRange(start + end, {
        line: curStart.line,
        ch: 0
      }, {
        line: curStart.line,
        ch: 99999999999999
      });
      curStart.ch--;
      if (curStart !== curEnd) {
        curEnd.ch--;
      }
      cm.setSelection(curStart, curEnd);
      cm.focus();
    } else if (isCode === 'fenced') {
      if (curStart.line !== curEnd.line || curStart.ch !== curEnd.ch) {
        // use selection

        // find the fenced line so we know what type it is (tilde, backticks, number of them)
        for (blockStart = curStart.line; blockStart >= 0; blockStart--) {
          line = cm.getLineHandle(blockStart);
          if (fencing_line(line)) {
            break;
          }
        }
        const fencedTok = cm.getTokenAt({
          line: blockStart,
          ch: 1
        });
        const fenceChars = token_state(fencedTok).fencedChars;
        let startText;
        let startLine;
        let endText;
        let endLine;
        // check for selection going up against fenced lines, in which case we don't want to add more fencing
        if (fencing_line(cm.getLineHandle(curStart.line))) {
          startText = '';
          startLine = curStart.line;
        } else if (fencing_line(cm.getLineHandle(curStart.line - 1))) {
          startText = '';
          startLine = curStart.line - 1;
        } else {
          startText = fenceChars + '\n';
          startLine = curStart.line;
        }
        if (fencing_line(cm.getLineHandle(curEnd.line))) {
          endText = '';
          endLine = curEnd.line;
          if (curEnd.ch === 0) {
            endLine += 1;
          }
        } else if (curEnd.ch !== 0 && fencing_line(cm.getLineHandle(curEnd.line + 1))) {
          endText = '';
          endLine = curEnd.line + 1;
        } else {
          endText = fenceChars + '\n';
          endLine = curEnd.line + 1;
        }
        if (curEnd.ch === 0) {
          // full last line selected, putting cursor at beginning of next
          endLine -= 1;
        }
        cm.operation(() => {
          // end line first, so that line numbers don't change
          cm.replaceRange(endText, {
            line: endLine,
            ch: 0
          }, {
            line: endLine + (endText ? 0 : 1),
            ch: 0
          });
          cm.replaceRange(startText, {
            line: startLine,
            ch: 0
          }, {
            line: startLine + (startText ? 0 : 1),
            ch: 0
          });
        });
        cm.setSelection({
          line: startLine + (startText ? 1 : 0),
          ch: 0
        }, {
          line: endLine + (startText ? 1 : -1),
          ch: 0
        });
        cm.focus();
      } else {
        // no selection, search for ends of this fenced block
        let searchFrom = curStart.line;
        if (fencing_line(cm.getLineHandle(curStart.line))) { // gets a little tricky if cursor is right on a fenced line
          if (code_type(cm, curStart.line + 1) === 'fenced') {
            blockStart = curStart.line;
            searchFrom = curStart.line + 1; // for searching for "end"
          } else {
            blockEnd = curStart.line;
            searchFrom = curStart.line - 1; // for searching for "start"
          }
        }
        if (blockStart === undefined) {
          for (blockStart = searchFrom; blockStart >= 0; blockStart--) {
            line = cm.getLineHandle(blockStart);
            if (fencing_line(line)) {
              break;
            }
          }
        }
        if (blockEnd === undefined) {
          lineCount = cm.lineCount();
          for (blockEnd = searchFrom; blockEnd < lineCount; blockEnd++) {
            line = cm.getLineHandle(blockEnd);
            if (fencing_line(line)) {
              break;
            }
          }
        }
        cm.operation(() => {
          cm.replaceRange('', {
            line: blockStart,
            ch: 0
          }, {
            line: blockStart + 1,
            ch: 0
          });
          cm.replaceRange('', {
            line: blockEnd - 1,
            ch: 0
          }, {
            line: blockEnd,
            ch: 0
          });
        });
        cm.focus();
      }
    } else if (isCode === 'indented') {
      if (curStart.line !== curEnd.line || curStart.ch !== curEnd.ch) {
        // use selection
        blockStart = curStart.line;
        blockEnd = curEnd.line;
        if (curEnd.ch === 0) {
          blockEnd--;
        }
      } else {
        // no selection, search for ends of this indented block
        for (blockStart = curStart.line; blockStart >= 0; blockStart--) {
          line = cm.getLineHandle(blockStart);
          if (line.text.match(/^\s*$/)) {
            // empty or all whitespace - keep going
            continue;
          } else {
            if (code_type(cm, blockStart, line) !== 'indented') {
              blockStart += 1;
              break;
            }
          }
        }
        lineCount = cm.lineCount();
        for (blockEnd = curStart.line; blockEnd < lineCount; blockEnd++) {
          line = cm.getLineHandle(blockEnd);
          if (line.text.match(/^\s*$/)) {
            // empty or all whitespace - keep going
            continue;
          } else {
            if (code_type(cm, blockEnd, line) !== 'indented') {
              blockEnd -= 1;
              break;
            }
          }
        }
      }
      // if we are going to un-indent based on a selected set of lines, and the next line is indented too, we need to
      // insert a blank line so that the next line(s) continue to be indented code
      const nextLine = cm.getLineHandle(blockEnd + 1);
      const nextLineLastTok = nextLine && cm.getTokenAt({
        line: blockEnd + 1,
        ch: nextLine.text.length - 1
      });
      const nextLineIndented = nextLineLastTok && token_state(nextLineLastTok).indentedCode;
      if (nextLineIndented) {
        cm.replaceRange('\n', {
          line: blockEnd + 1,
          ch: 0
        });
      }

      for (let i = blockStart; i <= blockEnd; i++) {
        cm.indentLine(i, 'subtract'); // TODO: this doesn't get tracked in the history, so can't be undone :(
      }
      cm.focus();
    } else {
      // insert code formatting
      const noSelAndStartingOfLine = (curStart.line === curEnd.line && curStart.ch === curEnd.ch && curStart.ch === 0);
      const selMulti = curStart.line !== curEnd.line;
      if (noSelAndStartingOfLine || selMulti) {
        insertFencingAtSelection(cm, curStart, curEnd, fenceCharsToInsert);
      } else {
        _replaceSelection(false, ['`', '`']);
      }
    }
  }

  /**
   * Action for toggling blockquote.
   */
  private toggleBlockquote() {
    _toggleLine('quote');
  }

  /**
   * Action for toggling heading size: normal -> h1 -> h2 -> h3 -> h4 -> h5 -> h6 -> normal
   */
  private toggleHeadingSmaller() {
    _toggleHeading('smaller');
  }

  /**
   * Action for toggling heading size: normal -> h6 -> h5 -> h4 -> h3 -> h2 -> h1 -> normal
   */
  private toggleHeadingBigger() {
    _toggleHeading('bigger');
  }

  /**
   * Action for toggling heading size 1
   */
  private toggleHeading1() {
    _toggleHeading(undefined, 1);
  }

  /**
   * Action for toggling heading size 2
   */
  private toggleHeading2() {
    _toggleHeading(undefined, 2);
  }

  /**
   * Action for toggling heading size 3
   */
  private toggleHeading3() {
    _toggleHeading(undefined, 3);
  }


  /**
   * Action for toggling ul.
   */
  private toggleUnorderedList() {
    _toggleLine('unordered-list');
  }


  /**
   * Action for toggling ol.
   */
  private toggleOrderedList() {
    _toggleLine('ordered-list');
  }

  /**
   * Action for clean block (remove headline, list, blockquote code, markers)
   */
  private cleanBlock() {
    _cleanBlock();
  }

  /**
   * Action for drawing a link.
   */
  private drawLink() {
    const stat = getState();
    const url = 'http://';
    _replaceSelection(stat.link, MoeApp.options.insertTexts.link, url);
  }

  /**
   * Action for drawing an img.
   */
  private drawImage() {
    const stat = getState();
    const url = 'http://';
    _replaceSelection(stat.image, MoeApp.options.insertTexts.image, url);
  }

  /**
   * Action for drawing a table.
   */
  private drawTable() {
    const stat = getState();
    _replaceSelection(stat.table, MoeApp.options.insertTexts.table);
  }

  /**
   * Action for drawing a horizontal rule.
   */
  private drawHorizontalRule() {
    const stat = getState();
    _replaceSelection(stat.image, MoeApp.options.insertTexts.horizontalRule);
  }


  /**
   * Undo action.
   */
  private undo() {
    MoeApp.editor.undo();
    MoeApp.editor.focus();
  }


  /**
   * Redo action.
   */
  private redo() {
    MoeApp.editor.redo();
    MoeApp.editor.focus();
  }


  /**
   * Toggle full screen of the editor.
   */
  private toggleFullScreen() {
    // Set fullscreen
    MoeApp.editor.setOption('fullScreen', !MoeApp.editor.getOption('fullScreen'));


    // Prevent scrolling on body during fullscreen active
    if (MoeApp.editor.getOption('fullScreen')) {
      document.querySelector('#md-main')
        .classList.add('editor-fullscreen');

      document.querySelector('.editor-toolbar')
        .classList.add('fullscreen');

      document.querySelector('mat-sidenav')
        .setAttribute('style', 'visibility: hidden;transform: none;');

      MoeApp.moeMode.setMode('preview');

    } else {
      document.querySelector('#md-main')
        .classList.remove('editor-fullscreen');

      document.querySelector('.editor-toolbar')
        .classList.remove('fullscreen');

      document.querySelector('mat-sidenav')
        .setAttribute('style', 'visibility: visible;transform: none;');

      MoeApp.moeMode.setMode('write-wide');
    }

    const toolbarButton = MoeApp.toolbarElements.fullscreen;

    if (!/active/.test(toolbarButton.className)) {
      toolbarButton.className += ' active';
    } else {
      toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, '');
    }
  }


  /**
   * Toggle side by side preview
   */
  private toggleSideBySide() {
    if (MoeApp.config['edit-mode'] === 'preview') {
      return;
    }

    if (MoeApp.editor.getOption('fullScreen')) { // fullScreen
      // set Preview
      MoeApp.moeMode.setMode('preview');
    } else {
      // set fullScreen、Preview
      setFullScreen('preview');
    }
  }

  /**
   * Edit action
   */
  private toggleEdit() {
    const mode = MoeApp.config['edit-mode'];

    if (mode === 'write-wide' || mode === 'write-medium' || mode === 'write-narrow') {
      return;
    }

    if (MoeApp.editor.getOption('fullScreen')) { // fullScreen
      // set Preview
      MoeApp.moeMode.setMode('write-wide');
    } else {
      // set fullScreen、Preview
      setFullScreen('write-wide');
    }

  }


  /**
   * Preview action.
   */
  private togglePreview() {
    const mode = MoeApp.config['edit-mode'];

    if (mode === 'read-wide' || mode === 'read-medium' || mode === 'read-narrow') {
      return;
    }

    if (MoeApp.editor.getOption('fullScreen')) { // fullScreen
      // set Preview
      MoeApp.moeMode.setMode('read-wide');
    } else {
      // set fullScreen、Preview
      setFullScreen('read-wide');
    }
  }

}

/**
 * Toggle full screen of the editor.
 */
function setFullScreen(mode: string) {
  // Set fullscreen
  MoeApp.editor.setOption('fullScreen', true);


  // Prevent scrolling on body during fullscreen active
  document.querySelector('#md-main')
    .classList.add('editor-fullscreen');

  document.querySelector('.editor-toolbar')
    .classList.add('fullscreen');

  document.querySelector('mat-sidenav')
    .setAttribute('style', 'visibility: hidden;transform: none;');

  MoeApp.moeMode.setMode(mode);

  const toolbarButton = MoeApp.toolbarElements.fullscreen;

  if (!/active/.test(toolbarButton.className)) {
    toolbarButton.className += ' active';
  } else {
    toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, '');
  }

}

function fencing_line(line) {
  /* return true, if this is a ``` or ~~~ line */
  if (typeof line !== 'object') {
    throw new Error('fencing_line() takes a \'line\' object (not a line number, or line text).  Got: ' + typeof line + ': ' + line);
  }
  return line.styles && line.styles[2] && line.styles[2].indexOf('formatting-code-block') !== -1;
}

function token_state(token) {
  // base goes an extra level deep when mode backdrops are used, e.g. spellchecker on
  return token.state.base.base || token.state.base;
}

function code_type(cm, lineNum, line?, firstTok?, lastTok?) {
  /*
   * Return "single", "indented", "fenced" or false
   *
   * cm and line_num are required.  Others are optional for efficiency
   *   To check in the middle of a line, pass in firstTok yourself.
   */
  line = line || cm.getLineHandle(lineNum);
  firstTok = firstTok || cm.getTokenAt({
    line: lineNum,
    ch: 1
  });
  lastTok = lastTok || (!!line.text && cm.getTokenAt({
    line: lineNum,
    ch: line.text.length - 1
  }));
  const types = firstTok.type ? firstTok.type.split(' ') : [];
  if (lastTok && token_state(lastTok).indentedCode) {
    // have to check last char, since first chars of first line aren"t marked as indented
    return 'indented';
  } else if (types.indexOf('comment') === -1) {
    // has to be after "indented" check, since first chars of first indented line aren"t marked as such
    return false;
  } else if (token_state(firstTok).fencedChars || token_state(lastTok).fencedChars || fencing_line(line)) {
    return 'fenced';
  } else {
    return 'single';
  }
}

function insertFencingAtSelection(cm, curStart, curEnd, fenceCharsToInsert) {
  const startLineSel = curStart.line + 1;
  let endLineSel = curEnd.line + 1;
  const selMulti = curStart.line !== curEnd.line;
  const replStart = fenceCharsToInsert + '\n';
  let replEnd = '\n' + fenceCharsToInsert;
  if (selMulti) {
    endLineSel++;
  }
  // handle last char including \n or not
  if (selMulti && curEnd.ch === 0) {
    replEnd = fenceCharsToInsert + '\n';
    endLineSel--;
  }
  _replaceSelection(false, [replStart, replEnd]);
  cm.setSelection({
    line: startLineSel,
    ch: 0
  }, {
    line: endLineSel,
    ch: 0
  });
}

/**
 * The state of CodeMirror at the given position.
 */
function getState(pos?): RetState {
  pos = MoeApp.editor.getCursor('start') || pos;
  const stat = MoeApp.editor.getTokenAt(pos);
  if (!stat.type) {
    return new RetState();
  }

  const types = stat.type.split(' ');

  const ret = new RetState();
  let text;
  for (const data of types) {
    if (data === 'strong') {
      ret.bold = true;
    } else if (data === 'variable-2') {
      text = MoeApp.editor.getLine(pos.line);
      if (/^\s*\d+\.\s/.test(text)) {
        ret['ordered-list'] = true;
      } else {
        ret['unordered-list'] = true;
      }
    } else if (data === 'atom') {
      ret.quote = true;
    } else if (data === 'em') {
      ret.italic = true;
    } else if (data === 'quote') {
      ret.quote = true;
    } else if (data === 'strikethrough') {
      ret.strikethrough = true;
    } else if (data === 'comment') {
      ret.code = true;
    } else if (data === 'link') {
      ret.link = true;
    } else if (data === 'tag') {
      ret.image = true;
    } else if (data.match(/^header(\\-[1-6])?$/)) {
      ret[data.replace('header', 'heading')] = true;
    }
  }
  return ret;
}


function _replaceSelection(active, startEnd, url?) {
  const cm = MoeApp.editor;
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className)) {
    return;
  }

  let text;
  let start = startEnd[0];
  let end = startEnd[1];
  const startPoint = cm.getCursor('start');
  const endPoint = cm.getCursor('end');
  if (url) {
    end = end.replace('#url#', url);
  }
  if (active) {
    text = cm.getLine(startPoint.line);
    start = text.slice(0, startPoint.ch);
    end = text.slice(startPoint.ch);
    cm.replaceRange(start + end, {
      line: startPoint.line,
      ch: 0
    });
  } else {
    text = cm.getSelection();
    cm.replaceSelection(start + text + end);

    startPoint.ch += start.length;
    if (startPoint !== endPoint) {
      endPoint.ch += start.length;
    }
  }
  cm.setSelection(startPoint, endPoint);
  cm.focus();
}


function _toggleHeading(direction, size?) {
  if (/editor-preview-active/.test(MoeApp.editor.getWrapperElement().lastChild.className)) {
    return;
  }

  const startPoint = MoeApp.editor.getCursor('start');
  const endPoint = MoeApp.editor.getCursor('end');
  for (let i = startPoint.line; i <= endPoint.line; i++) {
    let text = MoeApp.editor.getLine(i);
    const currHeadingLevel = text.search(/[^#]/);

    if (direction !== undefined) {
      if (currHeadingLevel <= 0) {
        if (direction === 'bigger') {
          text = '###### ' + text;
        } else {
          text = '# ' + text;
        }
      } else if (currHeadingLevel === 6 && direction === 'smaller') {
        text = text.substr(7);
      } else if (currHeadingLevel === 1 && direction === 'bigger') {
        text = text.substr(2);
      } else {
        if (direction === 'bigger') {
          text = text.substr(1);
        } else {
          text = '#' + text;
        }
      }
    } else {
      if (size === 1) {
        if (currHeadingLevel <= 0) {
          text = '# ' + text;
        } else if (currHeadingLevel === size) {
          text = text.substr(currHeadingLevel + 1);
        } else {
          text = '# ' + text.substr(currHeadingLevel + 1);
        }
      } else if (size === 2) {
        if (currHeadingLevel <= 0) {
          text = '## ' + text;
        } else if (currHeadingLevel === size) {
          text = text.substr(currHeadingLevel + 1);
        } else {
          text = '## ' + text.substr(currHeadingLevel + 1);
        }
      } else {
        if (currHeadingLevel <= 0) {
          text = '### ' + text;
        } else if (currHeadingLevel === size) {
          text = text.substr(currHeadingLevel + 1);
        } else {
          text = '### ' + text.substr(currHeadingLevel + 1);
        }
      }
    }

    MoeApp.editor.replaceRange(text, {
      line: i,
      ch: 0
    }, {
      line: i,
      ch: 99999999999999
    });
  }
  MoeApp.editor.focus();
}


function _toggleLine(name) {
  if (/editor-preview-active/.test(MoeApp.editor.getWrapperElement().lastChild.className)) {
    return;
  }

  const stat = getState();
  const startPoint = MoeApp.editor.getCursor('start');
  const endPoint = MoeApp.editor.getCursor('end');
  const repl = {
    quote: /^(\s*)\>\s+/,
    'unordered-list': /^(\s*)(\*|\-|\+)\s+/,
    'ordered-list': /^(\s*)\d+\.\s+/
  };
  const map = {
    quote: '> ',
    'unordered-list': '* ',
    'ordered-list': '1. '
  };
  for (let i = startPoint.line; i <= endPoint.line; i++) {
    let text = MoeApp.editor.getLine(i);
    if (stat[name]) {
      text = text.replace(repl[name], '$1');
    } else {
      text = map[name] + text;
    }
    MoeApp.editor.replaceRange(text, {
      line: i,
      ch: 0
    }, {
      line: i,
      ch: 99999999999999
    });
  }
  MoeApp.editor.focus();
}

function _toggleBlock(type, startChars, endChars?) {
  if (/editor-preview-active/.test(MoeApp.editor.getWrapperElement().lastChild.className)) {
    return;
  }

  endChars = (typeof endChars === 'undefined') ? startChars : endChars;
  const cm = MoeApp.editor;
  const stat = getState();

  let text;
  let start = startChars;
  let end = endChars;

  const startPoint = cm.getCursor('start');
  const endPoint = cm.getCursor('end');

  if (stat[type]) {
    text = cm.getLine(startPoint.line);
    start = text.slice(0, startPoint.ch);
    end = text.slice(startPoint.ch);
    if (type === 'bold') {
      start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, '');
      end = end.replace(/(\*\*|__)/, '');
    } else if (type === 'italic') {
      start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, '');
      end = end.replace(/(\*|_)/, '');
    } else if (type === 'strikethrough') {
      start = start.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, '');
      end = end.replace(/(\*\*|~~)/, '');
    }
    cm.replaceRange(start + end, {
      line: startPoint.line,
      ch: 0
    }, {
      line: startPoint.line,
      ch: 99999999999999
    });

    if (type === 'bold' || type === 'strikethrough') {
      startPoint.ch -= 2;
      if (startPoint !== endPoint) {
        endPoint.ch -= 2;
      }
    } else if (type === 'italic') {
      startPoint.ch -= 1;
      if (startPoint !== endPoint) {
        endPoint.ch -= 1;
      }
    }
  } else {
    text = cm.getSelection();
    if (type === 'bold') {
      text = text.split('**').join('');
      text = text.split('__').join('');
    } else if (type === 'italic') {
      text = text.split('*').join('');
      text = text.split('_').join('');
    } else if (type === 'strikethrough') {
      text = text.split('~~').join('');
    }
    cm.replaceSelection(start + text + end);

    startPoint.ch += startChars.length;
    endPoint.ch = startPoint.ch + text.length;
  }

  cm.setSelection(startPoint, endPoint);
  cm.focus();
}

function _cleanBlock() {
  const cm = MoeApp.editor;
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className)) {
    return;
  }

  const startPoint = cm.getCursor('start');
  const endPoint = cm.getCursor('end');
  let text;

  for (let line = startPoint.line; line <= endPoint.line; line++) {
    text = cm.getLine(line);
    text = text.replace(/^[ ]*([# ]+|\*|\-|[> ]+|[0-9]+(.|\)))[ ]*/, '');

    cm.replaceRange(text, {
      line,
      ch: 0
    }, {
      line,
      ch: 99999999999999
    });
  }
}


export class RetState {
  bold: boolean;
  quote: boolean;
  italic: boolean;
  strikethrough: boolean;
  code: boolean;
  link: boolean;
  image: boolean;
  table: boolean;
}


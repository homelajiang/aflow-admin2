import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import CodeMirror from 'codemirror';
import MoeMark from 'moemark';
import { MoeditorMathRender } from './moe-math';

import { MoeditorHighlight } from './moe-highlight';
import { MoeditorUMLRenderer } from './moe-uml';
import { SVGFixer } from './svgfixer';
import { MoeApp } from './moe-app';

import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/addon/mode/simple';
import 'codemirror/mode/css/css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/haml/haml';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/php/php';
import 'codemirror/mode/python/python';
import 'codemirror/mode/powershell/powershell';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/slim/slim';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/stex/stex';
import 'codemirror/mode/textile/textile';
import 'codemirror/mode/verilog/verilog';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/xquery/xquery';
import 'codemirror/mode/rust/rust';
import 'codemirror/mode/mscgen/mscgen';
import 'codemirror/mode/dylan/dylan';
import 'codemirror/mode/meta';
import 'codemirror/addon/mode/overlay';
import 'codemirror/addon/mode/multiplex';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/display/placeholder';
import { MoeScroll } from './moe-scroll';
import { MoeMode } from './moe-mode';
import * as Toolbar from './moe-toolbar';
import { MoeToolbar } from './moe-toolbar';

MoeMark.setOptions({
  math: true,
  lineNumber: true,
  breaks: false,
  highlight: MoeditorHighlight,
  umlchart: true,
  umlRenderer: MoeditorUMLRenderer
});

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css']
})
export class MarkdownComponent implements OnInit, AfterViewInit {

  // md content change event
  @Output() change = new EventEmitter();

  // md options
  @Input() options: any = new Object();

  private editor: CodeMirror.EditorFromTextArea;
  private scroller: MoeScroll;

  wordCount = 0;
  lineCount = 0;
  cursorPos = '0:0';

  updatePreviewing = false;
  updatePreviewRunning = false;

  preTemp = {
    content: '',
    changed: false,
    document_edited: false,
    directory: ''
  };
  private moeMode: MoeMode;


  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    MoeApp.moeMd = this;

    // 使布局不可滚动
    // document.querySelector('#sidenav-content').setAttribute('style', 'overflow-y: hidden');

    this.codeMirrorInit();
    this.scroller = new MoeScroll();
    this.moeMode = new MoeMode();
    MoeApp.moeMode = this.moeMode;
    const toolbar = new MoeToolbar();

    toolbar.createToolbar(this.options.toolbar || MoeApp.toolbar);
  }

  /**
   * 获取markdown value
   */
  getValue(): string {
    return this.editor.getValue();
  }

  /**
   * 设置markdown value
   */
  setValue(value: string) {
    this.editor.setValue(value);
  }

  /**
   * 插入图片
   * @param src 图片路径
   */
  insertImage(src: string) {
    Toolbar._replaceSelection(false, ['![', '](#url#)'], src);
  }


  private codeMirrorInit() {
    const textarea = document.querySelector('#editor textarea');
    this.editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: false,
      mode: 'gfm',
      matchBrackets: true,
      theme: MoeApp.config['editor-theme'],
      lineWrapping: true,
      extraKeys: {},
      tabSize: 4,
      // tabSize: moeApp.config.get('tab-size'),
      indentUnit: 4,
      // indentUnit: moeApp.config.get('tab-size'),
      viewportMargin: Infinity,
      styleActiveLine: true,
      showCursorWhenSelecting: true,
      placeholder: this.options.placeholder || textarea.getAttribute('placeholder') || '',
    }
    );

    const codeMirror: any = document.querySelector('#editor > .CodeMirror');
    codeMirror.style.lineHeight = 2;

    // this.editor.setValue(MoeTest.editorText);
    // codemirror cursor height incorrect , refresh it

    this.editor.setValue('-');
    this.editor.setValue('');

    this.editor.focus();


    this.editor.on('change', (editor, obj) => {
      this.change.emit(obj);
      this.updatePre(false);
    });

    this.editor.on('update', () => {
      this.onUpdateStatusBar();
    });

    setTimeout(() => {
      this.updatePre(true);
    }, 0);

    MoeApp.editor = this.editor;

    const leftPanel = document.querySelector('#left-panel');
    leftPanel.addEventListener('click', (e) => {
      if (e.target === leftPanel) {
        this.editor.focus();
      }
    });

    if (MoeApp.config['focus-mode'] === true) {
      document.getElementById('editor').classList.add('focus');
    }

    document.getElementById('button-bottom-focus').addEventListener('click', (e) => {
      document.getElementById('editor').classList.toggle('focus');
      MoeApp.config['focus-mode'] = document.getElementById('editor').classList.contains('focus');
    });

  }

  updatePre(force: boolean) {
    this.updatePreview(this.editor, force, () => {
      this.scroller.editorToPreviewer();
    });
  }

  private updatePreview(editor, force, cb) {

    this.updatePreviewing = true;

    if (!this.updatePreviewRunning) {
      setTimeout(() => {
        this.updateAsync(editor, force, cb);
      }, 0);
    }

  }

  private updateAsync(editor, force, cb) {
    this.updatePreviewing = false;
    this.updatePreviewRunning = true;

    const content = editor.getValue();
    if (this.preTemp.content === content && !force) {
      this.updatePreviewRunning = false;
      if (this.updatePreviewing) {
        setTimeout(() => {
          this.updateAsync(editor, force, cb);
        }, 0);
      }
      cb();
      return;
    }

    if (this.preTemp.content !== content) {
      this.preTemp.content = content;
      this.preTemp.changed = true;
      this.preTemp.document_edited = true;
    }

    if (MoeApp.config['edit-mode'] && !MoeApp.config['edit-mode'].startsWith('preview')
      && !MoeApp.config['edit-mode'].startsWith('read')) {
      this.updatePreviewRunning = false;
      if (this.updatePreviewing) {
        setTimeout(() => {
          this.updateAsync(editor, force, cb);
        }, 0);
      }
      cb();
      return;
    }

    MoeMark.setOptions({
      math: MoeApp.config['math-mode'],
      umlchart: MoeApp.config['uml-diagrams'],
      breaks: MoeApp.config['inline-breaks']
    });

    let mathCnt = 0;
    let mathID = 0;
    const math = [];
    const rendering = true;

    MoeMark(content, {
      mathRenderer: (str, display) => {
        let res = MoeditorMathRender.tryRender(str, display);
        if (res !== undefined) {
          return res;
        } else {
          mathCnt++;
          mathID++;
          const id = 'math-' + mathID;
          res = '<span id="' + id + '"></span>';
          math[id] = { s: str, display };
          return res;
        }
      }
    }, (err, val) => {
      const rendered = document.createElement('span');
      rendered.innerHTML = val;
      MoeditorMathRender.renderMany(math, (m) => {
        for (const id of m) {
          rendered.querySelector('#' + id).innerHTML = m[id].res;
        }

        const imgs = rendered.querySelectorAll('img') || [];

        for (let i = 0; i < imgs.length; i++) {
          const src = imgs[i].getAttribute('src');
          /*          if (url.parse(src).protocol === null) {
                      if (!path.isAbsolute(src)) {
                        src = path.resolve(this.preTemp.directory, src);
                      }
                      src = url.resolve('file://', src);
                    }*/
          imgs[i].setAttribute('src', src);
        }

        const set = new Set();
        const lineNumbers = rendered.querySelectorAll('moemark-linenumber') || [];
        for (let i = 0; i < lineNumbers.length; i++) {
          set.add(parseInt(lineNumbers[i].getAttribute('i'), 10));

        }

        MoeApp.lineNumbers = (Array.from(set)).sort((a, b) => {
          return a - b;
        });
        MoeApp.scrollMap = undefined;

        document.getElementById('container').innerHTML = rendered.innerHTML;
        SVGFixer.fixIt(document.getElementById('container'));

        cb();

        this.updatePreviewRunning = false;
        if (this.updatePreviewing) {
          setTimeout(() => {
            this.updateAsync(editor, force, cb);
          }, 0);
        }
      });
    });
  }

  private getWordCount() {
    const pattern = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
    const m = this.editor.getValue().match(pattern);
    let count = 0;
    if (m === null) {
      return count;
    }

    for (let i = 0; i < m.length; i++) {
      if (m[i].charCodeAt(0) >= 0x4E00) {
        count += m[i].length;
      } else {
        count += 1;
      }
    }
    return count;
  }


  onUpdateStatusBar() {
    this.lineCount = this.editor.lineCount();
    this.wordCount = this.getWordCount();
    this.cursorPos = this.editor.getCursor().line + ':' + this.editor.getCursor().ch;
  }

}

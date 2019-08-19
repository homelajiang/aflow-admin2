import {AfterViewInit, Component, OnInit} from '@angular/core';
import CodeMirror from 'codemirror';
import MoeMark from 'moemark';
import {MoeditorMathRender} from './moe-math';

import {MoeditorHighlight} from './moe-highlight';
import {MoeditorUMLRenderer} from './moe-uml';
import {MoeTest} from './moe-test';


import url from 'url';
import {SVGFixer} from './svgfixer';
import {MoeApp} from './moe-app';

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
import {MoeScroll} from './moe-scroll';
import {MoeMode} from './moe-mode';
import {MoeToolbar} from './moe-toolbar';

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

  private editor: CodeMirror.EditorFromTextArea;
  private scroller: MoeScroll;

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
    this.codeMirrorInit();
    this.scroller = new MoeScroll();
    this.moeMode = new MoeMode();
    const toolbar = new MoeToolbar();
    toolbar.createToolbar(['bold', 'italic', 'heading', '|',
      'quote', 'code', 'unordered-list', 'ordered-list', '|',
      'link', 'image', 'table', '|',
      'edit', 'preview', 'side-by-side', 'fullscreen', '|',
      'guide']);
    // toolbar.createToolbar(['bold', 'italic', 'heading', '|', 'quote']);
  }


  private codeMirrorInit() {
    this.editor = CodeMirror.fromTextArea(document.querySelector('#editor textarea'), {
      lineNumbers: false,
      // mode: MoeApp.config['math-mode'] ? 'gfm_math' : 'gfm',
      // TODO 自定义主题
      mode: 'gfm',
      matchBrackets: true,
      theme: MoeApp.config['editor-theme'],
      lineWrapping: true,
      extraKeys: {
        Enter: 'newlineAndIndentContinueMarkdownList',
        Home: 'goLineLeft',
        End: 'goLineRight',
        'Shift-Tab': 'indentLess'
      },
      tabSize: 4,
      // tabSize: moeApp.config.get('tab-size'),
      indentUnit: 4,
      // indentUnit: moeApp.config.get('tab-size'),
      viewportMargin: Infinity,
      styleActiveLine: true,
      showCursorWhenSelecting: true
    });

    const codeMirror: any = document.querySelector('#editor > .CodeMirror');
    codeMirror.style.lineHeight = 2;

    this.editor.focus();

    // this.editor.setValue('## 回复可见的是\n' +
    //   '>引用\n\n* 元\--啦啦--n\n**哇呕**\n```javascript\nfunction(){\nalert("yuan");\n}\n' +
    //   'module.exports = require(\'./lib/marked\');\n' +
    //   'import "com.android.utils.*"' + '\n' +
    //   '```\n' + '$$E=mc^2$$');
    this.editor.setValue(MoeTest.editorText);

    this.editor.on('change', (editor, obj) => {
      this.updatePre(false);
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

  updatePreview(editor, force, cb) {

    this.updatePreviewing = true;

    if (!this.updatePreviewRunning) {
      setTimeout(() => {
        this.updateAsync(editor, force, cb);
      }, 0);
    }

  }

  updateAsync(editor, force, cb) {
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

    if (MoeApp.editMode && !MoeApp.editMode.startsWith('preview')
      && !MoeApp.editMode.startsWith('read')) {
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
          math[id] = {s: str, display};
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

}

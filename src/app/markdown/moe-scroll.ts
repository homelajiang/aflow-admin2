import {MoeApp} from './moe-app';

export class MoeScroll {

  private editorScroll: Element;
  private containerScroll: HTMLElement;
  private containerWrapper: HTMLElement;
  private container: HTMLElement;

  constructor() {
    this.editorScroll = document.getElementsByClassName('CodeMirror-vscrollbar')[0];
    this.containerScroll = document.getElementById('container-wrapper');
    this.containerWrapper = document.getElementById('container-wrapper');
    this.container = document.getElementById('container');

    const editor: Element = document.getElementById('editor');

    this.editorScroll.addEventListener('scroll', (e) => {
      if (editor.matches(':hover')) {
        this.editorToPreviewer();
      }
    });

    this.containerScroll.addEventListener('scroll', (e) => {
      if (this.containerScroll.matches(':hover')) {
        this.previewerToEditor();
      }
    });
  }

  editorToPreviewer() {
    if (MoeApp.config['edit-mode'] !== 'preview') {
      MoeApp.scrollMap = undefined;
      return;
    }
    if (MoeApp.lineNumbers.length === 0) {
      return;
    }
    if (MoeApp.scrollMap === undefined) {
      this.buildScrollMap();
    }
    if (this.checkScrollToBottom(this.editorScroll, this.containerScroll)) {
      return;
    }
    this.containerScroll.scrollTop =
      this.mapValue(this.editorScroll.scrollTop, MoeApp.scrollMap[0], MoeApp.scrollMap[1]);
  }

  checkScrollToBottom(self: any, other: any) {
    const percentage = self.scrollTop / (self.scrollHeight - self.offsetHeight);
    if (percentage >= 1) {
      const coverBottom = document.getElementsByClassName('cover-bottom');
      for (let i = 0; i < coverBottom.length; i++) {
        coverBottom[i].classList.add('cover-nobackground');
      }
      other.scrollTop = other.scrollHeight;
      return true;
    } else {
      const coverNobackground = document.querySelectorAll('.cover-bottom')
      for (let i = 0; i < coverNobackground.length; i++) {
        const children = coverNobackground[i].querySelectorAll('.cover-nobackground');
        for (let j = 0; j < children.length; j++) {
          children[j].classList.remove('cover-nobackground');
        }
      }
    }
    return false;
  }

  previewerToEditor() {
    if (MoeApp.config['edit-mode'] !== 'preview') {
      MoeApp.scrollMap = undefined;
      return;
    }
    if (MoeApp.lineNumbers.length === 0) {
      return;
    }
    if (MoeApp.scrollMap === undefined) {
      this.buildScrollMap();
    }
    this.editorScroll.scrollTop = this.mapValue(this.containerScroll.scrollTop, MoeApp.scrollMap[1], MoeApp.scrollMap[0]);
  }

  buildScrollMap() {
    this.getLineNumberTags();
    MoeApp.scrollMap = new Array(2);
    MoeApp.scrollMap[0] = new Array(MoeApp.lineNumbers.length + 1);
    MoeApp.scrollMap[1] = new Array(MoeApp.lineNumbers.length + 1);
    const topOffset = this.container.getBoundingClientRect().top;
    for (let i = 0; i < MoeApp.lineNumbers.length; i++) {
      MoeApp.scrollMap[0][i] = MoeApp.editor.heightAtLine(MoeApp.lineNumbers[i], 'local');
      MoeApp.scrollMap[1][i] = MoeApp.lineNumberTags[MoeApp.lineNumbers[i]].getBoundingClientRect().top - topOffset;
    }
    MoeApp.scrollMap[0][MoeApp.lineNumbers.length] = this.editorScroll.scrollHeight - this.editorScroll.clientHeight;
    MoeApp.scrollMap[1][MoeApp.lineNumbers.length] = this.containerWrapper.scrollHeight - this.containerWrapper.clientHeight;
    MoeApp.scrollMap[0][0] = MoeApp.scrollMap[1][0] = 0;
  }

  getLineNumberTags() {
    // from http://stackoverflow.com/questions/9496427/get-elements-by-attribute-when-queryselectorall-is-not-available-without-using-l
    const a = this.container.getElementsByTagName('moemark-linenumber');
    MoeApp.lineNumberTags = new Array(MoeApp.lineNumbers.length);

    for (let i = 0; i < a.length; i++) {
      const x = a[i].getAttribute('i');
      if (typeof MoeApp.lineNumberTags[x] === 'undefined') {
        MoeApp.lineNumberTags[x] = a[i];
      }
    }
  }

  mapValue(x, a, b) {
    const pos = this.lookup(a, x);
    return (x - a[pos - 1]) / (a[pos] - a[pos - 1]) * (b[pos] - b[pos - 1]) + b[pos - 1];
  }

  lookup(a, x) {
    let l = 0;
    let r = a.length - 1;
    while (l !== r) {
      const mid = l + (r - l) / 2 | 0;
      if (a[mid] > x) {
        r = mid;
      } else {
        l = mid + 1;
      }
    }
    if (l >= a.length) {
      return a.length;
    }
    return l;
  }
}

import LRUCache from 'lrucache';
import katex from 'katex';

declare const MathJax: any;
const rendered = LRUCache(1024);

export class MoeditorMathRender {


  static renderMany(a, cb) {
    if (a === []) {
      cb(a);
      return;
    }
    const div = document.createElement('div');
    div.style.width = '0';
    div.style.height = '0';
    div.style.visibility = 'hidden';
    document.body.appendChild(div);
    for (const id of a) {
      const span = document.createElement('span');
      span.innerText = (a[id].display ? '$$' : '$') + a[id].s + (a[id].display ? '$$' : '$');
      span.id = id;
      div.appendChild(span);
    }
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, div]);
    MathJax.Hub.Queue(() => {
      for (const id of a) {
        const span = div.querySelector('#' + id);
        a[id].res = (span.querySelector('svg') || span).outerHTML;
        if (a[id].display) {
          a[id].res = '<div style="width: 100%; text-align: center">' + a[id].res + '</div>';
        }
        rendered.set((a[id].display ? 'd' : 'i') + a[id].s, a[id].res);

      }
      document.body.removeChild(div);
      cb(a);
    });
  }

  static tryRender(str, display) {
    let res = rendered.get((display ? 'd' : 'i') + str);
    if (res === undefined) {
      try {
        res = katex.renderToString(str, {displayMode: display});
        rendered.set((display ? 'd' : 'i') + str, res);
      } catch (e) {
        res = undefined;
      }
    }
    return res;
  }

}

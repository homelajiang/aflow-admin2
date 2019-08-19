import LRUCache from 'lrucache';
// import Sequence from '@rokt33r/js-sequence-diagrams'; // 序列图

const rendered = LRUCache(1024);

declare const Diagram: any; // 序列图
declare const flowchart: any; // 流程图


const div = document.createElement('div');
div.style.display = 'none';
document.body.appendChild(div);

export function MoeditorUMLRenderer(str, type) {
  let res = rendered.get(type + str);
  if (typeof res === 'string') {
    return res;
  }

  try {
    if (type === 'sequence') {
      // res = str;
      res = renderSequence(str);
    } else if (type === 'flow') {
      res = renderFlow(str);
      // res = str;
    }
  } catch (e) {
    res = e;
  }

  rendered.set(type + str, res);
  return res;
}

function renderFlow(str) {
  const diagram = flowchart.parse(str);
  diagram.drawSVG(div);
  const res = div.innerHTML;
  div.innerHTML = '';
  return `<div>${res}</div>`;
}

function renderSequence(str) {
  const diagram = Diagram.parse(str);
  diagram.drawSVG(div, {theme: 'simple'});
  const res = div.innerHTML;
  div.innerHTML = '';
  return `<div>${res}</div>`;
}

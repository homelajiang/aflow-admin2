import highlightjs from 'highlight.js';

import LRUCache from 'lrucache';

const cache = LRUCache(512);

export function MoeditorHighlight(code, lang) {
  const key = lang + '|' + code;
  let res = cache.get(key);
  if (res === undefined) {
    try {
      if (!lang || lang === '') {
        res = highlightjs.highlightAuto(code).value;
      } else {
        res = highlightjs.highlight(lang, code).value;
      }
    } catch (e) {
      res = code;
    }

    cache.set(key, res);
  }
  return res;
}



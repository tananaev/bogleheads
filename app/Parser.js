import { DOMParser } from 'xmldom';

class Parser {
  constructor(element) {
    if (typeof element === 'string' || element instanceof String) {
      const parser = new DOMParser({
        errorHandler: () => {}
      });
      const doc = parser.parseFromString(element, 'text/html');
      this.element = doc.documentElement;
    } else {
      this.element = element;
    }
  }

  find(tag, index) {
    const filtered = Array
      .from(this.element.childNodes)
      .filter(node => node.tagName === tag);
    if (typeof index === 'undefined') {
      return filtered.map(node => new Parser(node));
    } else {
      return filtered[index] && new Parser(filtered[index]);
    }
  }

  text() {
    return Array
      .from(this.element.childNodes)
      .filter(node => node.constructor.name === 'Text')
      .join('')
      .trim();
  }

  attr(key) {
    const attr = Array
      .from(this.element.attributes)
      .filter(attr => attr.name === key)[0];
    return attr && attr.value;
  }
}

export default Parser;

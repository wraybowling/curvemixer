export default class XML {
  constructor(name) {
    const namespace = 'http://www.w3.org/2000/svg';
    this.documentObject = document.createElementNS(namespace, name);
  }

  attr(name, value) {
    this.documentObject.setAttributeNS(null, name, value);
  }
}

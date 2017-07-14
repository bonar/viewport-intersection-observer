"use strict";

export default class ViewportIntersectionObserver {

  constructor () {
    this.registry = [];
  }

  addListener(element, handlers) {
    if (!this._isValidElement(element)) {
      return null;
    }
    const entry = {
      element: element,
      handlers: handlers,
      state: this.isInViewport(element)
    };
    this.registry.push(entry);
    return entry;
  }

  getListeners() {
    return this.registry;
  }

  _isValidElement(element) {
    return !!element['getBoundingClientRect']
  }

  observe() {

  }

  getViewpointBottom() {
    var win = this._getWindow();
    var doc = this._getDocument();
    return win.innerHeight 
      + (doc.documentElement.scrollTop || win.pageYOffset);
  }

  isInViewport(element) {
    var viewportBottom = this.getViewpointBottom();
    var rect = element.getBoundingClientRect();
    if (viewportBottom > element.offsetTop && rect.bottom > 0) {
      return true;
    }
    if (0 > rect.top && rect.bottom > viewportBottom) {
      return true;
    }
    return false;
  }

  _getWindow() {
    return window;
  }

  _getDocument() {
    return document;
  }

}


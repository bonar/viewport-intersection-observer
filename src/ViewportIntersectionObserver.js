"use strict";

export default class ViewportIntersectionObserver {

  constructor () {
    this.registry = [];
  }

  addListener(element, handlers) {
  }

  observe() {

  }

  getViewpointBottom() {
    var win = this._getWindow();
    var doc = this._getDocument();
    return win.innerHeight 
      + (doc.documentElement.scrollTop || win.pageYOffset);
  }

  _getWindow() {
    return window;
  }

  _getDocument() {
    return document;
  }

}


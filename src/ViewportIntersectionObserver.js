"use strict";

export default class ViewportIntersectionObserver {

  constructor (opt) {
    this.registry = [];
    this.observed = false;
    this.ignore_first_observe
      = !!(opt && opt.ignore_first_observe)
    this.lastObserveTime = null;
  }

  addListener(element, handlers) {
    if (!this._isValidElement(element)) {
      return null;
    }
    const entry = {
      element: element,
      handlers: handlers,
      state: null,
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

  _updateState() {
    for (let entry of this.registry) {
      entry.state = this.isInViewport(entry.element);
    }
  }

  throttleTimedOut(interval) {
    return (Date.now() - this.lastObserveTime) > interval;
  }

  observe(opt) {
    if (!this.observed && this.ignore_first_observe) {
      this._updateState();
      this.observed = true;
      return;
    }
    if (opt && opt.throttle) {
      if (this.lastObserveTime == null) {
        this.lastObserveTime = Date.now();
      }
      if (!this.throttleTimedOut(opt.throttle)) {
        return;
      }
      this.lastCheck = Date.now();
    }
    for (let entry of this.registry) {
      const newState = this.isInViewport(entry.element);
      if (newState == entry.state) {
        continue;
      }
      if (newState && entry.handlers.show) {
        entry.handlers.show(entry.element);
      }
      if (!newState && entry.handlers.hide) {
        entry.handlers.hide(entry.element);
      }
      entry.state = newState;
    }
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


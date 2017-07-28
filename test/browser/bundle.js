(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewportIntersectionObserver = function () {
  function ViewportIntersectionObserver(opt) {
    _classCallCheck(this, ViewportIntersectionObserver);

    this.registry = [];
    this.observed = false;
    this.ignore_first_observe = !!(opt && opt.ignore_first_observe);
    this.lastCheck = Date.now();
  }

  _createClass(ViewportIntersectionObserver, [{
    key: "addListener",
    value: function addListener(element, handlers) {
      if (!this._isValidElement(element)) {
        return null;
      }
      var entry = {
        element: element,
        handlers: handlers,
        state: null
      };
      this.registry.push(entry);
      return entry;
    }
  }, {
    key: "getListeners",
    value: function getListeners() {
      return this.registry;
    }
  }, {
    key: "_isValidElement",
    value: function _isValidElement(element) {
      return !!element['getBoundingClientRect'];
    }
  }, {
    key: "_updateState",
    value: function _updateState() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.registry[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var entry = _step.value;

          entry.state = this.isInViewport(entry.element);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "shouldUpdateTimeCheck",
    value: function shouldUpdateTimeCheck(time) {
      return Date.now() - this.lastCheck > time;
    }
  }, {
    key: "observe",
    value: function observe(opt) {
      if (!this.observed && this.ignore_first_observe) {
        this._updateState();
        this.observed = true;
        return;
      }
      if (opt && opt.throttle) {
        if (!this.shouldUpdateTimeCheck(opt.throttle)) {
          return;
        }
        this.lastCheck = Date.now();
      }
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.registry[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var entry = _step2.value;

          var newState = this.isInViewport(entry.element);
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
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "getViewpointBottom",
    value: function getViewpointBottom() {
      var win = this._getWindow();
      var doc = this._getDocument();
      return win.innerHeight + (doc.documentElement.scrollTop || win.pageYOffset);
    }
  }, {
    key: "isInViewport",
    value: function isInViewport(element) {
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
  }, {
    key: "_getWindow",
    value: function _getWindow() {
      return window;
    }
  }, {
    key: "_getDocument",
    value: function _getDocument() {
      return document;
    }
  }]);

  return ViewportIntersectionObserver;
}();

exports.default = ViewportIntersectionObserver;

},{}],2:[function(require,module,exports){
(function() {

var ViewportIntersectionObserver
  = require("../../lib/ViewportIntersectionObserver.js").default;

var ctarget1 = new Vue({
  el: '#console-target1',
  data: {
    inViewport: null,
  }
});
var ctarget2 = new Vue({
  el: '#console-target2',
  data: {
    inViewport: null,
  }
});

var target1 = document.getElementById('target1');
var target2 = document.getElementById('target2');

var observer = new ViewportIntersectionObserver();
observer.addListener(target1, {
  show: function() {
    console.log("target1 show");
    ctarget1.inViewport = true;
  },
  hide: function() {
    console.log("target1 hide");
    ctarget1.inViewport = false;
  }
});
observer.addListener(target2, {
  show: function() {
    console.log("target2 show");
    ctarget2.inViewport = true;
  },
  hide: function() {
    console.log("target2 hide");
    ctarget2.inViewport = false;
  }
});
observer.observe();

window.addEventListener('scroll', function() {
  observer.observe({ throttle: 100 });
});

})();


},{"../../lib/ViewportIntersectionObserver.js":1}]},{},[2]);

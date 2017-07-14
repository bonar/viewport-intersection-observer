"use strict";
import assert from 'power-assert'
import ViewportIntersectionObserver from "../src/ViewportIntersectionObserver.js";

describe("ViewportIntersectionObserver", () => {

  let stubDOMFunctionality = (injectee) => {
    injectee._getWindow = () => {
      return {
        innerHeight: 900
      }
    }
    injectee._getDocument = () => {
      return {
        documentElement: {
          scrollTop: 100
        }
      }
    }
  }

  var observer;
  beforeEach(() => {
    observer = new ViewportIntersectionObserver();
    stubDOMFunctionality(observer);
  });

  it("initialize", () => {
    assert.ok(observer);
  });

  describe("viewpoint bottom", () => {

    it("scrollTop", () => {
      assert.equal(observer.getViewpointBottom(), 1000);
    });

    it("pageYOffset", () => {
      observer._getDocument = () => {
        return {
          documentElement: {}
        }
      };
      observer._getWindow = () => {
        return {
          innerHeight: 900,
          pageYOffset: 50
        }
      };
      assert.equal(observer.getViewpointBottom(), 950);
    });

  });

  describe("isInViewport", () => {

    it("case: first view", () => {
      observer.getViewpointBottom = () => {
        return 800;
      }
      assert.equal(observer.isInViewport({
        getBoundingClientRect: () => {
          return { top: 0, bottom: 50 }
        },
        offsetTop: 0
      }), true);
    });

    it("case: out of first view", () => {
      observer.getViewpointBottom = () => {
        return 100;
      }
      assert.equal(observer.isInViewport({
        getBoundingClientRect: () => {
          return { top: 101, bottom: 151 }
        },
        offsetTop: 101
      }), false);
    });

    it("case: upper half is in viewport", () => {
      observer.getViewpointBottom = () => {
        return 200;
      }
      assert.equal(observer.isInViewport({
        getBoundingClientRect: () => {
          return { top: 50, bottom: 150 }
        },
        offsetTop: 50 
      }), true);
    });

    it("case: lower half is in viewport", () => {
      observer.getViewpointBottom = () => {
        return 200;
      }
      assert.equal(observer.isInViewport({
        getBoundingClientRect: () => {
          return { top: -50, bottom: 50 }
        },
        offsetTop: 150 
      }), true);
    });

    it("case: element is under viewport", () => {
      observer.getViewpointBottom = () => {
        return 200;
      }
      assert.equal(observer.isInViewport({
        getBoundingClientRect: () => {
          return { top: -250, bottom: -350 }
        },
        offsetTop: 250 
      }), false);
    });

  });

  describe("listener registration", () => {

    it("returns null for invalid element", () => {
      let ret = observer.addListener({}, {});
      assert.equal(ret, null);
    });

    it("accepts valid listener registration", () => {
      const entry = observer.addListener(
        { getBoundingClientRect: () => { return {} },
          id: 'test1'
        }, {
          show: () => { return 'test_show' },
          hide: () => { return 'test_hide' }
        });
      assert.equal(entry.element.id, 'test1');
      assert.equal(entry.handlers.show(), 'test_show');
      assert.equal(entry.handlers.hide(), 'test_hide');
      assert.equal(entry.state, false);
    });

    it("accepts multiple listeners", () => {
      observer.addListener(
        { getBoundingClientRect: () => { return {} },
          id: 'test1'
        }, {
          show: () => { return 'show1' },
          hide: () => { return 'hide1' }
        });
      observer.addListener(
        { getBoundingClientRect: () => { return {} },
          id: 'test2'
        }, {
          show: () => { return 'show2' },
          hide: () => { return 'hide2' }
        });
      observer.addListener(
        { getBoundingClientRect: () => { return {} },
          id: 'test3'
        }, {
          show: () => { return 'show3' },
          hide: () => { return 'hide3' }
        });
      const listeners = observer.getListeners();
      assert.equal(listeners.length, 3);
      assert.equal(listeners[0].element.id, 'test1');
      assert.equal(listeners[1].element.id, 'test2');
      assert.equal(listeners[2].element.id, 'test3');
    });



  });

});


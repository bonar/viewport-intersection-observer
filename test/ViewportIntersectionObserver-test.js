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

  let createDummyElement = (id) => {
    return {
      getBoundingClientRect: () => { return {} },
      id: id
    };
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
        createDummyElement('test1'),
        {
          show: () => { return 'test_show' },
          hide: () => { return 'test_hide' }
        });
      assert.equal(entry.element.id, 'test1');
      assert.equal(entry.handlers.show(), 'test_show');
      assert.equal(entry.handlers.hide(), 'test_hide');
      assert.equal(entry.state, null);
    });

    it("accepts multiple listeners", () => {
      observer.addListener(
        createDummyElement('test1'),
        {
          show: () => { return 'show1' },
          hide: () => { return 'hide1' }
        });
      observer.addListener(
        createDummyElement('test2'),
        {
          show: () => { return 'show2' },
          hide: () => { return 'hide2' }
        });
      observer.addListener(
        createDummyElement('test3'),
        {
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

  describe("observe and execute handler", () => {

    it("fires event", () => {
      var show1fired = false;
      var hide1fired = false;

      observer.isInViewport = (element) => {
        return true;
      };

      observer.addListener(
        createDummyElement('test1'),
        {
          show: () => { show1fired = true },
          hide: () => { hide1fired = true }
        });
      observer.observe();
      assert.equal(show1fired, true)
      assert.equal(hide1fired, false)
    });

    it("fires multiple events", () => {
      var show1fired = false;
      var show2fired = false;
      var show3fired = false;

      observer.isInViewport = (element) => {
        if (element.id == 'test2') {
          return false;
        }
        return true;
      };

      observer.addListener(
        createDummyElement('test1'),
        { show: () => { show1fired = true } });
      observer.addListener(
        createDummyElement('test2'),
        { show: () => { show2fired = true } });
      observer.addListener(
        createDummyElement('test3'),
        { show: () => { show3fired = true } });

      observer.observe();
      assert.equal(show1fired, true)
      assert.equal(show2fired, false)
      assert.equal(show3fired, true)
    });

    it("throttles calls when throttle passed as param", done => {
      const throttleMillisec = 100;
      let show1fired = false;

      observer.isInViewport = (element) => {
        return true;
      }

      observer.addListener(
        createDummyElement('test1'),
        {
          show: () => { show1fired = true; }
        });

      setTimeout(() => {
        observer.observe({ throttle: throttleMillisec });

        setTimeout(() => {
          observer.observe({ throttle: throttleMillisec });
          assert.equal(show1fired, false);

          setTimeout(() => {
            observer.observe({ throttle: throttleMillisec });
            assert.equal(show1fired, true);
            done();

          }, throttleMillisec + 100);
        }, 50);
      }, 0);
    });

    it("does not fire event when state not changed", () => {
      var show = 0;
      var hide = 0;

      observer.isInViewport = (element) => {
        return true;
      };
      observer.addListener(
        createDummyElement('test1'),
        {
          show: (element) => { show++ },
          hide: (element) => { hide++ }
        });
      observer.observe();
      observer.observe();
      observer.observe();
      assert.equal(show, 1);
      assert.equal(hide, 0);

      observer.isInViewport = (element) => {
        return false;
      };
      observer.observe();
      observer.observe();
      observer.observe();
      assert.equal(show, 1);
      assert.equal(hide, 1);
    });

    it("passes element to handler", () => {
      var show1element = null;
      var show2element = null;

      observer.isInViewport = (element) => {
        return true;
      };

      observer.addListener(
        createDummyElement('test1'),
        {
          show: (element) => { show1element = element }
        });
      observer.addListener(
        createDummyElement('test2'),
        {
          show: (element) => { show2element = element }
        });
      observer.observe();
      assert.equal(show1element.id, 'test1')
      assert.equal(show2element.id, 'test2')
    });

    it("does not fire event at startup, "
        + "with ignore_first_observe flag", () => {
      let observer2 = new ViewportIntersectionObserver({
        ignore_first_observe: true
      });
      stubDOMFunctionality(observer2);
      observer2.isInViewport = (element) => {
        return true;
      };
      var show = 0;
      observer2.addListener(
        createDummyElement('test1'),
        {
          show: (element) => { show++ }
        });
      observer2.observe();
      assert.equal(show, 0);

      let listeners = observer2.getListeners();
      assert.equal(listeners.length, 1)
      assert.equal(listeners[0].state, true)

      observer2.observe();
      observer2.observe();
      observer2.observe();
      assert.equal(show, 0);

      // true => false => true
      observer2.isInViewport = (element) => {
        return false;
      };
      observer2.observe();
      observer2.isInViewport = (element) => {
        return true;
      };
      observer2.observe();
      assert.equal(show, 1);
    });

  })

});


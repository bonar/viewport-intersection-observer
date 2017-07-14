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

  it("initialize", () => {
    var VObserver = new ViewportIntersectionObserver();
    assert.ok(VObserver);
  });

  describe("viewpoint bottom", () => {

    it("scrollTop", () => {
      var VObserver = new ViewportIntersectionObserver();
      stubDOMFunctionality(VObserver);
      assert.equal(VObserver.getViewpointBottom(), 1000);
    });

    it("pageYOffset", () => {
      var VObserver = new ViewportIntersectionObserver();
      VObserver._getDocument = () => {
        return {
          documentElement: {}
        }
      };
      VObserver._getWindow = () => {
        return {
          innerHeight: 900,
          pageYOffset: 50
        }
      };
      assert.equal(VObserver.getViewpointBottom(), 950);
    });

  });

});


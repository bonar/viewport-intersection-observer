"use strict";
import assert from 'power-assert'
import ViewportIntersectionObserver from "../src/ViewportIntersectionObserver.js";

describe("ViewportIntersectionObserver", () => {

  it("initialize", () => {
    var VObserver = new ViewportIntersectionObserver();
    assert.ok(VObserver);
  });

});


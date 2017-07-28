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


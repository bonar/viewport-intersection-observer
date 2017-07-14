# viewport-intersection-observer

Observse intersection of a DOM element and viewport

## Installation

```
npm install viewport-intersection-observer
```

## Usage

```
var observer = new ViewportIntersectionObserver();

// add elements to observe and its show/hide handler
observer.addListener(target1, {
  show: function() {
    console.log("target1 show");
  },
  hide: function() {
    console.log("target1 hide");
  }
});
observer.addListener(target2, {
  show: function() {
    console.log("target2 show");
  },
  hide: function() {
    console.log("target2 hide");
  }
});
observer.observe();

// You need to call observe() to check status of
// registered elements. It is NOT automatic.
window.addEventListener('scroll', function() {
  observer.observe();
});
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT






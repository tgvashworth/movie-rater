// ==================================
// Utilities
// ==================================

// Debouce a callback
var debounce = (function () {
  // Save the previously used callbacks and timers
  var cbs = [],
      timers = [];

  // When debounce is called, they're calling this function
  return function (delay, cb) {
    // Find or store this callback
    var cbIndex = cbs.indexOf(cb);
    if (cbIndex === -1) {
      cbIndex = cbs.push(cb);
    }

    // When the event fires, this function is called
    return function () {
      // Save the arguments
      var args = [].slice.call(arguments);
      // Clear any current timers and start a new one
      clearTimeout(timers[cbIndex]);
      timers[cbIndex] = setTimeout(function () {
        cb.apply(this, args);
      }.bind(this), delay);
    };
  };
}());

// Insert value into into array (via comparison function)
var insert = function insert(item, arr, compare, done) {

  if (!done) {
    done = compare;
    compare = false;
  }

  compare = compare || function (a, b, cb) { return cb(a < b); };

  arr = [].slice.call(arr);

  if (!arr.length) return done([item]);

  var pivot = Math.floor(arr.length / 2),
      middle = arr[pivot],
      left = arr.slice(0, pivot),
      right = arr.slice(pivot + 1);

  compare(item, middle, function (result) {
    if (result) {
      right.unshift(middle);
      if (!left.length) { return done([item].concat(right)); }
      insert(item, left, compare, function (result) {
        done(result.concat(right));
      });
    } else {
      left.push(middle);
      if (!right.length) { return done(left.concat(item)); }
      insert(item, right, compare, function (result) {
        done(left.concat(result));
      });
    }
  });

};
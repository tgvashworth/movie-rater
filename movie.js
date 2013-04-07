$(function () {

  // ==================================
  // Cached elements
  // ==================================

  var $newMovieName = $('#new-movie-name');

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

  // ==================================
  // Event handlers
  // ==================================

  var debouncedSearch = debounce(100, function (newValue) {
    var autocomplete = this;
    rotten.search(newValue, function (movies) {
      movies = movies || [{title: 'None found.'}];
      autocomplete.addValues(movies.map(function (movie) {
        return movie.title;
      }));
    });
  });

  // ==================================
  // Events
  // ==================================

  // Search for the movie
  new Autocomplete("new-movie-name", {
    srcType : "array",
    useNativeInterface: false,
    srcData : [],
    onInput : debouncedSearch
  });

});
$(function () {

  // ==================================
  // Cached elements
  // ==================================

  var $newMovieName = $('#new-movie-name'),
      $movieA = $('#movie-a'),
      $movieB = $('#movie-b'),
      $ranked = $('#ranked');

  // ==================================
  // Cached templates
  // ==================================

  var template = {
    movie: _.template($('#template-movie').html())
  };

  // ==================================
  // Storage
  // ==================================

  var getMovies = function () {
    return JSON.parse(localStorage.getItem('movies') || '[]');
  };

  var saveMovies = function (movies) {
    return localStorage.setItem('movies', JSON.stringify(movies));
  };

  // ==================================
  // States
  // ==================================

  // Show two movies and set up event handlers for picking
  var compareMovies = function (movieA, movieB, cb) {
    $movieA.html(template.movie({
      title: movieA.title,
      poster: movieA.posters.profile
    }));
    $movieB.html(template.movie({
      title: movieB.title,
      poster: movieB.posters.profile
    }));
    $movieA.find('a').click(function (e) {
      e.preventDefault();
      cb(false);
    });
    $movieB.find('a').click(function (e) {
      e.preventDefault();
      cb(true);
    });
  };

  // Show movies in ranked order
  var displayRanked = function (movies, newMovie) {
    newMovie = newMovie || { title: false };
    $ranked.html('');
    movies.forEach(function (movie) {
      $ranked.prepend($('<li>', {
        text: movie.title,
        className: (movie.title === newMovie.title ? 'new' : '')
      }));
    });
  };

  // Begin rating the selected movie
  var rateMovie = function (newMovie) {
    $ranked.html('');
    var oldMovies = getMovies();

    oldMovies = oldMovies.filter(function (movie) {
      return movie.title !== newMovie.title;
    });

    insert(newMovie, oldMovies, compareMovies, function (movies) {
      $movieA.html('');
      $movieB.html('');
      displayRanked(movies, newMovie);
      $newMovieName.val('').focus();
      saveMovies(movies);
    });

  };

  // Movie chosen. Grab its info and begin rating!
  var pickMovie = function (title) {
    console.log("Searching for " + title);
    rotten.search(title, function (movies) {
      movies = movies || [{title: 'Not found.'}];
      movies.forEach(function (movie) {
        if (movie.title === title) {
          rateMovie(movie);
        }
      });
    });
  };

  // ==================================
  // Event handlers
  // ==================================

  // Search
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

  // Pick movie from list
  $newMovieName.on('keypress', function (e) {
    if(e.which == 13) {
      pickMovie($newMovieName.val());
    }
  });

  // ==================================
  // Load
  // ==================================

  displayRanked(getMovies());

});
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
		movie: _.template($('#template-movie').html()),
		movieRanking: _.template($('#template-movie-ranking').html())
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

	var shortcut = function () {};

	// Show two movies and set up event handlers for picking
	var compareMovies = function (movieA, movieB, cb) {
		$movieA.html(template.movie({
			title: movieA.title,
			link: movieA.links.alternate,
			year: movieA.year,
			poster: movieA.posters.original
		}));

		$movieB.html(template.movie({
			title: movieB.title,
			link: movieB.links.alternate,
			year: movieB.year,
			poster: movieB.posters.original
		}));

		$movieA.find('a').click(function (e) {
			e.preventDefault();
			cb(false);
		});

		$movieB.find('a').click(function (e) {
			e.preventDefault();
			cb(true);
		});

		shortcut = function (e) {
			console.log('yo');
	    if (e.keyCode == 37) { 
				cb(false);
	    }

	    if (e.keyCode == 39) {
	    	cb(true);
	    }
		};
	
	};

	// Show movies in ranked order
	var displayRanked = function (movies, newMovie) {
		isEmpty();
		newMovie = newMovie || { title: false };
		$ranked.html('');
		movies.forEach(function (movie) {
			$ranked.prepend(template.movieRanking({
				poster: movie.posters.original
			}));
		});
	};

	// Begin rating the selected movie
	var rateMovie = function (newMovie) {
		$('.ring').removeClass('hide');
		var oldMovies = getMovies();

		oldMovies = oldMovies.filter(function (movie) {
			return movie.title !== newMovie.title;
		});

		insert(newMovie, oldMovies, compareMovies, function (movies) {
			shortcut = function () {};
			$('.ring').addClass('hide');
			$movieA.html('');
			$movieB.html('');
			displayRanked(movies, newMovie);
			$newMovieName.val('').focus();
			saveMovies(movies);
			isEmpty();
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

	$(document).keydown(function () {
		shortcut.apply(this, [].slice.call(arguments));
	});

	// ==================================
	// Load
	// ==================================

	// Check if favourites list is stored.
	var isEmpty = function() {
		var movies = getMovies();
		if (movies.length == 0) {
			console.log('0');
			$('.ranking').parent().addClass('hide');
			return true;
		} else {
			$('.ranking').parent().removeClass('hide');
			return false;
		}
	};

	displayRanked(getMovies());
	isEmpty();

});
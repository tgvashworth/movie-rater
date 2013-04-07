// ==================================
// Talk to the rotten tomatoes api
// ==================================

var rotten = (function () {

  var api = {
    search: 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?callback=?&apikey=pycn8uzvtwnzx2xkswht83qp&q='
  };

  return {
    search: function (query, cb) {
      $.getJSON(api.search + query, function (data) {
        cb(data.movies);
      });
    }
  };

}());
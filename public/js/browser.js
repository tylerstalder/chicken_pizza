/* ------------- 3 Column Browser for Genres, Artists, and Albums ------------ */

var browser = function() {
	var tags = ['Genre','Artist','Album'];
	
	// need to get all the selected filters
	
	var filter = function() {
		$.ajax({
	    type: 'GET',
	    dataType: 'json',
	    url: '/search_and_filter?filters[Genre]&filters[Artist]&filters[Album]&query=',
	    success: function(data) {
			populateGenres(data.Genre);
			populateArtists(data.Artist);
			populateAlbums(data.Album);
	    }
	  });
	};
	
	var populateGenres = function(genres) {
	    var html = '';
	    genres = _.uniq(genres);
		html += '<li>All (' + genres.length + ' Genres)';
	    for (var k=0; k < genres.length; k++) {
	      html += '<li>' + genres[k] + '</li>'
	    };
	    $('#genres ul').html(html);
	};
	
	var populateArtists = function(artists) {
	    var html = '';
	    artists = _.uniq(artists);
		html += '<li>All (' + artists.length + ' Artists)';
	    for (var k=0; k < artists.length; k++) {
	      html += '<li>' + artists[k] + '</li>'
	    };
	    $('#artists ul').html(html);
	};
	var populateAlbums = function(albums) {
	    var html = '';
	    albums = _.uniq(albums);
		html += '<li>All (' + albums.length + ' Albums)';
	    for (var k=0; k < albums.length; k++) {
	      html += '<li>' + albums[k] + '</li>'
	    };
	    $('#albums ul').html(html);
	};
	
	return {
		init:function(){
			filter();
		}
	}
}();
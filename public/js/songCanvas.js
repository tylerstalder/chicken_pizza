/* ------------- Main song list ------------ */

var songCanvas = function() {
	
	var songs = [];

	var populateSongs = function() {
	    var html = '';
	    for (var i=0; i < songs.length; i++) {
	      html += '<a href="' + songs[i].file + '" title="' + songs[i].Artist + '">' + songs[i].Title + '</a>'
	    };
	    $('#songCanvas').html(html);
	    songClickandPlay();
	};
	
	var loadSongs = function() {
		$('#playPause').addClass('paused');

	  $.ajax({
	    type: 'GET',
	    dataType: 'json',
	    url: '/all_tracks',
	    success: function(data) {
			songs = data;
			populateSongs();
	    }
	  });
	};
	
	function songClickandPlay() {
	  var sCan = $('#songCanvas');
	  sCan.click(function(e){
	    e.preventDefault();
	    var target = $(e.target);
	    sCan
	      .find('.focus')
	      .removeClass('focus');
	    if (target.attr('href')) {
	      target.addClass('focus');
	    }
	  });

	  sCan.dblclick(function(e){
	    var target = $(e.target);
	    if (target.attr('href')) {
	      target.attr('id', 'playing');
	      var title = target.text();
	      var artist = target.attr('title');
	      var song = target.attr('href');
	      $('#playPause').toggleClass('paused');
	      $('#scrubber').html('<h3>' + 
	                          title + 
	                          '</h3><h4>' + 
	                          artist + 
	                          '</h4><audio id="playa" autoplay autobuffer><source src="/music/ogg/' + 
	                          song + 
	                          '.ogg" /><source src="/music/mp3/' + 
	                          song + 
	                          '.mp3" /></audio>');
	    }
	/*
	    document.getElementById('playa').addEventListener('onended', function(){
	      $('#playing').next('A').dblclick().end().attr('id', '');
	    }, false);
	*/
	  });
	}
	
	/* Hotkeys */
	  $('body').keypress(function(e){
	    if (e.keyCode == '32') {
	      $('#playPause').click();
	    }
	  });

	return {
		init: function(){
			loadSongs();
		}
	}
}();
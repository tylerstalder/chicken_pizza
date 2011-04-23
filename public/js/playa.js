/* ----------- Music Player for controls and status ---------- */

var playa = function() {
	var playing = true;
	
	var play = function() {
		$.ajax({
	    type: 'PUT',
	    dataType: 'json',
	    url: '/playback/play',
	    success: function(data) {
			$("#playPause").toggleClass('paused');
			playing = true;
	    }
	  });
	};
	
	var pause = function() {
		$.ajax({
	    type: 'PUT',
	    dataType: 'json',
	    url: '/playback/pause',
	    success: function(data) {
			$("#playPause").toggleClass('paused');
			playing = false;
	    }
	  });
	};
	
	var next = function() {
		$.ajax({
	    type: 'POST',
	    dataType: 'json',
	    url: '/playback/next',
	    success: function(data) {
			// success callback
	    }
	  });
	};
	
	var previous = function() {
		$.ajax({
	    type: 'POST',
	    dataType: 'json',
	    url: '/playback/previous',
	    success: function(data) {
			// success callback
	    }
	  });
	};
	
	var setVol = function(value) {
		var url = '/playback/setvol?vol=' + value;
		$.ajax({
	    type: 'PUT',
	    dataType: 'json',
	    url: url,
	    success: function(data) {
			// success callback
	    }
	  });
	};
	
	// attach all of the UI controls
	var initUI = function() {
	  $('#playPause').click(function(){
	    if (playa.playing) {
	      playa.pause();
	      $(this).toggleClass('paused');
	    } else {
	      playa.play();
	      $(this).toggleClass('paused');
	    }
	  });

	  $('#nextSong').click(function(e){
	    e.preventDefault();
	    $('#playing').next('A').dblclick().end().attr('id', '');
	    $('#playPause').toggleClass('paused');
		chicken_pizza.next()
	  });

	  $('#prevSong').click(function(e){
	    e.preventDefault();
	    $('#playing').prev('A').dblclick().end().attr('id', '');
	    $('#playPause').toggleClass('paused');
		chicken_pizza.previous();
	  });

	$('#volume').slider({
	  min: 0,
	  max: 100,
	  value: 65,
	  animate: true,
	  slide: function(event, ui) {
	    playa.setVol(ui.value);
	  }
	});
	};
	
	return {
		play:play,
		pause:pause,
		next:next,
		previous:previous,
		setVol:setVol,
		playing: playing,
		init:function(){
			initUI();
		}
	}
}();
/* ----------- Music Player for controls and status ---------- */

/*
* Events:
* playChange
* songChange
* volumeChange
*/

var playa = function() {
	var playing = true
  , queue
  , status
  , el = $('#controls')
  , volume;
	
	var play = function() {
		$.ajax({
	    type: 'PUT',
	    dataType: 'json',
	    url: '/playback/play',
	    success: function(data) {
        $("#playPause").toggleClass('paused');
        playing = true;
        el.trigger('playChange', [{playing:playing}]);
        update();
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
        el.trigger('playChange', [{playing:playing}]);
        update();
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
        el.trigger('songChange');
        update();
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
        el.trigger('songChange');
        update();
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
        el.trigger('volumeChange');
        update();
	    }
	  });
	};

  var setCurrentSong = function(songId) {
    for (var i = 0; i < queue.length; i++) {
      if (queue[i].Id === songId) {
        var title = queue[i].Title;
        var artist = queue[i].Artist;
        $('#scrubber').html('<h3>' + title + '</h3><h4>' + artist + '</h4>');
      }
    }
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
      next();
	  });

	  $('#prevSong').click(function(e){
	    e.preventDefault();
	    $('#playing').prev('A').dblclick().end().attr('id', '');
	    $('#playPause').toggleClass('paused');
      previous();
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

  var statusWatcher = function(){
    update();
    setInterval(update,10*1000);
  };

  var update = function() {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: '/queue/list',
      success: function(queueData) {
        queue = queueData;
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: '/status',
          success: function(statusData) {
            // success callback
            status = statusData;
            if(statusData.state == 'play') {
              console.log(statusData.volume);
              console.log('status playing');
              setCurrentSong(statusData.songid);
              $('#volume').slider.value(statusData.volume);
            }
          }
        });
      }
    });
  };

/* blocking this out for now, new queue will work differently
  var li= document.createElement("li");
  var minus = document.createElement("a");
  minus.onclick=function(){return simple_control("/queue/delete/"+this.parentElement.i,"delete");}
  li.ondblclick=function(){return simple_control("/playback/play?pos="+this.i,"put");}
  ul.appendChild(li);
  li.appendChild(minus);
  minus.appendChild(document.createTextNode("(-)"));
  minus.setAttribute("href","#");
  var playNext=document.createElement("a");

  playNext.onclick=function(){
  var cur = parseInt(THE_STATUS.song);
  var target = (this.parentElement.i <=cur) ? cur : cur+1;
  return simple_control("/queue/move/"+this.parentElement.track_id+"?pos="+target,"put");
  }
  li.appendChild(playNext);
  playNext.appendChild(document.createTextNode("(play next)"));
  playNext.setAttribute("href","#");
  li.appendChild(document.createTextNode("  ["+(track["Requester"]||"Unknown Requester")+"]: "+(track["Artist"]||"(Unknown Artist)")+" - "+(track["Title"]||"(Unknown Title, file="+track["file"]+")")));
  li.i=i;
  li.track_id=track["Id"];
  if (i<song_i) {
  li.className="already_played";
  }
  if (i==song_i) {
  li.className="current_song";
  }

	var simple_control = function(url,method){
		utils.ajax(url,method,null,function(d){update_status();});
		return false;
	};

*/
	
	return {
		play:play,
		pause:pause,
		next:next,
		previous:previous,
		setVol:setVol,
		playing: playing,
    setSong: function(song){
      setCurrentSong(song);
    },
		init:function(){
			initUI();
      statusWatcher();
		}
	}
}();

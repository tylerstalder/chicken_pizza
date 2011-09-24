/* ----------- Music Player for controls and status ---------- */

/*
* Events:
* playChange
* songChange
* volumeChange
*/

var playa = {
  el: '', //#controls
  playEl: '#playPause', //#playPause
  scrubberEl: '#scrubber', //#scrubber
  playing: true,
  queue: [],
  status: '',
  volume: 0,

  play: function() {
    var self = this;
    $.ajax({
      type: 'PUT',
	    dataType: 'json',
	    url: '/playback/play',
	    success: function(data) {
        $(self.playEl).toggleClass('paused');
        self.playing = true;
        $(self).trigger('playChange', [{playing:self.playing}]);
        self.update();
	    }
	  });

    return self;
  },

  pause: function() {
    var self = this;
		$.ajax({
	    type: 'PUT',
	    dataType: 'json',
	    url: '/playback/pause',
	    success: function(data) {
        $(self.playEl).toggleClass('paused');
        self.playing = false;
        $(self).trigger('playChange', [{playing:self.playing}]);
        self.update();
	    }
	  });

    return self;
  },

  next: function() {
    var self = this;
		$.ajax({
	    type: 'POST',
	    dataType: 'json',
	    url: '/playback/next',
	    success: function(data) {
        $(self).trigger('songChange');
        self.update();
	    }
	  });

    return self;
  },

  previous: function() {
    var self = this;
		$.ajax({
	    type: 'POST',
	    dataType: 'json',
	    url: '/playback/previous',
	    success: function(data) {
        $(self).trigger('songChange');
        self.update();
	    }
	  });

    return self;
  },

  setVol: function(value) {
    var self = this;
		var url = '/playback/setvol?vol=' + value;
		$.ajax({
	    type: 'PUT',
	    dataType: 'json',
	    url: url,
	    success: function(data) {
        $(self).trigger('volumeChange');
        self.update();
	    }
	  });

    return self;
  },

  setCurrentSong: function(songId) {
    var queue = this.queue;
    for (var i = 0; i < queue.length; i++) {
      if (queue[i].Id === songId) {
        var title = queue[i].Title;
        var artist = queue[i].Artist;
        $(this.scrubberEl).html('<h3>' + title + '</h3><h4>' + artist + '</h4>');
      }
    }

    return this;
  },

  init: function(el) {
    var self = this;
    self.el = el;

	  $(self.playEl).click(function(){
	    if (self.playing) {
	      self.pause();
	      $(self.playEl).toggleClass('paused');
	    } else {
	      self.play();
	      $(self.playEl).toggleClass('paused');
	    }
	  });

	  $('#nextSong').click(function(e){
	    e.preventDefault();
      //TODO: This needs hooked to the new queue
	    //$('#playing').next('A').dblclick().end().attr('id', '');
      //TODO: Check play state when clicking next
	    //$('#playPause').toggleClass('paused');
      self.next();
	  });

	  $('#prevSong').click(function(e){
	    e.preventDefault();
      //TODO: This needs hooked to the new queue
	    //$('#playing').prev('A').dblclick().end().attr('id', '');
      //TODO: Check play state when clicking next
	    //$('#playPause').toggleClass('paused');
      self.previous();
	  });

    $('#volume').slider({
      min: 0,
      max: 100,
      value: 65,
      animate: true,
      slide: function(event, ui) {
        self.setVol(ui.value);
      }
    });

    /* Hotkeys */
    $('body').keypress(function(e){
      if (e.keyCode == '32') {
        $('#playPause').click();
      }
    });

    return self;
  },

  poll: function() {
    var self = this;
    self.update();

    var bindPoll = _.bind(self.poll, self);
    _.delay(bindPoll, 10*1000);

    return self;
  },

  update: function() {
    console.log('starting the play loop');
    var self = this;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: '/queue/list',
      success: function(queueData) {
        self.queue = queueData;
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: '/status',
          success: function(statusData) {
            // success callback
            self.status = statusData;
            if(statusData.state == 'play') {
              console.log('status playing');
              console.log('second inner status');
              self.setCurrentSong(statusData.songid);
              $('#volume').slider('value',statusData.volume);
            }
          }
        });
      }
    });
  }
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

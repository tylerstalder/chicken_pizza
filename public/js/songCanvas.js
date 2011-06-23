/* ------------- Main song list ------------ */

var songCanvas = function() {

  var songs = [];

  var populateSongs = function() {
    var html = '';
    for (var i=0; i < songs.length; i++) {
      html += '<a href="' + songs[i].file + '" title="' + songs[i].Artist + '">' + songs[i].Title + ' - ' + songs[i].Artist + ' - ' + Math.floor(songs[i].Time/60) + ':' + songs[i].Time % 60 + '</a>';
    };
    $('#songCanvas').html(html);
    songClickandPlay();
  };

  function songClickandPlay() {
    var sCan = $('#songCanvas');
    sCan.click(function(e){
      e.preventDefault();
      var target = $(e.target);
      sCan
      .find('.selected')
      .removeClass('selected');
      if (target.attr('href')) {
        target.addClass('selected');
      }
    });

    // this is where the double click handler used to live
    // sCan.dblclick(function(e){});
  }

  /* Hotkeys */
  $('body').keypress(function(e){
    if (e.keyCode == '32') {
      $('#playPause').click();
    }
  });

  return {
    init: function(){
      $('#browser').bind('songListChange', function(e, songList) {
        songs = songList;
        populateSongs();
      });
    }
  }
}();

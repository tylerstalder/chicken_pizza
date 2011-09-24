//less.env = "development";
//less.watch();

/* Main Site Scripts Go Here */

$(document).ready(function(){
  setupWindowResizing();
  setupLibraryCollapse();  

  var player = Object.create(playa);
  player.init('#controls').poll();

  var songList = Object.create(songCanvas);
  songList.init('#songCanvas');

  var chicken = Object.create(browser);
  chicken.init('#browser')
         .filter('#genres', 'Genre')
         .filter('#albums', 'Album')
         .filter('#artists', 'Artist');

  $(chicken).bind('songListChange', function(e, songUrl) {
    songList.getSongs(songUrl);
  });

  // have to wait to fire this until all the glue is wired up
  chicken.load();

});

/* ---------- Window Setup --------------- */

function setupWindowResizing() {
  var wrap = $('#wrap');
  wrap.height($(window).height() - $('#header').height());
  $('body').height($(window).height());
  
  $(window).resize(function(){
    wrap.height($(window).height() - $('#header').height());
    $('body').height($(window).height());
  });
}

function setupLibraryCollapse() {
  $('#library').click(function(e){
    var target = e.target;
    if(target.tagName == 'H2') {
      if(!$(target).hasClass('closed')) {
        $(target)
            .next('UL')
            .slideUp('fast')
          .end()
            .addClass('closed');
      } else {
        $(target)
            .next('UL')
            .slideDown('fast')
          .end()
            .removeClass('closed');
      }
    }
  });
}

/* ---------- Panel Resize tools --------------- */

$("#library").resizable({ 
  handles: 'e',
  resize: function(event, ui) {
    var w = $(window).width() - $('#library').outerWidth();
    $('#browser').width(w);
    $('#songCanvas').width(w);
  }
});

$('#browser')
  .width($(window).width() - $('#library').outerWidth())
  .resizable({ handles: 's', resize: function(e, ui) {
    $('#songCanvas')
      .height($(window).height() - $('#header').outerHeight() - $('#browser').outerHeight());
    $('#browser ul')
      .height($('#browser').height() - $('#browser h2').outerHeight() - $('#browser .ui-resizable-s').outerHeight());
  }});

$('#songCanvas')
  .width($(window).width() - $('#library').outerWidth())
  .height($(window).height() - $('#header').outerHeight() - $('#browser').outerHeight());
  
$('#browser ul')
  .height($('#browser').height() - $('#browser h2').outerHeight() - $('#browser .ui-resizable-s').outerHeight());
  
$(window).bind('resize', function() {
  $('#browser')
    .width($(window).width() - $('#library').outerWidth());
  $('#songCanvas')
    .width($(window).width() - $('#library').outerWidth())
    .height($(window).height() - $('#header').outerHeight() - $('#browser').outerHeight());
});

$('#playlists li')
  .bind('dblclick', function(e) {
    $(this).attr('contenteditable', 'true');
    $(this).focus();
  })
  .bind('blur', function(e) {
    $(this).attr('contenteditable', 'false');
  });

$('#controls a').bind('click', function(e) {
  e.preventDefault();
});


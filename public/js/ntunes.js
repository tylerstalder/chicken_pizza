//less.env = "development";
//less.watch();

/* Main Site Scripts Go Here */

$(document).ready(function(){
  setupWindowResizing();
  setupLibraryCollapse();  
  songCanvas.init();
  browser.init();
  playa.init();
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


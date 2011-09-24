/* ------------- Main song list ------------ */

var songCanvas = {
  el: '',
  songs: [],
  showSongs: function() {
    var html = '';
    var songs = this.songs;
    for (var i=0; i < songs.length; i++) {
      html += '<a href="' + songs[i].file + '" title="' + songs[i].Artist + '">' + songs[i].Title + ' - ' + songs[i].Artist + ' - ' + Math.floor(songs[i].Time/60) + ':' + songs[i].Time % 60 + '</a>';
    };
    $(this.el).html(html);

    return this;
  },
  getSongs: function(url) {
    var self = this;
    $(self.el).html('<a href="#" title="Loading...">Loading Catalog...</a>');
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: url,
      success: function(data) {
        self.songs = data;
        self.showSongs();
      }
    });

    return this;
  },
  init: function(el){
    var self = this;
    self.el = el;

    $(this.el).click(function(e){
      e.preventDefault();
      var target = $(e.target);
      $(self.el).find('.selected').removeClass('selected');
      if (target.attr('href')) {
        target.addClass('selected');
      }
    });

    // this is where the double click handler used to live
    // $(this.el).dblclick(function(e){});

    return this;
  }
};

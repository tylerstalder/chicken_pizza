var filter = {
  el: '',
  title: '',
  selected: [],
  options: [],
  base_query: function() {
    return '&filters[' + this.title + ']';
  },
  query: function() {
    if (this.selected.length === 0) {
      return this.base_query();
    } else {
      //TODO: the selected strings need to be encodeURIComponent
      return this.base_query() + '=' + this.selected.join(this.base_query() + '=');
    }
  },
  populate: function(genres) {
    var html = '';
    genres = _.uniq(genres);
    html += '<li class="all">All (' + genres.length + ' Genres)';
    for (var k=0; k < genres.length; k++) {
      html += '<li>' + genres[k] + '</li>'
    };
    $(this.el).find('ul').html(html);
    $(this.el).find('li:first').addClass('selected');

    return this;
  },
  select: function(selectedOptions) {
    _.each(this.options, function(opt) {
      if(opt === selectedOptions) {
        console.log('this filter was selected');
      }
    });

    return this;
  },
  init: function(el, title) {
    var self = this;
    self.el = el;
    self.title = title;

    //TODO: These should bubble to the parent instead of attaching to the li
    $(self.el).click(function(e) {
      e.preventDefault();
      var $tar = $(e.target);
      self.selected.push($tar.text());
      console.log(self.selected);
      $(self).trigger('filterSelect');
    });

    return this;
  }

};

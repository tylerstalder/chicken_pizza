/* ------------- 3 Column Browser for Genres, Artists, and Albums ------------ */
var browser = {
  el: '',
  url: '/search_and_filter?filters[Genre]&filters[Artist]&filters[Album]&query=',
  filters: [],
  events: [],
  filter: function(el, title) {
    var newFilter = Object.create(filter);
    newFilter.init(el, title);
    this.filters.push(newFilter);
    console.log(newFilter.query());
    return this;
  },
  load: function() {
    var self = this;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: self.url,
      success: function(data) {
        //TODO: this needs to be smarter, keys should auto match to filters
        self.filters[0].populate(data.Genre);
        self.filters[1].populate(data.Album);
        self.filters[2].populate(data.Artist);
      }
    });

    $(this).trigger('songListChange', '/all_tracks');
    return this;
  },
  init: function(el) {
    var self = this;
    self.el = el;

    $('#library li').click(function(e){
      e.preventDefault();

      var $el = $(self.el);
      var $tar = $(e.target);

      if ($tar.text() === 'Current Queue') {
        $el.hide();
        $(self).trigger('songListChange', '/queue/list');
      } else {
        $el.show();
        $(self).trigger('songListChange', '/all_tracks');
      }
    });

    return self;
  }
};

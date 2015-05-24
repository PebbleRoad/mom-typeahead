$(function() {
  var getSuggestions, init;
  console.log('ready..');
  getSuggestions = function() {
    return function(q, cb) {
      var matches;
      matches = [];
      return $.get('http://localhost:8983/solr/mom/autosuggest', {
        q: q
      }, function(res) {
        var data;
        data = JSON.parse(res);
        console.log(data.response.docs);
        return cb(data.response.docs);
      });
    };
  };
  init = function() {
    console.log('init..');
    return $('.typeahead').typeahead({
      minLength: 2,
      hint: true,
      highlight: true
    }, {
      name: 'pages',
      source: getSuggestions(),
      display: 'value'
    });
  };
  return init();
});

$(function() {
  var baseUrl, getSuggestions, init, pr_sanitize;
  console.log('ready..');
  baseUrl = 'http://momcorp.internet.dynawebsite.com';
  pr_sanitize = function(hash) {
    var str;
    str = hash.toLowerCase();
    str = str.replace(/\<(\/?)em\>/gi, '');
    str = str.replace(/[^a-z0-9_\s-]/gi, '');
    str = str.replace(/[\s-]+/gi, ' ');
    str = str.replace(/[\s_]/gi, '-');
    return '#' + str;
  };
  getSuggestions = function() {
    return function(q, cb) {
      var matches;
      matches = [];
      return $.get('http://localhost:8983/solr/mom/autosuggest', {
        q: q
      }, function(res) {
        var autosuggestData, data, docs;
        data = JSON.parse(res);
        docs = data.response.docs;
        autosuggestData = $.map(docs, function(item) {
          var doc;
          doc = {
            value: item.value
          };
          if (data.highlighting[item.id].subTitles != null) {
            doc.subTitle = data.highlighting[item.id].subTitles[0];
          }
          if (doc.subTitle != null) {
            doc.url = baseUrl + item.url + pr_sanitize(doc.subTitle);
          }
          return doc;
        });
        return cb(autosuggestData);
      });
    };
  };
  init = function() {
    var opts;
    console.log('init..');
    opts = {
      name: 'pages',
      source: getSuggestions(),
      display: 'value',
      templates: {
        suggestion: Handlebars.compile('<div class="autosuggest-item">{{value}}<br/><a class="subtitle" href="{{url}}">{{{subTitle}}}</a></div>')
      }
    };
    return $('.typeahead').typeahead({
      minLength: 2,
      hint: true,
      highlight: true
    }, opts);
  };
  return init();
});

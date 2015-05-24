$ ->
  console.log 'ready..'

  getSuggestions = ->
    (q, cb) ->
      matches = []
      $.get 'http://localhost:8983/solr/mom/autosuggest', { q: q }, (res) ->
        data = JSON.parse res
        console.log data.response.docs
        cb data.response.docs

  init = ->
    console.log 'init..'
    $('.typeahead').typeahead { minLength: 2, hint: true, highlight: true }, { name: 'pages', source: getSuggestions(), display: 'value' }

  init()
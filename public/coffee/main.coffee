$ ->
  console.log 'ready..'

  baseUrl = 'http://momcorp.internet.dynawebsite.com'

  # adapted from: https://github.com/PebbleRoad/mom/blob/master/parser/shortcodes.mapping.php#L251-L261
  pr_sanitize = (hash) ->

    # lower case everything
    str = hash.toLowerCase()
    # remove solr's <em> tags..
    str = str.replace(/\<(\/?)em\>/gi, '')
    # make alphanumeric (removes all other characters)
    str = str.replace(/[^a-z0-9_\s-]/gi, '')
    # clean up multiple dashes or whitespaces
    str = str.replace(/[\s-]+/gi, ' ')
    # convert whitespaces and underscore to dash
    str = str.replace(/[\s_]/gi, '-')

    return '#' + str

  getSuggestions = ->
    (q, cb) ->
      matches = []
      $.get 'http://localhost:8983/solr/mom/autosuggest', { q: q }, (res) ->

        data = JSON.parse res
        docs = data.response.docs
        
        autosuggestData = $.map docs, (item) ->
          doc = { value: item.value }
          doc.subTitle = data.highlighting[item.id].subTitles[0] if data.highlighting[item.id].subTitles?
          doc.url = baseUrl + item.url + pr_sanitize(doc.subTitle) if doc.subTitle?
          return doc

        cb autosuggestData

  init = ->
    console.log 'init..'
    opts = {
      name: 'pages'
      source: getSuggestions()
      display: 'value'
      templates: {
        suggestion: Handlebars.compile('<div class="autosuggest-item">{{value}}<br/><a class="subtitle" href="{{url}}">{{{subTitle}}}</a></div>')
      }
    }
    $('.typeahead').typeahead { minLength: 2, hint: true, highlight: true }, opts

  init()
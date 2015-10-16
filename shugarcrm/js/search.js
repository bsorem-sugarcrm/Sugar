var Search = (function() {
  'use strict';

  function Search(form, container) {
    var _this = this;

    this.data = {};
    this.apiUrl = '/public/api/v1/search';
    this.queryString = '';
    this.$searchForm = $(form);
    this.$resultsBlock = $(container);
    this.$results = this.$resultsBlock.find('.results');
    this.$pagination = this.$resultsBlock.find('.pagination');

    if (window.location.search) {
      this.searchCriteriaToQuery();
      this.updateForm();
      this.doSearch();
    }
  };

  /**
   * Render results
   */
  Search.prototype.render = function() {
    if (typeof tmpl === 'undefined') {
      throw new Error('JS template engine doesn\'t found');
    }

    this.$results.html(tmpl('search_results', {
      data: this.data,
      params: {
        query: this.query,
        count: this.data.data.length || 0
      }
    }));

    this.$resultsBlock.removeClass('loading');
  };

  /**
   * Convert search criteria from URL to API query
   */
  Search.prototype.searchCriteriaToQuery = function() {
    var query,
        tags = [],
        criteria = window.location.search.substr(1).split('&');

    for (var i = 0; i < criteria.length; i++) {
      if (criteria[i].indexOf('tag') > -1) {
        if(criteria[i].indexOf('All+edition') == -1)
          tags.push(criteria[i].substr(5));
      } else {
        query = criteria[i].substr(2);
      }
    }

    // Store criteria
    this.criteria = criteria;

    // Store query
    this.query = query;

    // Generate query string
    this.queryString = 'q=' + (query ? query + (tags.length ? ' AND ' : '') : '') + (tags.length ? 'tags:' + tags.join(',') : '');
  };

  /**
   * Update search form
   */
  Search.prototype.updateForm = function() {
    var criteria, $input, $filter, value;

    for (var i = 0; i < this.criteria.length; i++) {
      criteria = this.criteria[i].split('=');
      $input = $('[name=' + criteria[0] + ']');
      $filter = $('[name=filter_' + criteria[0] + ']');

      value = Utils.stripTags(criteria[1]);

      $input.val(value);
      $filter.val(value);

      if ($.fn.selectpicker) {
        $input.selectpicker('val', value);
      }
    }
  };

  /**
   * Run search
   */
  Search.prototype.doSearch = function() {
    this.$resultsBlock.addClass('loading');

    return this.fetch()
      .done(this.render.bind(this));
  };

  /**
   * Fetch data from remote API
   */
  Search.prototype.fetch = function() {
    var _this = this;

    return $.ajax({
        url: this.apiUrl,
        data: this.queryString
      })
      .done(function(res) {
        _this.data = res;
      });
  };

  return Search;
})();

$(function() {
  'use strict';

  var search = new Search('#searchForm', '#search-box');
});
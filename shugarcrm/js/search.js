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

  Search.prototype.searchCriteriaToQuery = function() {
    var query,
        tags = [],
        criteria = window.location.search.substr(1).split('&');

    for (var i = 0; i < criteria.length; i++) {
      if (criteria[i].indexOf('tag') > -1) {
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

  Search.prototype.updateForm = function() {
    var criteria, $input, $filter, value,
        replace = new RegExp("\\+",'g');

    for (var i = 0; i < this.criteria.length; i++) {
      criteria = this.criteria[i].split('=');
      $input = $('[name=' + criteria[0] + ']');
      $filter = $('[name=filter_' + criteria[0] + ']');

      value = criteria[1].indexOf('+') > -1 ? Utils.stripTags(criteria[1]) : criteria[1];

      $input.val(value);
      $filter.val(value);

      if ($.fn.selectpicker) {
        $input.selectpicker('val', value);
      }
    }
  };

  Search.prototype.doSearch = function() {
    this.fetch()
      .done(this.render.bind(this));
  };

  Search.prototype.fetch = function() {
    var _this = this;

    this.$resultsBlock.addClass('loading');

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
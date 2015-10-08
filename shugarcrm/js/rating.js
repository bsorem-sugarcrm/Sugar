/**
 * Star rating
 */
(function($) {
  'use strict';

  $.fn.starRating = function(opt) {
    var options = $.extend({
      url: '/',
      ratingCount: 5
    }, opt);

    function Rating(el, options) {
      var canVote = true;

      Object.defineProperty(this, 'canVote', {
        get: function() {
          // Set method to check if user is able to vote
          return canVote;
        },
        set: function(val) {
          // Set method to store if user is already voted
          canVote = val;
        }
      });

      this.$el = $(el);
      this.loading = false;
      this.options = options;
      this.data = this.getInitialData();
      this.controls = {
        $ratingBlock: this.$el.find('.raiting'),
        $raitingHover: this.$el.find('.raiting-hover'),
        $raitingVotes: this.$el.find('.raiting-votes'),
        $raitingResult: this.$el.find('.rating-result')
      };

      this.initialize();
    };

    Rating.prototype.initialize = function() {
      var _this = this, votesWidht, userVote;

      // Set current rating
      this.controls.$raitingVotes.width(this.getVotesWidth(this.data.currentRating));

      this.controls.$ratingBlock
        .toggleClass('can-vote', _this.canVote)
        .mousemove(function(e) {
          if (_this.canVote) {
            votesWidht = e.pageX - $(this).offset().left || 1;
            userVote = Math.ceil(votesWidht * _this.options.ratingCount / $(this).width());

            _this.controls.$raitingHover.width(_this.getVotesWidth(userVote));
          }
        })
        .click(function(e) {
          if (_this.canVote) {
            _this.vote(userVote);
          }
        });
    };

    Rating.prototype.getInitialData = function() {
      var _data = this.$el.data();

      return {
        currentRating: _data.rating || 0,
        cid: _data.cid || null
      };
    };

    Rating.prototype.getVotesWidth = function(rating) {
      return (rating * 100 / this.options.ratingCount + '%');
    };

    Rating.prototype.vote = function(vote) {
      if (this.loading) {
        return;
      }

      var _this = this,
          data = {
            cid: this.data.cid,
            vote: vote
          };

      this.loading = true;
      this.controls.$raitingResult.html('Loading...');

      // TODO: remove this in real project
      console.log(data);
      window.setTimeout(function() {
        _this.controls.$raitingResult.html('<p class="text-success">Thank You for Your voting!</p>');
        _this.controls.$raitingVotes.width(_this.getVotesWidth(vote));
        _this.controls.$ratingBlock.removeClass('can-vote').unbind();
        _this.canVote = false;
        _this.loading = false;
      }, 300);

      /*$.ajax({
        type: 'GET',
        url: this.options.url,
        data: $.param(data),
      })
      .done(function(res) {
        _this.controls.$raitingResult.html('<p class="text-success">Thank You for Your voting!</p>');
        _this.controls.$raitingVotes.width(this.getVotesWidth(vote));
        _this.controls.$ratingBlock.removeClass('can-vote').unbind();
        _this.canVote = false;
        _this.loading = false;
      })
      .fail(function(err) {
        _this.controls.$raitingResult.html('<p class="text-danger">Error!</p>');
        _this.canVote = true;
        _this.loading = false;
      });*/
    };

    return this.each(function() {
      new Rating(this, options);
    });
  };
})(jQuery);
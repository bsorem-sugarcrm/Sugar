$(function() {
  // Custom select picker
  if ($.fn.selectpicker) {
    $('.custom-select').selectpicker();
  }

  // Scroll to top
  if ($.fn.pageScroller) {
    $('.scroll-to-top').pageScroller();
  }

  // Star rating
  if ($.fn.starRating) {
    $('.star-rating').starRating();
  }

  // Video modal trigger
  if ($.fn.videoModalTrigger) {
    $('.video-trigger').videoModalTrigger({ autoplay: true });
  }
});

/**
 * Video modal trigger
 */
(function($) {
  'use strict';

  $.fn.videoModalTrigger = function(opt) {
    var options = $.extend({
      autoplay: false
    }, opt);

    return this.each(function() {
      var $link = $(this),
          $videoModal = $($link.data('target')),
          $videoFrame = $videoModal.find('iframe');

      $link.click(function() {
        $videoFrame.attr('src', $link.data('video') + (options.autoplay ? '?autoplay=1' : ''));

        $videoModal.on('hidden.bs.modal', function() {
          $videoFrame.attr('src', '');
        });
      });
    });
  };
})(jQuery);

/**
 * Page scroller
 */
(function($) {
  'use strict';

  $.fn.pageScroller = function(opt) {
    var options = $.extend({
      speed: 300,
      activeClass: 'visible'
    }, opt);

    function Scroller(btn, options) {
      var _this = this,
          $btn = $(btn);

      this.scrollTop = function() {
        $('body, html').animate({
          scrollTop: 0
        }, options.speed);
      };

      $(window).scroll(function() {
        $btn.toggleClass(options.activeClass, $(this).scrollTop() > 0);
      });

      $btn.click(function(e) {
        e.preventDefault();

        _this.scrollTop();
      });
    };

    return this.each(function() {
      new Scroller(this, options);
    });
  };
})(jQuery);
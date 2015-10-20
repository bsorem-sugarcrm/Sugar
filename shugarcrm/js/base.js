/**
 * Simple JavaScript Templating
 */
(function() {
  var cache = {};

  this.tmpl = function tmpl(str, data) {
    var fn = !/\W/.test(str) ?
    cache[str] = cache[str] ||
      tmpl(document.getElementById(str).innerHTML) :
    new Function("obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +
      "with(obj){p.push('" +
      str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
      + "');}return p.join('');");

    return data ? fn( data ) : fn;
  };
})();

/**
 * Utils
 */
(function() {
  this.Utils = {
    strCut: function(str, num) {
      if (str.length <= num) {
        return str;
      }

      var string = str.substring(0, num),
        pos = string.lastIndexOf(' ');

      if (pos > 0) {
        string = string.substring(0, pos) + '...';
      }

      return string;
    },

    stripTags: function(str) {
      var replace = new RegExp("\\+", 'gi');

      return str.replace(replace, ' ');
    }, 
    getAbbreviatedEdition: function(edition) {
      var ed = "";
      switch(edition){
        case "Corporate": ed = "Corp"; break;
        case "Community Edition" : ed = "CE"; break;
        default : ed = edition.substring(0,3);
      }
      return ed;
    },

    transformTableToDivs: function(){
      var div = document.createElement('div');
      div.setAttribute("class", "row");
      $("section .content-body").append(div);
      $(".container table td").each(function(){
        var divs = document.createElement('div');
        divs.setAttribute("class", "col-sm-6 col-md-3 content-col");
        var h2 = document.createElement('h2');
        h2.innerHTML = $("h3", this).text();
        divs.appendChild(h2);

        var ul = document.createElement('ul');
        ul.setAttribute('class','plain-list');
        divs.appendChild(ul);
        $("li", this).each(function(){
          var li = document.createElement('li');
          li.innerHTML = $(this).html();
          ul.appendChild(li);
        });
        div.appendChild(divs);
      }); 
      $(".container table td").remove();
    }
  };
})();

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

  //Select sub-nav active
  if ($.fn.selectSubNav) {
    $('.sub-nav').selectSubNav();
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

/*
 * Select Sub-Nav for active section
 */
(function($) {
  'use strict';

  $.fn.selectSubNav = function() {

    var url = window.location.href;
    if(url.indexOf("Knowledge_Base") > -1){
      $("#sub-nav li:nth-child(1)").toggleClass("active");
    }else if(url.indexOf("Get_Started") > -1){
      $("#sub-nav li:nth-child(2)").toggleClass("active");
    }else if(url.indexOf("Documentation") > -1){
      $("#sub-nav li:nth-child(3)").toggleClass("active");
    }

  };
})(jQuery);



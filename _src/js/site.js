/* Scripts */

//Site

var Site = (function($) {

  return {

    init: function() {
      this.cacheDom();
      this.bindEvents();
    },

    cacheDom: function() {
      this.$site = $('html');
    },

    bindEvents: function() {

    }

  };

})(jQuery);


//On Document Ready
$(function() {

  Site.init();

});

//On Window Load
$(window).load(function() {

});
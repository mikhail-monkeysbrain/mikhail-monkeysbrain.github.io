// animation header
function _test() {
  $(window).scroll(function() {
    (window.scrollY > 100) ? $('.header').addClass('header-active') : $('.header').removeClass('header-active')
  })
}

// faq
function _faq() {
  $('.ac_head').click(function() {
    $(this).next().stop().slideToggle().toggleClass('js_up')
  }).next().stop().hide()
  $('.ac_head').click(function() {
    $(this).find('.ac_head__dot').toggleClass('expand')
  })
}


// animation on show
function _scroll() {
  jQuery.fn.extend({
    onAppearanceAddClass: function(class_to_add) {
      var $window = $( window ),
          window_height = $window.height(),
          array_of_$elements = [];
      this.each(function(i,el) {
        array_of_$elements.push($( el ));
      })
      scrollHandler();
      if (array_of_$elements.length) {
        $window.on('resize', resizeHandler).on('resize', scrollHandler).on('scroll', scrollHandler);
      }
      function resizeHandler() {
        window_height = $window.height();
      }
      function watchProcessedElements(array_of_indexes) {
        var l, i;
        for (l = array_of_indexes.length, i = l - 1; i > -1; --i) {
          array_of_$elements.splice(array_of_indexes[i], 1);
        }
        if (!array_of_$elements.length) {
          $window.off('resize', resizeHandler).off('scroll', scrollHandler).off('resize', scrollHandler);
        }
      }
      function scrollHandler() {
        var i, l, processed = [];
        for ( l = array_of_$elements.length, i = 0; i < l; ++i ) {
          if ($window.scrollTop() + window_height > array_of_$elements[i].offset().top) {
            array_of_$elements[i].addClass(class_to_add);
            processed.push(i);
          }
        }
        if (processed.length) {
          watchProcessedElements(processed);
        }
      }
      return this;
    }
  })
  $('.grid > section').onAppearanceAddClass('animated');
}

function _counters() {
  $('.animated .jsCounter').each(function() {
    $(this).prop('Counter', 0).animate({
      Counter: $(this).text()
    }, {
      duration: 5000,
      easing: 'swing',
      step: function(now) {
        $(this).text(Math.ceil(now));
      }
    });
  });
}

$(document).ready(
  _test(),
  _faq(),
  _scroll(),
  _counters()
)
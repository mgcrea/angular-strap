'use strict';

angular.module('$strap.directives')

.directive('bsNavbar', function($location) {

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs, controller) {
      // Watch for the $location
      scope.$watch(function() {
        return $location.path();
      }, function(newValue, oldValue) {

        $('li[data-match-route]', element).each(function(k, li) {
          var $li = angular.element(li),
            // data('match-route') does not work with dynamic attributes
            pattern = $li.attr('data-match-route'),
            regexp = new RegExp('^' + pattern + '$', ['i']);

          if(regexp.test(newValue)) {
            $li.addClass('active');
            var $collapse = $li.find('.collapse.in');
            if($collapse.length) $collapse.collapse('hide');
          } else {
            $li.removeClass('active');
          }

        });
      });
    }
  };
});

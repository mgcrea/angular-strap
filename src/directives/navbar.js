/* global define:false, angular:false */

/* Adapted from patterns at https://github.com/umdjs/umd. */
(function(factory) {

  if (typeof define === 'function' && define.amd) {
    define(['../common'], function () {
      factory(angular);
    });
  } else {
    factory(angular);
  }

}(function(angular) {

angular.module('$strap.directives')

.directive('bsNavbar', ['$location', function($location) {
  'use strict';

  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs, controller) {
      // Watch for the $location
      scope.$watch(function() {
        return $location.path();
      }, function(newValue, oldValue) {

        $('li[data-match-route]', element).each(function(k, li) {
          var $li = angular.element(li),
            // data('match-rout') does not work with dynamic attributes
            pattern = $li.attr('data-match-route'),
            regexp = new RegExp('^' + pattern + '$', ["i"]);

          if(regexp.test(newValue)) {
            $li.addClass('active');
          } else {
            $li.removeClass('active');
          }

        });
      });
    }
  };
}]);

}));

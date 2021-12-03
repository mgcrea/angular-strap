/**
 * angular-strap
 * @version v2.3.12 - 2021-12-03
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.helpers.focusElement', []).directive('focusElement', [ '$timeout', '$parse', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusElement, function(value) {
        if (value === true) {
          $timeout(function() {
            $(element[0]).animate({
              left: 0
            }, 100, function() {
              element[0].focus();
            });
          });
        }
      });
    }
  };
} ]);
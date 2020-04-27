/**
 * angular-strap
 * @version v2.3.12 - 2020-04-27
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.helpers.ngFocusOut', []).directive('ngFocusOut', [ '$parse', '$rootScope', function($parse, $rootScope) {
  return {
    restrict: 'A',
    compile: function($element, attr) {
      var fn = $parse(attr.ngFocusOut);
      return function link(scope, element) {
        function ngEventHandler(event) {
          var callback = function() {
            fn(scope, {
              $event: event
            });
          };
          if ($rootScope.$$phase) {
            scope.$evalAsync(callback);
          } else {
            scope.$apply(callback);
          }
        }
        element.on('focusout', ngEventHandler);
        scope.$on('$destroy', function() {
          element.off('focusout', ngEventHandler);
        });
      };
    }
  };
} ]);
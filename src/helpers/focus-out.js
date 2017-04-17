'use strict';

angular.module('mgcrea.ngStrap.helpers.ngFocusOut', [])
  .directive('ngFocusOut', ['$parse', '$rootScope', function ($parse, $rootScope) {
    return {
      restrict: 'A',
      compile: function ($element, attr) {
        // NOTE:
        // We expose the powerful `$event` object on the scope that provides access to the Window,
        // etc. This is OK, because expressions are not sandboxed any more (and the expression
        // sandbox was never meant to be a security feature anyway).
        var fn = $parse(attr.ngFocusOut);

        return function link (scope, element) {
          function ngEventHandler (event) {
            var callback = function () {
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

          // setup the handler
          element.on('focusout', ngEventHandler);

          scope.$on('$destroy', function () {
            // tear down the handler
            element.off('focusout', ngEventHandler);
          });
        };
      }
    };
  }]);

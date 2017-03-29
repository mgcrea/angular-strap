'use strict';

angular.module('mgcrea.ngStrap.helpers.focusElement', [])
  .directive('focusElement', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
      link: function (scope, element, attrs) {
        scope.$watch(attrs.focusElement, function (value) {
          if (value === true) {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
      }
    };
  }]);

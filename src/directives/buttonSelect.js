/* global define:false, angular:false */

/* Adapted from patterns at https://github.com/umdjs/umd. */
(function(factory) {

  if (typeof define === 'function' && define.amd) {
    define(['../common'], function () {
      factory(angular)
    })
  } else {
    factory(angular)
  }

}(function(angular) {

angular.module('$strap.directives')

.directive('bsButtonSelect', ['$parse', '$timeout', function($parse, $timeout) {
  'use strict';

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attrs, ctrl) {

      // Bind ngModelController
      if(ctrl) {
        element.text(scope.$eval(attrs.ngModel));
        // Watch model for changes
        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          element.text(newValue);
        });
      }

      // Click handling
      var values, value, index, newValue;
      element.bind('click', function(ev) {
        values = getter(scope);
        value = ctrl ? scope.$eval(attrs.ngModel) : element.text();
        index = values.indexOf(value);
        newValue = index > values.length - 2 ? values[0] : values[index + 1];
        console.warn(values, newValue);

        scope.$apply(function() {
          element.text(newValue);
          if(ctrl) {
            ctrl.$setViewValue(newValue);
          }
        });
      });
    }
  };

}]);

}))
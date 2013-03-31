
angular.module('$strap.directives')

.directive('bsSelect', function() {
  'use strict';

  return {

    scope: true,

    link: function (scope, element, attrs) {

      var previousClasses = element.attr('class');

      var syncClasses = function () {
        var currentClasses = element.attr('class');
        element.next().removeClass(previousClasses).addClass(currentClasses).removeClass('ng-scope');
        previousClasses = element.attr('class');
      };

      // Watch for changes to the length of our select element
      scope.$watch(function () {
        return element[0].length;
      }, function () {
        element.selectpicker('render');
      });

      // Watch for changes to the model value
      scope.$watch(attrs.ngModel, function () {
        element.selectpicker('render');
        syncClasses();
      });

    }

  };

});

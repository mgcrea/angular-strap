
angular.module('$strap.directives')

.directive('bsTypeahead', ['$parse', function($parse) {
  'use strict';

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function postLink(scope, element, attr, controller) {

      var getter = $parse(attr.bsTypeahead),
      setter = getter.assign;

      element.attr('data-provide', 'typeahead');
      element.typeahead({
        source: getter(scope),
        items: attr.items,
        updater: function(value) {
          // If we have a controller (i.e. ngModelController) then wire it up
          if(controller) {
            scope.$apply(function () {
              controller.$setViewValue(value);
            });
          }
          return value;
        }
      });

    }
  };

}]);

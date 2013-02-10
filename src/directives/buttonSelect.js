
angular.module('$strap.directives')

.directive('bsButtonSelect', ['$parse', '$timeout', function($parse, $timeout) {
	'use strict';

	var isTouch = 'ontouchstart' in window;

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function postLink(scope, element, attr, ctrl) {

			var getter = $parse(attr.bsButtonSelect),
				setter = getter.assign;

			// Bind ngModelController
			if(ctrl) {
				element.text(scope.$eval(attr.ngModel));
				// Watch model for changes
				scope.$watch(attr.ngModel, function(newValue, oldValue) {
					element.text(newValue);
				});
			}


			// Click handling
			var values, value, index, newValue;
			element.on(isTouch ? 'touchstart.bsButtonSelect.data-api' : 'click.bsButtonSelect.data-api', function(ev) {
				values = getter(scope);
				value = ctrl ? scope.$eval(attr.ngModel) : element.text();
				index = values.indexOf(value);
				newValue = index > values.length - 2 ? values[0] : values[index + 1];

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

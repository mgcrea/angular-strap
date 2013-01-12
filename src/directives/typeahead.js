
angular.module('$strap.directives')

.directive('bsTypeahead', ['$parse', function($parse) {
	'use strict';

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function postLink(scope, element, attr, controller) {

			var getter = $parse(attr.bsTypeahead),
					setter = getter.assign,
					value = getter(scope);

			// Watch bsTypeahead for changes
			scope.$watch(attr.bsTypeahead, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					value = newValue;
				}
			});

			element.attr('data-provide', 'typeahead');
			element.typeahead({
				source: function(query) { return value; },
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

			// add entered element into typeahead array for other fields
			element.bind('blur', function() {
				var new_value = element.val();
				if ( new_value.length > 1 && $.inArray( new_value, value ) === -1 ) { // IE doesn't have .indexOf
					scope.$apply( function() {
						value.unshift( element.val() );
					});
				}
			});

		}
	};

}]);

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
			
			var dataSource = $parse(attr.bsTypeaheadQuery);
                        
                        // the bs-typeahead-query contains the name of a function declared in the current scope
                        // that will be used as the data-source
                        if (dataSource.name != "noop") {
                            dataSource = dataSource(scope);
                        }
                        else {
                       	    // if the attribute isn't defined use the value scope attribute
                            dataSource = function(query) { return value; };
                        }
                        
			element.typeahead({
				source: dataSource,
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

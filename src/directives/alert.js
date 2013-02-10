
angular.module('$strap.directives')

.directive('bsAlert', ['$parse', '$timeout', '$compile', function($parse, $timeout, $compile) {
	'use strict';

	return {
		restrict: 'A',
		link: function postLink(scope, element, attrs) {

			var getter = $parse(attrs.bsAlert),
				setter = getter.assign,
				value = getter(scope);

			// For static alerts
			if(!attrs.bsAlert) {

				// Setup close button
				if(angular.isUndefined(attrs.closeButton) || (attrs.closeButton !== '0' && attrs.closeButton !== 'false')) {
					element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
				}

			} else {

				scope.$watch(attrs.bsAlert, function(newValue, oldValue) {
					value = newValue;

					// Set alert content
					element.html((newValue.title ? '<strong>' + newValue.title + '</strong>&nbsp;' : '') + newValue.content || '');

					if(!!newValue.closed) {
						element.hide();
					}

					// Compile alert content
					//$timeout(function(){
					$compile(element.contents())(scope);
					//});

					// Add proper class
					if(newValue.type || oldValue.type) {
						oldValue.type && element.removeClass('alert-' + oldValue.type);
						newValue.type && element.addClass('alert-' + newValue.type);
					}

					// Setup close button
					if(angular.isUndefined(attrs.closeButton) || (attrs.closeButton !== '0' && attrs.closeButton !== 'false')) {
						element.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');
					}

				}, true);

			}

			element.addClass('alert').alert();

			var parentArray = attrs.ngRepeat && attrs.ngRepeat.split(' in ').pop();

			element.on('close', function(ev) {

				if(parentArray) { // ngRepeat, remove from parent array
					element.hide();
					ev.preventDefault();
					scope.$parent.$apply(function() {
						scope.$parent[parentArray].splice(scope.$index, 1);
					});
				} else if(value) { // object, set closed property to 'true'
					ev.preventDefault();
					scope.$apply(function() {
						value.closed = true;
					});
				} else { // static, regular behavior
				}

			});

		}
	};
}]);

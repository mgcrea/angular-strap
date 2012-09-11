
angular.module('$strap.directives')

.directive('bsButton', ['$parse', function($parse) {

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function postLink(scope, element, attr, ctrl) {
			//console.warn('postLink', this, arguments);

			element.attr('data-toggle', 'button');

			scope.$watch(attr.ngModel, function(newValue, oldValue) {
				if(!newValue) element.removeClass('active')
				else element.addClass('active');
			});

			element.on('click', function(ev) {
				var getter = $parse(attr.ngModel),
					setter = getter.assign;
				setter(scope, attr.value || !getter(scope));
			});

		}
	}

}])
